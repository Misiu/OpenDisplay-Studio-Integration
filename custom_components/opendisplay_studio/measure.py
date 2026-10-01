"""
Measure what the ODL renderer draws, so the editor's boxes match the pixels.

Text is measured with the renderer's own `measure_text` and fonts. A QR code is
sized with the same `qrcode` settings the renderer uses, because the number of
modules grows with the amount of data.
"""

from __future__ import annotations

from collections.abc import Callable
from functools import lru_cache
from math import ceil
from typing import Any, Final

import qrcode  # type: ignore[import-untyped]
from odl_renderer import FontManager, measure_text  # type: ignore[import-untyped]
from PIL import Image, ImageDraw, ImageFont

from custom_components.opendisplay_studio.odl import Box

DEFAULT_FONT: Final = "ppb.ttf"
_FONTS: Final = FontManager()


@lru_cache(maxsize=64)
def qr_modules(data: str) -> int:
    """Return how many modules wide the renderer makes the QR code for `data`."""
    code = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
    )
    code.add_data(data)
    code.make(fit=True)
    return int(code.modules_count)


def qr_side(data: str, boxsize: int, border: int) -> int:
    """Return the width and height in pixels of the rendered QR code."""
    return (qr_modules(data) + 2 * border) * boxsize


def _ink_right(line: str, font: ImageFont.FreeTypeFont, height: int) -> int:
    """
    Return where the pixels of `line` end, drawn the way the renderer draws text.

    The renderer draws text without anti-aliasing. Font outline metrics, even
    for that mode, include spacing after the last glyph, so the bitmap is drawn
    and its ink measured instead.
    """
    padding = int(font.size)
    canvas = Image.new("1", (ceil(font.getlength(line)) + 2 * padding, height + 4))
    draw = ImageDraw.Draw(canvas)
    draw.fontmode = "1"
    draw.text((0, 0), line, font=font, fill=1, anchor="la")
    ink = canvas.getbbox()
    return ink[2] if ink else 0


@lru_cache(maxsize=8192)
def text_size(  # noqa: PLR0913
    value: str,
    size: int,
    font_name: str = DEFAULT_FONT,
    *,
    spacing: int = 5,
    stroke_width: int = 0,
    max_width: int | None = None,
    truncate: bool = False,
    parse_colors: bool = True,
) -> tuple[int, int]:
    """
    Return the width and height in pixels of the text block the renderer draws.

    The height is the font's ascent plus descent for every line, so it always
    contains the glyphs. The width ends exactly where the widest line's ink ends.
    """
    font = _FONTS.get_font(font_name, size)
    metrics = measure_text(
        value,
        font,
        max_width,
        truncate=truncate,
        spacing=spacing,
        stroke_width=stroke_width,
        parse_colors=parse_colors,
    )
    width = max(_ink_right(line, font, metrics.height) for line in metrics.lines)
    return max(1, width + stroke_width), max(1, metrics.height)


_HORIZONTAL_ANCHOR: Final = {"l": 0.0, "m": 0.5, "r": 1.0}


def anchored_box(
    x: int, y: int, size: tuple[int, int], anchor: str, ascent: int | None = None
) -> Box:
    """
    Return the box of a block of `size` drawn at (x, y) with a Pillow text anchor.

    The first anchor letter is horizontal (left, middle, right); the second is
    vertical (ascender or top, middle, baseline, bottom or descender).
    """
    width, height = size
    left = x - round(width * _HORIZONTAL_ANCHOR[anchor[0]])
    match anchor[1]:
        case "m":
            top = y - round(height / 2)
        case "s":
            top = y - (height if ascent is None else ascent)
        case "b" | "d":
            top = y - height
        case _:
            top = y
    return Box(left, top, width, height)


def _union(boxes: list[Box]) -> Box:
    left = min(box.x for box in boxes)
    top = min(box.y for box in boxes)
    right = max(box.x + box.width for box in boxes)
    bottom = max(box.y + box.height for box in boxes)
    return Box(left, top, right - left, bottom - top)


def _text_box(primitive: dict[str, Any]) -> Box:
    """Box of a `text` element: wrapped, truncated and anchored as the renderer does."""
    max_width = primitive.get("max_width")
    value = primitive["value"]
    font_name = primitive.get("font", DEFAULT_FONT)
    size = text_size(
        value,
        primitive["size"],
        font_name,
        spacing=primitive.get("spacing", 5),
        stroke_width=primitive.get("stroke_width", 0),
        max_width=max_width,
        truncate=bool(primitive.get("truncate")),
        parse_colors=bool(primitive.get("parse_colors")),
    )
    default_anchor = "la" if "\n" in value or max_width else "lt"
    anchor = primitive.get("anchor") or default_anchor
    ascent = _FONTS.get_font(font_name, primitive["size"]).getmetrics()[0]
    return anchored_box(primitive["x"], primitive["y"], size, anchor, ascent)


