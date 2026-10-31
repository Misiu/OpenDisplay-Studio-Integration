"""Weather: current conditions and a forecast laid out along the frame's free side."""

from __future__ import annotations

from typing import Any, Final

from custom_components.opendisplay_studio.odl import Box
from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    columns,
    compose,
    condition_icon,
    fit_text,
    format_time,
    inset,
    rows,
    text_width,
    weekday_name,
)

WIDE_RATIO: Final = 1.3
MIN_TEXT: Final = 10
COLUMN_WIDTH: Final = 56
ROW_HEIGHT: Final = 26
SECTION_GAP: Final = 8


def _degrees(value: object, unit: str = "") -> str:
    if not isinstance(value, int | float):
        return "—"
    return f"{round(value)}{unit or '°'}"


def _condition_label(context: WidgetContext, condition: str) -> str:
    return context.t(f"condition.{condition}") if condition else ""


def _forecast(context: WidgetContext, data: dict[str, Any]) -> list[dict[str, Any]]:
    """Return the forecast entries still ahead, at most as many as asked for."""
    now = context.now
    hourly = context.options["forecastType"] == "hourly"
    upcoming = [
        item
        for item in data["forecast"]
        if item["datetime"] is not None
        and (
            item["datetime"].date() >= now.date()
            if not hourly
            else item["datetime"] >= now.replace(minute=0, second=0, microsecond=0)
        )
    ]
    return upcoming[: context.options["forecastItems"]]


def _label(context: WidgetContext, item: dict[str, Any]) -> str:
    moment = item["datetime"]
    if context.options["forecastType"] == "hourly":
        return format_time(moment, use_24h=True)
    return weekday_name(moment.date(), context.language)


def _temperatures(item: dict[str, Any]) -> str:
    if isinstance(item["templow"], int | float):
        return f"{_degrees(item['temperature'], '°')}/{_degrees(item['templow'], '°')}"
    return _degrees(item["temperature"], "°")


def _details(context: WidgetContext, data: dict[str, Any]) -> list[str]:
    options = context.options
    details: list[str] = []
    if options["showHumidity"] and data["humidity"] is not None:
        details.append(context.t("humidity", value=round(data["humidity"])))
    if options["showFeelsLike"] and data["apparent_temperature"] is not None:
        feels = _degrees(data["apparent_temperature"], data["temperature_unit"])
        details.append(context.t("feels_like", value=feels))
    if options["showWind"] and data["wind_speed"] is not None:
        speed = f"{round(data['wind_speed'])} {data['wind_speed_unit']}".strip()
        details.append(context.t("wind", value=speed))
    return details


def _line_size(value: str, width: int, ceiling: int) -> int:
    """Return the size a line is drawn at: as large as fits, never below the minimum."""
    return fit_text(value, width, ceiling, MIN_TEXT)


