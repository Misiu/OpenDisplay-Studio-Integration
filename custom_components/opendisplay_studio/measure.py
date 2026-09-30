"""
Measure what the ODL renderer draws, so the editor's boxes match the pixels.

Text is measured with the renderer's own `measure_text` and fonts. A QR code is
sized with the same `qrcode` settings the renderer uses, because the number of
modules grows with the amount of data.
"""

from __future__ import annotations

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


def text_size(value: str, size: int) -> tuple[int, int]:
    """
    Return the width and height in pixels of the text block the renderer draws.

    The height is the font's ascent plus descent for every line, so it always
    contains the glyphs. The width ends exactly where the widest line's ink ends.
    """
    font = _FONTS.get_font(DEFAULT_FONT, size)
    metrics = measure_text(value, font, parse_colors=True)
    width = max(_ink_right(line, font, metrics.height) for line in metrics.lines)
    return max(1, width), max(1, metrics.height)


def _corner_box(primitive: dict[str, Any]) -> Box:
    """Box of a primitive given by two corners, in either order."""
    left = min(primitive["x_start"], primitive["x_end"])
    top = min(primitive["y_start"], primitive["y_end"])
    return Box(
        left,
        top,
        abs(primitive["x_end"] - primitive["x_start"]) + 1,
        abs(primitive["y_end"] - primitive["y_start"]) + 1,
    )


def primitive_box(primitive: dict[str, Any]) -> Box:
    """Return the pixels a primitive occupies once rendered."""
    primitive_type = primitive["type"]
    if primitive_type in {"rectangle", "ellipse", "progress_bar", "line"}:
        return _corner_box(primitive)
    if primitive_type == "circle":
        radius = primitive["radius"]
        return Box(
            primitive["x"] - radius,
            primitive["y"] - radius,
            radius * 2 + 1,
            radius * 2 + 1,
        )
    if primitive_type == "icon":
        return Box(primitive["x"], primitive["y"], primitive["size"], primitive["size"])
    if primitive_type == "qrcode":
        side = qr_side(primitive["data"], primitive["boxsize"], primitive["border"])
        return Box(primitive["x"], primitive["y"], side, side)
    width, height = text_size(primitive["value"], primitive["size"])
    return Box(primitive["x"], primitive["y"], width, height)
