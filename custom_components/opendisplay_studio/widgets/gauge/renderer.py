"""Gauge: the value of a sensor on a half dial, with a marker or a filled arc."""

from __future__ import annotations

from dataclasses import dataclass, replace
from math import sqrt
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Box,
    Dial,
    Look,
    Reading,
    Span,
    Stroke,
    WidgetContext,
    clamp,
    compose,
    dial,
    line_height,
    number_of,
    readings_of,
    spans_of,
    text_width,
)

MIN_TEXT: Final = 10
MAX_TEXT: Final = 72
GAP: Final = 6
# The half dial lies on the left, over the top, to the right.
START: Final = 180
SWEEP: Final = 180
# Ticks: one for every tenth of the scale, a longer one at the middle and the ends.
TICK_COUNT: Final = 10
MIN_RADIUS: Final = 24
BAND_SHARE: Final = 0.22
NEEDLE = "needle"


@dataclass(frozen=True, slots=True)
class Shown:
    """Which of the extras around the dial are drawn."""

    name: bool
    limits: bool
    ticks: bool


@dataclass(frozen=True, slots=True)
class Plan:
    """What the gauge shows and how big it is, once the frame has been fitted."""

    reading: Reading
    shown: Shown
    inside: Box
    radius: int
    tick: int
    center: tuple[int, int]
    label_size: int


def _scale(options: dict[str, Any]) -> tuple[float, float]:
    """Return the lowest and highest value; a scale with no length is one unit long."""
    low, high = float(options["min"]), float(options["max"])
    return (low, high) if high > low else (low, low + 1)


def _number_text(value: float) -> str:
    return f"{value:g}"


