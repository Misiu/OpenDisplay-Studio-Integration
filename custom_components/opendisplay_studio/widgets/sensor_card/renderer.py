"""Sensor card: the value of one or more entities as a tile, a list or a grid."""

from __future__ import annotations

from dataclasses import dataclass
from math import ceil, sqrt
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    fit_text,
    line_height,
)

MIN_ROW_HEIGHT: Final = 22
GRID_GAP: Final = 4
MIN_TILE_WIDTH: Final = 56
MIN_TILE_HEIGHT: Final = 40
VALUE_SCALE: Final = {"auto": 1.0, "small": 0.55, "medium": 0.8, "large": 1.0}


@dataclass(frozen=True, slots=True)
class Reading:
    """What one entity shows on the card."""

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
    readings: list[Reading] = []
    for pick, data in zip(
        context.sources["entities"], context.data["entities"], strict=True
    ):
        alert = _is_alert(data["state"], options)
        readings.append(
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
    return readings


def _placeholder(context: WidgetContext, look: Look) -> dict[str, Any]:
    box = context.box
    size = clamp(min(box.height // 5, box.width // 12), 12, 24)
    return {
        "type": "column",
        "justify": "center",
        "padding": 4,
        **look.frame(),
        "children": [
            look.text(
                context.t("choose_entities"),
                size=size,
                align="center",
                truncate=True,
            )
        ],
    }


def _tile(
    context: WidgetContext, look: Look, reading: Reading, cell: tuple[int, int]
) -> dict[str, Any]:
    """One reading as a tile: name on top, icon and big value below."""
    options = context.options
    width, height = cell
    padding = clamp(min(width, height) // 14, 4, 14)
    area = inset_size(width, height, padding)
    name_size = clamp(area[1] // 6, 10, 22)
    name_height = line_height(name_size) + 6 if options["showName"] else 0
    content_width, content_height = area[0], area[1] - name_height
    icon_size = clamp(min(content_height, content_width // 4), 16, 48)
    icon_slot = icon_size + 8 if options["showIcon"] else 0
    ceiling = round(clamp(content_height, 12, 96) * VALUE_SCALE[options["valueSize"]])
    ceiling = _tallest_size(ceiling, content_height)
    value_size = fit_text(reading.text, content_width - icon_slot - 4, max(10, ceiling))
    value_row: list[dict[str, Any]] = []
    if options["showIcon"]:
        value_row.append(look.icon(reading.icon, size=icon_size, color=reading.color))
    value_row.append(look.text(reading.text, size=value_size, color=reading.color))
    children: list[dict[str, Any]] = []
    if options["showName"]:
        children.append(
            look.text(reading.name, size=name_size, align="center", truncate=True)
        )
    children.append(
        {
            "type": "row",
            "justify": "center",
            "gap": 8,
            "grow": 1,
            "children": value_row,
        }
    )
    return {
        "type": "column",
        "padding": padding,
        "gap": 6,
        **look.frame(),
        "children": children,
    }


def _tallest_size(ceiling: int, height: int) -> int:
    """Return the largest size up to `ceiling` whose line fits `height`."""
    while ceiling > 10 and line_height(ceiling) > height:
        ceiling -= 1
    return ceiling


def inset_size(width: int, height: int, padding: int) -> tuple[int, int]:
    """Return the size left inside a box after `padding` on every side."""
    return max(1, width - 2 * padding), max(1, height - 2 * padding)


def _row(
    context: WidgetContext, look: Look, reading: Reading, height: int
) -> dict[str, Any]:
    """One reading as a line: icon, name, and the value at the right."""
    options = context.options
    size = clamp(height * 6 // 10, 10, 28)
    children: list[dict[str, Any]] = []
    if options["showIcon"]:
        children.append(look.icon(reading.icon, size=size, color=reading.color))
    name = look.text(reading.name, size=size, truncate=True, grow=1)
    if not options["showName"]:
        name = {"type": "spacer"}
    children.append(name)
    children.append(look.text(reading.text, size=size, color=reading.color))
    return {
        "type": "row",
        "gap": 8,
        "padding": [0, 8],
        "grow": 1,
        "children": children,
    }


def _list(
    context: WidgetContext, look: Look, readings: list[Reading]
) -> dict[str, Any]:
    box = context.box
    shown = readings[: max(1, box.height // MIN_ROW_HEIGHT)]
    row_height = box.height // len(shown)
    children: list[dict[str, Any]] = []
    for index, reading in enumerate(shown):
        if index:
            children.append(look.divider())
        children.append(_row(context, look, reading, row_height))
    return {"type": "column", **look.frame(), "children": children}


def _grid(
    context: WidgetContext, look: Look, readings: list[Reading]
) -> dict[str, Any]:
    """Tiles in as many columns and rows as keep every tile readable."""
    box = context.box
    most_columns = max(1, (box.width + GRID_GAP) // (MIN_TILE_WIDTH + GRID_GAP))
    most_rows = max(1, (box.height + GRID_GAP) // (MIN_TILE_HEIGHT + GRID_GAP))
    wanted = clamp(ceil(sqrt(len(readings) * box.width / box.height)), 1, len(readings))
    column_count = min(wanted, most_columns)
    shown = readings[: column_count * most_rows]
    row_count = ceil(len(shown) / column_count)
    cell = (
        (box.width - GRID_GAP * (column_count - 1)) // column_count,
        (box.height - GRID_GAP * (row_count - 1)) // row_count,
    )
    return {
        "type": "grid",
        "cols": column_count,
        "gap": GRID_GAP,
        "children": [_tile(context, look, reading, cell) for reading in shown],
    }


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the picked entities as a tile, a list or a grid that fits the frame."""
    look = Look.of(context)
    readings = _readings(context, look)
    if not readings:
        return compose(context, _placeholder(context, look))
    layout = context.options["layout"]
    if layout == "list" and len(readings) > 1:
        return compose(context, _list(context, look, readings))
    if layout == "grid" and len(readings) > 1:
        return compose(context, _grid(context, look, readings))
    box = context.box
    return compose(context, _tile(context, look, readings[0], (box.width, box.height)))


RENDERER = render
