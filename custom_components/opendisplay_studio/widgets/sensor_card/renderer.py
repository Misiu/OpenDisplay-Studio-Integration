"""Sensor card: the value of one entity as a tile that follows its frame."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Final

from custom_components.opendisplay_studio.odl import Box
from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    fit_text,
    line_height,
    text_width,
)

VALUE_SCALE: Final = {"auto": 1.0, "small": 0.55, "medium": 0.8, "large": 1.0}
SQUARE, WIDE, TALL = "square", "wide", "tall"
WIDE_RATIO: Final = 1.5
TALL_RATIO: Final = 0.7
GAP: Final = 4
MIN_TEXT: Final = 10
UNIT_SCALE: Final = 0.5
STACKED_UNIT_SCALE: Final = 0.2
SQUARE_ICON_SHARE: Final = 0.34
TALL_ICON_SHARE: Final = 0.2
STRIP_ICON_SHARE: Final = 0.58
STRIP_SLOT_SHARE: Final = 0.24
UNIT_GAP: Final = 10
STRIP_SEPARATOR_SHARE: Final = 0.6
STRIP_VALUE_SHARE: Final = 0.42
STRIP_GAP: Final = 10
ALIGN_JUSTIFY: Final = {"left": "start", "center": "center", "right": "end"}


@dataclass(frozen=True, slots=True)
class Reading:
    """What one entity shows: its name, icon, value, unit and the color of the value."""

    name: str
    icon: str
    value: str
    unit: str
    color: str

    @property
    def text(self) -> str:
        """Return the value with its unit, as drawn."""
        return f"{self.value} {self.unit}" if self.unit else self.value


def _number(value: str) -> float | None:
    try:
        return float(value)
    except ValueError:
        return None


def _format_value(state: str, display_state: str, decimals: str) -> str:
    number = _number(state)
    if number is None:
        return display_state
    if decimals == "auto":
        return state
    return f"{number:.{int(decimals)}f}"


def _is_alert(state: str, options: dict[str, Any]) -> bool:
    number = _number(state)
    if number is None:
        return False
    below = _number(str(options["alertBelow"]))
    above = _number(str(options["alertAbove"]))
    return (below is not None and number < below) or (
        above is not None and number > above
    )


def _readings(context: WidgetContext, look: Look) -> list[Reading]:
    options = context.options
    found: list[Reading] = []
    for pick, data in zip(
        context.sources["entities"], context.data["entities"], strict=True
    ):
        alert = _is_alert(data["state"], options)
        found.append(
            Reading(
                name=pick.get("label") or data["name"],
                icon=pick.get("icon") or data["icon"],
                value=_format_value(
                    data["state"], data["display_state"], options["decimals"]
                ),
                unit=data["unit"] if options["showUnit"] else "",
                color=options["alertColor"] if alert else look.ink,
            )
        )
    return found


def _shape(width: int, height: int) -> str:
    """Name the shape of a cell: wide as a strip, tall as a column, else square."""
    ratio = width / height
    if ratio >= WIDE_RATIO:
        return WIDE
    if ratio <= TALL_RATIO:
        return TALL
    return SQUARE


def _alignment(options: dict[str, Any]) -> str:
    """Return where the text sits: centered unless the user asks for a side."""
    chosen: str = options["align"]
    return "center" if chosen == "auto" else chosen


def _tallest_size(ceiling: int, height: int) -> int:
    """Return the largest size up to `ceiling` whose line fits `height`."""
    while ceiling > MIN_TEXT and line_height(ceiling) > height:
        ceiling -= 1
    return ceiling


def _value_size(options: dict[str, Any], value: str, width: int, height: int) -> int:
    """Return the size of the value: as large as the width and height allow."""
    ceiling = round(clamp(height, 12, 96) * VALUE_SCALE[options["valueSize"]])
    return fit_text(
        value, width, max(MIN_TEXT, _tallest_size(ceiling, height)), MIN_TEXT
    )


def _unit_size(value_height: int, scale: float = UNIT_SCALE) -> int:
    """Return the size of the unit: a good deal smaller than the value."""
    return clamp(round(value_height * scale), MIN_TEXT, 40)


def _icon_row(
    look: Look, reading: Reading, size: int, align: str, height: int
) -> dict[str, Any]:
    icon = look.icon(reading.icon, size=size, color=reading.color)
    return {
        "type": "row",
        "justify": ALIGN_JUSTIFY[align],
        "h": height,
        "children": [icon],
    }


def _stacked(
    context: WidgetContext,
    look: Look,
    reading: Reading,
    area: Box,
    shape: str,
) -> list[dict[str, Any]]:
    """Icon, name, value and the unit under it, one above the other."""
    options = context.options
    align = _alignment(options)
    tall = shape == TALL
    icon_share = TALL_ICON_SHARE if tall else SQUARE_ICON_SHARE
    icon_height = round(area.height * icon_share) if options["showIcon"] else 0
    name_size = clamp(area.height // 9, MIN_TEXT, 22)
    name_height = line_height(name_size) + 2 if options["showName"] else 0
    separated = tall and options["showSeparator"] and (icon_height or name_height)
    room = area.height - icon_height - name_height - GAP * 3 - (1 if separated else 0)
    unit_size = _unit_size(room, STACKED_UNIT_SCALE)
    unit_height = line_height(unit_size) if reading.unit else 0
    value_height = max(MIN_TEXT, room - unit_height)
    value_size = _value_size(options, reading.value, area.width - 4, value_height)
    children: list[dict[str, Any]] = []
    if icon_height:
        size = min(icon_height, area.width)
        children.append(_icon_row(look, reading, size, align, icon_height))
    if name_height:
        name = look.text(
            reading.name, size=name_size, align=align, truncate=True, h=name_height
        )
        children.append(name)
    if separated:
        children.append(look.divider())
    value = look.text(
        reading.value,
        size=value_size,
        color=reading.color,
        align=align,
        h=line_height(value_size),
    )
    children.append(value)
    if reading.unit:
        unit = look.text(
            reading.unit,
            size=unit_size,
            color=reading.color,
            align=align,
            h=unit_height,
        )
        children.append(unit)
    return children


def _strip(
    context: WidgetContext,
    look: Look,
    reading: Reading,
    area: Box,
) -> list[dict[str, Any]]:
    """Lay out the icon and a line on the left, the name over the value beside them."""
    options = context.options
    align = _alignment(options)
    show_icon = options["showIcon"]
    separated = show_icon and options["showSeparator"]
    slot = round(area.width * STRIP_SLOT_SHARE) if show_icon else 0
    icon_side = min(round(area.height * STRIP_ICON_SHARE), round(slot * 0.9))
    lead = slot + STRIP_GAP + (1 + STRIP_GAP if separated else 0) if show_icon else 0
    name_size = clamp(area.height // 7, MIN_TEXT, 22)
    name_height = line_height(name_size) + 2 if options["showName"] else 0
    room = area.height - name_height - GAP
    value_height = max(MIN_TEXT, min(room, round(area.height * STRIP_VALUE_SHARE)))
    unit_size = _unit_size(value_height)
    unit_room = text_width(reading.unit, unit_size) + UNIT_GAP if reading.unit else 0
    value_size = _value_size(
        options, reading.value, area.width - lead - unit_room - 4, value_height
    )
    value_row_children = [
        look.text(reading.value, size=value_size, color=reading.color)
    ]
    if reading.unit:
        unit = look.text(reading.unit, size=unit_size, color=reading.color)
        value_row_children.append(unit)
    texts: list[dict[str, Any]] = []
    if name_height:
        name = look.text(
            reading.name, size=name_size, align=align, truncate=True, h=name_height
        )
        texts.append(name)
    texts.append(
        {
            "type": "row",
            "gap": UNIT_GAP,
            "align": "end",
            "justify": ALIGN_JUSTIFY[align],
            "h": line_height(value_size),
            "children": value_row_children,
        }
    )
    children: list[dict[str, Any]] = []
    if show_icon:
        icon = look.icon(reading.icon, size=icon_side, color=reading.color)
        children.append(
            {
                "type": "row",
                "w": slot,
                "justify": "center",
                "align": "center",
                "children": [icon],
            }
        )
    if separated:
        children.append(
            look.vertical_divider(round(area.height * STRIP_SEPARATOR_SHARE))
        )
    children.append(
        {
            "type": "column",
            "grow": 1,
            "justify": "center",
            "gap": GAP,
            "children": texts,
        }
    )
    return children


def _tile(
    context: WidgetContext, look: Look, reading: Reading, cell: tuple[int, int]
) -> dict[str, Any]:
    """One reading as a tile whose arrangement follows the shape of its cell."""
    width, height = cell
    padding = clamp(min(width, height) // 14, 4, 14)
    if _shape(width, height) == WIDE:
        padding = clamp(min(width, height) // 8, 6, 20)
    area = Box(0, 0, max(1, width - 2 * padding), max(1, height - 2 * padding))
    shape = _shape(width, height)
    if shape == WIDE:
        return {
            "type": "row",
            "padding": padding,
            "gap": STRIP_GAP,
            "align": "center",
            **look.frame(),
            "children": _strip(context, look, reading, area),
        }
    return {
        "type": "column",
        "padding": padding,
        "gap": GAP,
        "justify": "center",
        **look.frame(),
        "children": _stacked(context, look, reading, area, shape),
    }


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the picked entity as a tile whose layout follows the shape of the frame."""
    look = Look.of(context)
    found = _readings(context, look)
    if not found:
        return compose(context, look.message(context.box, context.t("choose_entity")))
    box = context.box
    return compose(context, _tile(context, look, found[0], (box.width, box.height)))


RENDERER = render