def _current(
    context: WidgetContext, look: Look, area: Box, data: dict[str, Any]
) -> dict[str, Any]:
    """Icon and temperature, the condition in words, then the enabled details."""
    details = _details(context, data)
    parts = rows(area, [3, 1, *[1] * len(details)], gap=2)
    head, condition_row, *detail_rows = parts
    icon_size = clamp(min(head.height, head.width // 3), 20, 96)
    temperature = _degrees(data["temperature"], data["temperature_unit"])
    temperature_size = fit_text(
        temperature, head.width - icon_size - 8, clamp(head.height, 12, 96)
    )
    children: list[dict[str, Any]] = [
        {
            "type": "row",
            "gap": 8,
            "h": head.height,
            "children": [
                look.icon(condition_icon(data["condition"]), size=icon_size),
                look.text(temperature, size=temperature_size, grow=1, align="center"),
            ],
        },
        _line(
            look,
            _condition_label(context, data["condition"]),
            condition_row,
            clamp(condition_row.height - 2, MIN_TEXT, 22),
        ),
    ]
    for row, detail in zip(detail_rows, details, strict=True):
        if row.height < MIN_TEXT + 2:
            break
        if text_width(detail, MIN_TEXT) > area.width:
            continue  # a cut-off detail is worse than none
        children.append(_line(look, detail, row, clamp(row.height - 2, MIN_TEXT, 18)))
    return {
        "type": "column",
        "gap": 2,
        "w": area.width,
        "h": area.height,
        "children": children,
    }


def _line(look: Look, value: str, row: Box, ceiling: int) -> dict[str, Any]:
    size = _line_size(value, row.width, ceiling)
    return look.text(value, size=size, truncate=True, h=row.height)


def _shared_size(values: list[str], slots: list[Box], line: Box) -> int:
    """Return one size at which every value fits its column, and the line's height."""
    ceiling = clamp(line.height - 2, MIN_TEXT, 28)
    width = min(slot.width for slot in slots) - 4
    return min(fit_text(value, width, ceiling, MIN_TEXT) for value in values)


def _forecast_columns(
    context: WidgetContext, look: Look, area: Box, items: list[dict[str, Any]]
) -> dict[str, Any]:
    """Forecast as columns: label on top, icon, temperatures below."""
    count = max(1, min(len(items), area.width // COLUMN_WIDTH))
    shown = items[:count]
    slots = columns(area, count)
    label_size = _shared_size(
        [_label(context, item) for item in shown], slots, rows(slots[0], [1, 2, 1])[0]
    )
    temperature_size = _shared_size(
        [_temperatures(item) for item in shown],
        slots,
        rows(slots[0], [1, 2, 1])[2],
    )
    cells: list[dict[str, Any]] = []
    for cell, item in zip(slots, shown, strict=True):
        parts = rows(cell, [1, 2, 1])
        icon_size = clamp(min(parts[1].height, cell.width - 6), 16, 72)
        temperatures = _temperatures(item)
        cells.append(
            {
                "type": "column",
                "w": cell.width,
                "h": cell.height,
                "children": [
                    look.text(
                        _label(context, item),
                        size=label_size,
                        align="center",
                        h=parts[0].height,
                    ),
                    {
                        "type": "row",
                        "justify": "center",
                        "h": parts[1].height,
                        "children": [
                            look.icon(
                                condition_icon(item["condition"] or ""),
                                size=icon_size,
                            )
                        ],
                    },
                    look.text(
                        temperatures,
                        size=temperature_size,
                        align="center",
                        h=parts[2].height,
                    ),
                ],
            }
        )
    return {"type": "row", "w": area.width, "h": area.height, "children": cells}


def _forecast_rows(
    context: WidgetContext, look: Look, area: Box, items: list[dict[str, Any]]
) -> dict[str, Any]:
    """Forecast as rows: label, icon and temperatures side by side."""
    count = max(1, min(len(items), area.height // ROW_HEIGHT))
    lines: list[dict[str, Any]] = []
    for row, item in zip(rows(area, count), items[:count], strict=False):
        size = clamp(row.height - 6, MIN_TEXT, 20)
        lines.append(
            {
                "type": "column",
                "h": row.height,
                "children": [
                    {
                        "type": "row",
                        "grow": 1,
                        "children": [
                            look.text(_label(context, item), size=size, grow=1),
                            look.icon(
                                condition_icon(item["condition"] or ""),
                                size=clamp(row.height - 4, 16, 40),
                            ),
                            look.text(
                                _temperatures(item), size=size, grow=1, align="right"
                            ),
                        ],
                    },
                    look.divider(),
                ],
            }
        )
    return {"type": "column", "w": area.width, "h": area.height, "children": lines}


def _message(context: WidgetContext, look: Look, message: str) -> dict[str, Any]:
    return look.message(context.box, message)


def _card(
    look: Look, padding: int, direction: str, children: list[dict[str, Any]]
) -> dict[str, Any]:
    return {
        "type": direction,
        "gap": SECTION_GAP,
        "padding": padding,
        **look.frame(),
        "children": children,
    }


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the current conditions and lay the forecast out along the free side."""
    look = Look.of(context)
    if not context.sources["weather"]:
        return compose(context, _message(context, look, context.t("choose_weather")))
    data = context.data["weather"][0]
    if data["missing"]:
        return compose(
            context, _message(context, look, context.t("weather_unavailable"))
        )
    box = context.box
    items = _forecast(context, data)
    padding = clamp(min(box.width, box.height) // 16, 4, 12)
    area = inset(Box(0, 0, box.width, box.height), padding)
    if not items:
        return compose(
            context, _card(look, padding, "row", [_current(context, look, area, data)])
        )
    wide = box.width >= box.height * WIDE_RATIO
    if wide:
        current_area, forecast_area = columns(area, [2, 3], gap=SECTION_GAP)
        forecast = _forecast_columns(context, look, forecast_area, items)
    else:
        current_area, forecast_area = rows(area, [1, 1], gap=6)
        forecast = _forecast_rows(context, look, forecast_area, items)
    current = _current(context, look, current_area, data)
    direction = "row" if wide else "column"
    return compose(context, _card(look, padding, direction, [current, forecast]))


RENDERER = render
