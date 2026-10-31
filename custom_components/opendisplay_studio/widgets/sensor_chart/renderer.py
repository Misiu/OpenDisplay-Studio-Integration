"""Sensor chart: the value of one entity with its history as a line chart."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from itertools import pairwise
from typing import Any, Final

from custom_components.opendisplay_studio.flatten import translate_elements
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

WIDE_RATIO: Final = 2.2
GAP: Final = 6
MIN_TEXT: Final = 10
MIN_CHART_HEIGHT: Final = 28
CHART_SHARE: Final = 0.25
VALUE_SHARE: Final = 0.28
SIDE_SHARE: Final = 0.42
CHART_INSET: Final = 3
MIN_EXTREMES_WIDTH: Final = 200
SMOOTHING_DIVISOR: Final = 20
MINUTES_PER_HOUR: Final = 60
HOURS_PER_DAY: Final = 24


@dataclass(frozen=True, slots=True)
class Sensor:
    """What the chart shows about the entity."""

    entity_id: str
    name: str
    icon: str
    value: str
    unit: str
    last_changed: datetime | None
    points: list[dict[str, Any]]


@dataclass(frozen=True, slots=True)
class Plan:
    """A layout: its root, and where the chart goes inside the widget's box."""

    root: dict[str, Any]
    chart: Box | None


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


def _format_extreme(value: float, decimals: str) -> str:
    """Format a minimum or maximum; as reported means one decimal without trailing 0."""
    if decimals == "auto":
        return f"{value:.1f}".rstrip("0").rstrip(".")
    return f"{value:.{int(decimals)}f}"


def _sensor(context: WidgetContext) -> Sensor | None:
    picks = context.sources["entities"]
    if not picks:
        return None
    pick, data = picks[0], context.data["entities"][0]
    options = context.options
    changed = data.get("last_changed")
    return Sensor(
        entity_id=data["id"],
        name=pick.get("label") or data["name"],
        icon=pick.get("icon") or data["icon"],
        value=_format_value(data["state"], data["display_state"], options["decimals"]),
        unit=data["unit"] if options["showUnit"] else "",
        last_changed=datetime.fromisoformat(changed) if changed else None,
        points=data["points"],
    )


def _tallest_size(ceiling: int, height: int) -> int:
    """Return the largest size up to `ceiling` whose line fits `height`."""
    while ceiling > MIN_TEXT and line_height(ceiling) > height:
        ceiling -= 1
    return ceiling


