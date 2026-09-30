"""Weather: current conditions and a forecast laid out along the frame's free side."""

from __future__ import annotations

from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Box,
    WidgetContext,
    clamp,
    columns,
    condition_icon,
    fit_text,
    format_time,
    icon,
    inset,
    line,
    rectangle,
    rows,
    text,
    text_width,
    truncate,
    weekday_name,
)

WIDE_RATIO: Final = 1.3
MIN_TEXT: Final = 10
COLUMN_WIDTH: Final = 56
ROW_HEIGHT: Final = 26


def _degrees(value: object, unit: str = "") -> str:
    if not isinstance(value, int | float):
        return "—"
    return f"{round(value)}{unit or '°'}"


def _condition_label(context: WidgetContext, condition: str) -> str:
    return context.t(f"condition.{condition}") if condition else ""


def _fit_line(value: str, width: int, size: int) -> tuple[str, int]:
    """Shrink `value` to fit `width` where it can; cut it only as a last resort."""
    fitted = fit_text(value, width, size, MIN_TEXT)
    return truncate(value, width, fitted), fitted


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


def _current(
    context: WidgetContext, area: Box, data: dict[str, Any]
) -> list[dict[str, Any]]:
    """Icon and temperature, the condition in words, then the enabled details."""
    details = _details(context, data)
    weights = [3, 1, *[1] * len(details)]
    parts = rows(area, weights, gap=2)
    head, condition_row, *detail_rows = parts
    icon_size = clamp(min(head.height, head.width // 3), 20, 96)
    temperature = _degrees(data["temperature"], data["temperature_unit"])
    temperature_size = fit_text(
        temperature, head.width - icon_size - 8, clamp(head.height, 12, 96)
    )
    elements = [
        icon(
            condition_icon(data["condition"]),
            x=head.x + icon_size // 2,
            y=head.y + head.height // 2,
            size=icon_size,
            anchor="mm",
        ),
        text(
            temperature,
            x=head.x + icon_size + 8 + (head.width - icon_size - 8) // 2,
            y=head.y + head.height // 2,
            size=temperature_size,
            anchor="mm",
        ),
    ]
    label, label_size = _fit_line(
        _condition_label(context, data["condition"]),
        area.width,
        clamp(condition_row.height - 2, MIN_TEXT, 22),
    )
    elements.append(
        text(
            label,
            x=area.x,
            y=condition_row.y + condition_row.height // 2,
            size=label_size,
            anchor="lm",
        )
    )
    for row, detail in zip(detail_rows, details, strict=True):
        if row.height < MIN_TEXT + 2:
            break
        if text_width(detail, MIN_TEXT) > area.width:
            continue  # a cut-off detail is worse than none
        line_text, line_size = _fit_line(
            detail, area.width, clamp(row.height - 2, MIN_TEXT, 18)
        )
        elements.append(
            text(
                line_text,
                x=area.x,
                y=row.y + row.height // 2,
                size=line_size,
                anchor="lm",
            )
        )
    return elements


def _forecast_columns(
    context: WidgetContext, area: Box, items: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Forecast as columns: label on top, icon, temperatures below."""
    count = max(1, min(len(items), area.width // COLUMN_WIDTH))
    elements: list[dict[str, Any]] = []
    for cell, item in zip(columns(area, count), items[:count], strict=False):
        parts = rows(cell, [1, 2, 1])
        label_size = clamp(parts[0].height - 2, MIN_TEXT, 18)
        icon_size = clamp(min(parts[1].height, cell.width - 6), 16, 48)
        elements.append(
            text(
                _label(context, item),
                x=cell.x + cell.width // 2,
                y=parts[0].y + parts[0].height // 2,
                size=label_size,
                anchor="mm",
            )
        )
        elements.append(
            icon(
                condition_icon(item["condition"] or ""),
                x=cell.x + cell.width // 2,
                y=parts[1].y + parts[1].height // 2,
                size=icon_size,
                anchor="mm",
            )
        )
        temperatures = _temperatures(item)
        elements.append(
            text(
                temperatures,
                x=cell.x + cell.width // 2,
                y=parts[2].y + parts[2].height // 2,
                size=fit_text(temperatures, cell.width - 4, label_size, MIN_TEXT),
                anchor="mm",
            )
        )
    return elements


def _forecast_rows(
    context: WidgetContext, area: Box, items: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Forecast as rows: label, icon and temperatures side by side."""
    count = max(1, min(len(items), area.height // ROW_HEIGHT))
    elements: list[dict[str, Any]] = []
    for row, item in zip(rows(area, count), items[:count], strict=False):
        size = clamp(row.height - 6, MIN_TEXT, 20)
        middle = row.y + row.height // 2
        elements.append(
            text(_label(context, item), x=row.x, y=middle, size=size, anchor="lm")
        )
        elements.append(
            icon(
                condition_icon(item["condition"] or ""),
                x=row.x + row.width // 2,
                y=middle,
                size=clamp(row.height - 4, 16, 40),
                anchor="mm",
            )
        )
        elements.append(
            text(
                _temperatures(item),
                x=row.right,
                y=middle,
                size=size,
                anchor="rm",
            )
        )
        elements.append(line((row.x, row.bottom - 1), (row.right - 1, row.bottom - 1)))
    return elements


def _message(context: WidgetContext, message: str) -> list[dict[str, Any]]:
    box = context.box
    size = clamp(min(box.height // 5, box.width // 14), MIN_TEXT, 20)
    return [
        rectangle(box, fill="white", outline="black", width=1),
        text(
            truncate(message, box.width - 8, size),
            x=box.x + box.width // 2,
            y=box.y + box.height // 2,
            size=size,
            anchor="mm",
        ),
    ]


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the current conditions and lay the forecast out along the free side."""
    if not context.sources["weather"]:
        return _message(context, context.t("choose_weather"))
    data = context.data["weather"][0]
    if data["missing"]:
        return _message(context, context.t("weather_unavailable"))
    box = context.box
    items = _forecast(context, data)
    area = inset(box, clamp(min(box.width, box.height) // 16, 4, 12))
    wide = box.width >= box.height * WIDE_RATIO
    elements = [rectangle(box, fill="white", outline="black", width=1, radius=2)]
    if not items:
        return elements + _current(context, area, data)
    if wide:
        current_area, forecast_area = columns(area, [2, 3], gap=8)
        forecast = _forecast_columns(context, forecast_area, items)
    else:
        current_area, forecast_area = rows(area, [1, 1], gap=6)
        forecast = _forecast_rows(context, forecast_area, items)
    return elements + _current(context, current_area, data) + forecast


RENDERER = render