def _multiline_box(primitive: dict[str, Any]) -> Box:
    """Box around every line of a `multiline` element, one `offset_y` below the last."""
    lines = primitive["value"].replace("\n", "").split(primitive["delimiter"])
    anchor = primitive.get("anchor", "lm")
    boxes = [
        anchored_box(
            primitive["x"],
            primitive["y"] + index * primitive["offset_y"],
            text_size(
                line,
                primitive["size"],
                primitive.get("font", DEFAULT_FONT),
                stroke_width=primitive.get("stroke_width", 0),
                parse_colors=bool(primitive.get("parse_colors")),
            ),
            anchor,
        )
        for index, line in enumerate(lines)
    ]
    return _union(boxes)


def _icon_box(primitive: dict[str, Any]) -> Box:
    size = primitive["size"]
    return anchored_box(
        primitive["x"], primitive["y"], (size, size), primitive.get("anchor", "la")
    )


def _icon_sequence_box(primitive: dict[str, Any]) -> Box:
    """Box around a row or column of icons, each one `size + spacing` after the last."""
    size = primitive["size"]
    spacing = primitive.get("spacing")
    step = size + (size // 4 if spacing is None else spacing)
    dx, dy = {"right": (1, 0), "left": (-1, 0), "down": (0, 1), "up": (0, -1)}[
        primitive.get("direction", "right")
    ]
    anchor = primitive.get("anchor", "la")
    return _union(
        [
            anchored_box(
                primitive["x"] + dx * step * index,
                primitive["y"] + dy * step * index,
                (size, size),
                anchor,
            )
            for index in range(len(primitive["icons"]))
        ]
    )


def _pattern_box(primitive: dict[str, Any]) -> Box:
    """Box around the whole grid; each cell is drawn one pixel larger than its size."""
    columns, rows = primitive["x_repeat"], primitive["y_repeat"]
    return Box(
        primitive["x_start"],
        primitive["y_start"],
        (columns - 1) * (primitive["x_size"] + primitive["x_offset"])
        + primitive["x_size"]
        + 1,
        (rows - 1) * (primitive["y_size"] + primitive["y_offset"])
        + primitive["y_size"]
        + 1,
    )


def _polygon_box(primitive: dict[str, Any]) -> Box:
    xs = [point[0] for point in primitive["points"]]
    ys = [point[1] for point in primitive["points"]]
    return Box(min(xs), min(ys), max(xs) - min(xs) + 1, max(ys) - min(ys) + 1)


def _radial_box(primitive: dict[str, Any]) -> Box:
    """Box of the circle an arc or a circle is cut from."""
    radius = primitive["radius"]
    return Box(
        primitive["x"] - radius,
        primitive["y"] - radius,
        radius * 2 + 1,
        radius * 2 + 1,
    )


def _qr_box(primitive: dict[str, Any]) -> Box:
    side = qr_side(primitive["data"], primitive["boxsize"], primitive["border"])
    return Box(primitive["x"], primitive["y"], side, side)


def _image_box(primitive: dict[str, Any]) -> Box:
    return Box(primitive["x"], primitive["y"], primitive["xsize"], primitive["ysize"])


def _corner_box(primitive: dict[str, Any]) -> Box:
    """Box of a primitive given by two corners, in either order."""
    x_start = primitive["x_start"]
    y_start = primitive["y_start"]
    x_end = primitive["x_end"]
    y_end = primitive["y_end"]
    return Box(
        min(x_start, x_end),
        min(y_start, y_end),
        abs(x_end - x_start) + 1,
        abs(y_end - y_start) + 1,
    )


_BOXES: Final[dict[str, Callable[[dict[str, Any]], Box]]] = {
    "text": _text_box,
    "multiline": _multiline_box,
    "rectangle": _corner_box,
    "rectangle_pattern": _pattern_box,
    "line": _corner_box,
    "polygon": _polygon_box,
    "circle": _radial_box,
    "arc": _radial_box,
    "ellipse": _corner_box,
    "icon": _icon_box,
    "icon_sequence": _icon_sequence_box,
    "qrcode": _qr_box,
    "dlimg": _image_box,
    "progress_bar": _corner_box,
    "plot": _corner_box,
}


def primitive_box(primitive: dict[str, Any], display: tuple[int, int]) -> Box:
    """Return the pixels a primitive occupies once rendered on a display."""
    box = _BOXES.get(primitive["type"])
    if box is None:
        return Box(0, 0, *display)
    return box(primitive)