def _plan(box: Box, reading: Reading, shown: Shown) -> Plan:
    """Fit the half dial, its name and its limits into the frame."""
    padding = clamp(min(box.width, box.height) // 12, 4, 16)
    inside = box.inset(padding)
    name_room = 0
    if shown.name:
        name_room = line_height(_name_size(inside.width, inside.height)) + GAP
    label_size = clamp(inside.height // 9, MIN_TEXT, 20)
    limits_room = line_height(label_size) + GAP if shown.limits else 0
    room_height = inside.height - name_room - limits_room
    outer = max(0, min(inside.width // 2, room_height))
    tick = clamp(round(outer * 0.07), 3, 8) if shown.ticks else 0
    top = inside.y + name_room + (room_height - outer) // 2
    return Plan(
        reading=reading,
        shown=shown,
        inside=inside,
        radius=outer - (tick + 2 if tick else 0),
        tick=tick,
        center=(inside.x + inside.width // 2, top + outer),
        label_size=label_size,
    )


def _name_size(width: int, height: int) -> int:
    return clamp(min(height // 7, width // 12), MIN_TEXT, 24)


def _fitted_plan(context: WidgetContext, reading: Reading) -> Plan:
    """Return the first plan that leaves a dial big enough, dropping the extras."""
    options = context.options
    wanted = Shown(
        name=bool(options["showName"]),
        limits=bool(options["showLimits"]),
        ticks=bool(options["showTicks"]),
    )
    for shown in (
        wanted,
        replace(wanted, limits=False, ticks=False),
        Shown(name=False, limits=False, ticks=False),
    ):
        plan = _plan(context.box, reading, shown)
        if plan.radius >= MIN_RADIUS:
            break
    return plan


def _value_size(reading: Reading, inner_radius: int) -> int:
    """Return the largest size at which the reading fits the half disc under the arc."""
    ceiling = clamp(round(inner_radius * 0.9), MIN_TEXT, MAX_TEXT)
    size = ceiling
    while size > MIN_TEXT:
        height = line_height(size)
        reach = 2 * sqrt(max(inner_radius**2 - height**2, 0)) * 0.95
        if text_width(reading.text, size) <= reach:
            break
        size -= 1
    return size


def _zones(scale: Dial, spans: list[Span], thickness: int) -> list[dict[str, Any]]:
    """Return the bands of the colored ranges."""
    bands: list[dict[str, Any]] = []
    for span in spans:
        bands += dial.band(
            scale,
            scale.angle(span.first),
            scale.angle(span.last),
            thickness=thickness,
            color=span.color,
        )
    return bands


def _tick_values(scale: Dial) -> list[float]:
    step = (scale.high - scale.low) / TICK_COUNT
    return [scale.low + step * index for index in range(TICK_COUNT + 1)]


def _ticks(plan: Plan, scale: Dial, ink: str) -> list[dict[str, Any]]:
    marks: list[dict[str, Any]] = []
    start = scale.radius + 2
    for index, value in enumerate(_tick_values(scale)):
        major = index % (TICK_COUNT // 2) == 0
        stroke = Stroke(ink, 2 if major else 1)
        end = start + plan.tick + (2 if major else 0)
        marks += dial.ticks(scale, [value], inner=start, outer=end, stroke=stroke)
    return marks


def _limits(plan: Plan, scale: Dial, thickness: int, ink: str) -> list[dict[str, Any]]:
    """Return the lowest and the highest value, under the two ends of the arc."""
    middle = scale.radius - thickness / 2
    y = plan.center[1] + 3
    return [
        {
            "type": "text",
            "value": _number_text(value),
            "x": scale.point(angle, middle)[0],
            "y": y,
            "size": plan.label_size,
            "color": ink,
            "anchor": "mt",
        }
        for value, angle in ((scale.low, scale.start), (scale.high, scale.end))
    ]


def _marking(
    scale: Dial,
    number: float | None,
    spans: list[Span],
    style: str,
    paint: tuple[int, str],
) -> list[dict[str, Any]]:
    """
    Return what shows the value and the colored ranges.

    A marker across the arc points at the value, over ranges drawn in full. A filled
    arc is drawn up to the value, in the color of each range it passes, or in ink when
    the scale has no ranges.
    """
    thickness, ink = paint
    if style == NEEDLE:
        zones = _zones(scale, spans, thickness)
        if number is None:
            return zones
        marker = Stroke(ink, clamp(scale.radius // 16, 3, 7))
        inner = scale.radius - thickness - 3
        return [
            *zones,
            dial.pointer(
                scale, number, inner=inner, outer=scale.radius + 3, stroke=marker
            ),
        ]
    if number is None:
        return []
    filled = [Span(span.first, min(span.last, number), span.color) for span in spans]
    reached = [span for span in filled if span.last > span.first]
    return _zones(scale, reached or [Span(scale.low, number, ink)], thickness)


def _value_text(plan: Plan, thickness: int) -> dict[str, Any]:
    reading = plan.reading
    size = _value_size(reading, plan.radius - thickness - 2)
    return {
        "type": "text",
        "value": reading.text,
        "x": plan.center[0],
        "y": plan.center[1] - 2,
        "size": size,
        "color": reading.color,
        "anchor": "mb",
        "max_width": 2 * (plan.radius - thickness - 2),
        "truncate": True,
    }


def _name_text(plan: Plan, look: Look) -> dict[str, Any]:
    inside = plan.inside
    return {
        "type": "text",
        "value": plan.reading.name,
        "x": inside.x + inside.width // 2,
        "y": inside.y,
        "size": _name_size(inside.width, inside.height),
        "color": look.ink,
        "anchor": "mt",
        "max_width": inside.width,
        "truncate": True,
    }


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the gauge of the picked entity, or say that none is picked."""
    look = Look.of(context)
    if not context.sources["entities"]:
        return compose(context, look.message(context.box, context.t("choose_entity")))
    options = context.options
    reading = readings_of(context, look.ink)[0]
    plan = _fitted_plan(context, reading)
    low, high = _scale(options)
    scale = Dial(*plan.center, plan.radius, START, SWEEP, low, high)
    thickness = clamp(round(plan.radius * BAND_SHARE), 4, 40)
    elements = compose(context, {"type": "column", **look.frame(), "children": []})
    if plan.radius < 1:
        return elements
    number = number_of(context.data["entities"][0]["state"])
    track = Stroke(look.ink, 2)
    elements += dial.outline_band(
        scale, scale.start, scale.end, thickness=thickness, stroke=track
    )
    spans = spans_of(options["ranges"], low, high)
    elements += _marking(scale, number, spans, options["style"], (thickness, look.ink))
    if plan.shown.ticks:
        elements += _ticks(plan, scale, look.ink)
    if plan.shown.limits:
        elements += _limits(plan, scale, thickness, look.ink)
    if options["showValue"]:
        elements.append(_value_text(plan, thickness))
    if plan.shown.name:
        elements.append(_name_text(plan, look))
    return elements


RENDERER = render