def _updated_text(context: WidgetContext, changed: datetime) -> str:
    minutes = max(0, int((context.now - changed).total_seconds() // 60))
    if minutes < 1:
        return context.t("updated_now")
    if minutes < MINUTES_PER_HOUR:
        return context.t("updated_minutes", count=minutes)
    hours = minutes // MINUTES_PER_HOUR
    if hours < HOURS_PER_DAY:
        return context.t("updated_hours", count=hours)
    return context.t("updated_days", count=hours // HOURS_PER_DAY)


def _span_text(context: WidgetContext) -> str:
    hours = int(context.options["hours"])
    if hours == 1:
        return context.t("last_hour")
    if hours > HOURS_PER_DAY and hours % HOURS_PER_DAY == 0:
        return context.t("last_days", count=hours // HOURS_PER_DAY)
    return context.t("last_hours", count=hours)


def _chip(look: Look, sensor: Sensor, size: int) -> dict[str, Any]:
    domain = sensor.entity_id.split(".", maxsplit=1)[0].upper()
    return {
        "type": "row",
        "padding": [1, 6],
        "border": look.ink,
        "border_width": 1,
        "radius": size,
        "children": [look.text(domain, size=size)],
    }


def _header(
    context: WidgetContext, look: Look, sensor: Sensor, size: int
) -> dict[str, Any]:
    options = context.options
    children: list[dict[str, Any]] = []
    if options["showName"]:
        children.append(look.text(sensor.name, size=size, truncate=True, grow=1))
    else:
        children.append({"type": "spacer"})
    if options["showChip"]:
        children.append(_chip(look, sensor, max(MIN_TEXT, size - 8)))
    return {
        "type": "row",
        "gap": GAP,
        "align": "center",
        "h": line_height(size) + 2,
        "children": children,
    }


def _value_row(
    context: WidgetContext,
    look: Look,
    sensor: Sensor,
    area: Box,
) -> dict[str, Any]:
    """Lay out the icon, the value and its unit as large as the area allows."""
    options = context.options
    icon_size = min(area.height, area.width // 4) if options["showIcon"] else 0
    unit_size = clamp(round(area.height * 0.25), MIN_TEXT, 40)
    unit_room = text_width(sensor.unit, unit_size) + GAP if sensor.unit else 0
    room = area.width - (icon_size + GAP if icon_size else 0) - unit_room
    value_size = fit_text(
        sensor.value, room, max(MIN_TEXT, _tallest_size(area.height, area.height))
    )
    figures = [look.text(sensor.value, size=value_size)]
    if sensor.unit:
        figures.append(look.text(sensor.unit, size=unit_size))
    children: list[dict[str, Any]] = []
    if icon_size:
        children.append(look.icon(sensor.icon, size=icon_size))
    children.append({"type": "row", "gap": GAP, "align": "end", "children": figures})
    return {
        "type": "row",
        "gap": GAP,
        "align": "center",
        "w": area.width,
        "h": area.height,
        "children": children,
    }


def _extremes(
    context: WidgetContext, look: Look, sensor: Sensor, size: int, width: int
) -> dict[str, Any]:
    """Minimum, the span of the chart and maximum, in one row."""
    values = [point["value"] for point in sensor.points]
    decimals = context.options["decimals"]
    unit = f" {sensor.unit}" if sensor.unit else ""
    low = context.t("min", value=_format_extreme(min(values), decimals) + unit)
    high = context.t("max", value=_format_extreme(max(values), decimals) + unit)
    return {
        "type": "row",
        "gap": GAP,
        "w": width,
        "h": line_height(size) + 2,
        "children": [
            look.text(low, size=size, grow=1, truncate=True),
            look.text(
                _span_text(context), size=size, align="center", grow=1, truncate=True
            ),
            look.text(high, size=size, align="right", grow=1, truncate=True),
        ],
    }


def _footer(
    context: WidgetContext, look: Look, sensor: Sensor, size: int
) -> dict[str, Any] | None:
    options = context.options
    children: list[dict[str, Any]] = []
    if options["showEntityId"]:
        children.append(look.icon(sensor.icon, size=size))
        children.append(look.text(sensor.entity_id, size=size, truncate=True, grow=1))
    else:
        children.append({"type": "spacer"})
    if options["showUpdated"] and sensor.last_changed is not None:
        children.append(look.icon("clock-outline", size=size))
        children.append(
            look.text(_updated_text(context, sensor.last_changed), size=size)
        )
    if len(children) == 1:
        return None
    return {
        "type": "row",
        "gap": GAP,
        "align": "center",
        "h": line_height(size) + 2,
        "children": children,
    }


def _plan_below(
    context: WidgetContext, look: Look, sensor: Sensor, padding: int
) -> Plan:
    """Header, value, chart, extremes and footer, one under the other."""
    box = context.box
    inner = Box(0, 0, box.width - 2 * padding, box.height - 2 * padding)
    name_size = clamp(inner.height // 10, 11, 24)
    small = clamp(inner.height // 18, MIN_TEXT, 16)
    header = _header(context, look, sensor, name_size)
    value_area = Box(0, 0, inner.width, round(inner.height * VALUE_SHARE))
    extremes = None
    if context.options["showMinMax"] and sensor.points:
        extremes = _extremes(context, look, sensor, small, inner.width)
    footer = _footer(context, look, sensor, small)
    optional = [item for item in (extremes, footer) if item is not None]
    fixed = header["h"] + value_area.height + GAP * 2
    while optional and _chart_room(inner.height, fixed, optional) < _wanted(inner):
        optional.pop()  # the footer goes first, then the extremes
    chart_height = _chart_room(inner.height, fixed, optional)
    top = padding + header["h"] + GAP + value_area.height + GAP
    children = [header, _value_row(context, look, sensor, value_area)]
    children.append({"type": "spacer", "h": chart_height})
    children += optional
    root = {
        "type": "column",
        "padding": padding,
        "gap": GAP,
        **look.frame(),
        "children": children,
    }
    return Plan(root, Box(padding, top, inner.width, chart_height))


def _wanted(inner: Box) -> int:
    return max(MIN_CHART_HEIGHT, round(inner.height * CHART_SHARE))


def _chart_room(height: int, fixed: int, optional: list[dict[str, Any]]) -> int:
    used = fixed + sum(int(item["h"]) + GAP for item in optional)
    return height - used


def _plan_beside(
    context: WidgetContext, look: Look, sensor: Sensor, padding: int
) -> Plan:
    """Lay out the value on the left and the chart with its extremes on the right."""
    box = context.box
    inner = Box(0, 0, box.width - 2 * padding, box.height - 2 * padding)
    name_size = clamp(inner.height // 8, 11, 24)
    small = clamp(inner.height // 14, MIN_TEXT, 16)
    header = _header(context, look, sensor, name_size)
    footer = _footer(context, look, sensor, small)
    middle = inner.height - header["h"] - GAP
    if footer is not None:
        middle -= footer["h"] + GAP
    left_width = round(inner.width * SIDE_SHARE)
    right_width = inner.width - left_width - GAP
    extremes = None
    wide_enough = right_width >= MIN_EXTREMES_WIDTH
    if context.options["showMinMax"] and sensor.points and wide_enough:
        extremes = _extremes(context, look, sensor, small, right_width)
    chart_height = middle - (extremes["h"] + GAP if extremes else 0)
    value = _value_row(
        context, look, sensor, Box(0, 0, left_width, min(middle, left_width // 2))
    )
    right = [{"type": "spacer", "h": chart_height}]
    if extremes is not None:
        right.append(extremes)
    body = {
        "type": "row",
        "gap": GAP,
        "h": middle,
        "children": [
            {
                "type": "column",
                "w": left_width,
                "justify": "center",
                "children": [value],
            },
            {"type": "column", "gap": GAP, "w": right_width, "children": right},
        ],
    }
    children = [header, body]
    if footer is not None:
        children.append(footer)
    root = {
        "type": "column",
        "padding": padding,
        "gap": GAP,
        **look.frame(),
        "children": children,
    }
    chart = Box(
        padding + left_width + GAP,
        padding + header["h"] + GAP,
        right_width,
        chart_height,
    )
    return Plan(root, chart)


def _moving_average(values: list[float], window: int) -> list[float]:
    half = window // 2
    return [
        sum(values[max(0, index - half) : index + half + 1])
        / len(values[max(0, index - half) : index + half + 1])
        for index in range(len(values))
    ]


def _chart_elements(
    context: WidgetContext, look: Look, sensor: Sensor, chart: Box
) -> list[dict[str, Any]]:
    """Draw the history as a line from the first point to the last."""
    points = sensor.points
    if len(points) < 2:
        message = look.text(
            context.t("no_history"),
            size=MIN_TEXT + 2,
            x=chart.x + chart.width // 2,
            y=chart.y + chart.height // 2,
            anchor="mm",
        )
        return [message]
    raw: list[float] = [point["value"] for point in points]
    low, high = min(raw), max(raw)
    values = raw
    if context.options["smoothing"]:
        values = _moving_average(raw, max(1, len(raw) // SMOOTHING_DIVISOR))
    seconds = int(context.options["hours"]) * 3600
    end = context.now
    left, right = chart.x, chart.x + chart.width - 1
    top = chart.y + CHART_INSET
    bottom = chart.y + chart.height - 1 - CHART_INSET
    spread = high - low

    def x_of(moment: datetime) -> int:
        ratio = 1 - (end - moment).total_seconds() / seconds
        return round(left + min(1.0, max(0.0, ratio)) * (right - left))

    def y_of(value: float) -> int:
        if spread == 0:
            return (top + bottom) // 2
        return round(bottom - (value - low) / spread * (bottom - top))

    coordinates = [
        (x_of(point["datetime"]), y_of(value))
        for point, value in zip(points, values, strict=True)
    ]
    width = 2 if chart.height < 160 else 3
    return [
        {
            "type": "line",
            "x_start": x_start,
            "y_start": y_start,
            "x_end": x_end,
            "y_end": y_end,
            "fill": look.ink,
            "width": width,
        }
        for (x_start, y_start), (x_end, y_end) in pairwise(coordinates)
    ]


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the entity with its history, or say that none is picked."""
    look = Look.of(context)
    sensor = _sensor(context)
    if sensor is None:
        return compose(context, look.message(context.box, context.t("choose_entity")))
    box = context.box
    padding = clamp(min(box.width, box.height) // 16, 6, 16)
    placement = context.options["placement"]
    beside = placement == "right" or (
        placement == "auto" and box.width >= box.height * WIDE_RATIO
    )
    plan = (
        _plan_beside(context, look, sensor, padding)
        if beside
        else _plan_below(context, look, sensor, padding)
    )
    elements = compose(context, plan.root)
    if plan.chart is None or plan.chart.height < MIN_CHART_HEIGHT // 2:
        return elements
    drawn = _chart_elements(context, look, sensor, plan.chart)
    return elements + translate_elements(drawn, box.x, box.y)


RENDERER = render
