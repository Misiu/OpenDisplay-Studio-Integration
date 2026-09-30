"""Sensor card: the value of one or more entities as a tile, a list or a grid."""

from __future__ import annotations

from dataclasses import dataclass
from math import ceil, sqrt
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Box,
    WidgetContext,
    clamp,
    fit_text,
    grid,
    icon,
    inset,
    line,
    rectangle,
    rows,
    text,
    text_width,
    truncate,
)

MIN_ROW_HEIGHT: Final = 22
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


def _readings(context: WidgetContext) -> list[Reading]:
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
                color=options["alertColor"] if alert else "black",
            )
        )
    return readings


def _placeholder(context: WidgetContext) -> list[dict[str, Any]]:
    box = context.box
    size = clamp(min(box.height // 5, box.width // 12), 12, 24)
    return [
        rectangle(box, fill="white", outline="black", width=1),
        text(
            context.t("choose_entities"),
            x=box.x + box.width // 2,
            y=box.y + box.height // 2,
            size=size,
            anchor="mm",
            max_width=box.width - 8,
            truncate=True,
        ),
    ]


def _tile(context: WidgetContext, box: Box, reading: Reading) -> list[dict[str, Any]]:
    """One reading as a bordered tile: name on top, icon and big value below."""
    options = context.options
    elements = [rectangle(box, fill="white", outline="black", width=1, radius=2)]
    area = inset(box, clamp(min(box.width, box.height) // 14, 4, 14))
    name_height = 0
    if options["showName"]:
        name_size = clamp(area.height // 6, 10, 22)
        name_height = name_size + 6
        elements.append(
            text(
                truncate(reading.name, area.width, name_size),
                x=area.x + area.width // 2,
                y=area.y,
                size=name_size,
                anchor="mt",
            )
        )
    content = Box(area.x, area.y + name_height, area.width, area.height - name_height)
    icon_size = clamp(min(content.height, content.width // 4), 16, 48)
    icon_slot = icon_size + 8 if options["showIcon"] else 0
    ceiling = round(clamp(content.height, 12, 96) * VALUE_SCALE[options["valueSize"]])
    value_size = fit_text(reading.text, content.width - icon_slot, max(10, ceiling))
    center_y = content.y + content.height // 2
    if options["showIcon"]:
        elements.append(
            icon(
                reading.icon,
                x=content.x + icon_size // 2,
                y=center_y,
                size=icon_size,
                color=reading.color,
                anchor="mm",
            )
        )
    elements.append(
        text(
            reading.text,
            x=content.x + icon_slot + (content.width - icon_slot) // 2,
            y=center_y,
            size=value_size,
            color=reading.color,
            anchor="mm",
        )
    )
    return elements


def _list(
    context: WidgetContext, box: Box, readings: list[Reading]
) -> list[dict[str, Any]]:
    shown = readings[: max(1, box.height // MIN_ROW_HEIGHT)]
    elements = [rectangle(box, fill="white", outline="black", width=1, radius=2)]
    options = context.options
    for index, (row, reading) in enumerate(
        zip(rows(box, len(shown)), shown, strict=True)
    ):
        size = clamp(row.height * 6 // 10, 10, 28)
        left = row.x + 8
        if options["showIcon"]:
            elements.append(
                icon(
                    reading.icon,
                    x=left + size // 2,
                    y=row.y + row.height // 2,
                    size=size,
                    color=reading.color,
                    anchor="mm",
                )
            )
            left += size + 8
        value_width = text_width(reading.text, size)
        elements.append(
            text(
                reading.text,
                x=row.right - 8,
                y=row.y + row.height // 2,
                size=size,
                color=reading.color,
                anchor="rm",
            )
        )
        if options["showName"]:
            room = row.right - 16 - value_width - left
            elements.append(
                text(
                    truncate(reading.name, max(20, room), size),
                    x=left,
                    y=row.y + row.height // 2,
                    size=size,
                    anchor="lm",
                )
            )
        if index < len(shown) - 1:
            elements.append(
                line((row.x + 4, row.bottom - 1), (row.right - 5, row.bottom - 1))
            )
    return elements


def _grid(
    context: WidgetContext, box: Box, readings: list[Reading]
) -> list[dict[str, Any]]:
    count = len(readings)
    column_count = clamp(ceil(sqrt(count * box.width / box.height)), 1, count)
    row_count = ceil(count / column_count)
    cells = grid(box, column_count, row_count, gap=4)
    elements: list[dict[str, Any]] = []
    for cell, reading in zip(cells, readings, strict=False):
        elements.extend(_tile(context, cell, reading))
    return elements


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the picked entities as a tile, a list or a grid that fits the frame."""
    readings = _readings(context)
    if not readings:
        return _placeholder(context)
    layout = context.options["layout"]
    if layout == "list" and len(readings) > 1:
        return _list(context, context.box, readings)
    if layout == "grid" and len(readings) > 1:
        return _grid(context, context.box, readings)
    return _tile(context, context.box, readings[0])


RENDERER = render
