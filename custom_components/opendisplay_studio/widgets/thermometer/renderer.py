"""Thermometer: the value of a sensor on a classic round dial with a needle."""

from __future__ import annotations

from dataclasses import dataclass, replace
from math import radians
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Dial,
    Look,
    Reading,
    Stroke,
    WidgetContext,
    clamp,
    compose,
    dial,
    fit_text,
    line_height,
    number_of,
    readings_of,
    spans_of,
)

MIN_TEXT: Final = 10
# The dial opens at the bottom: it starts at the lower left and runs 240 degrees.
START: Final = 150
SWEEP: Final = 240
MIN_RADIUS: Final = 24
LABELS_FROM_RADIUS: Final = 60
# The most ticks of either kind; a scale with more of them is given fewer.
MAX_TICKS: Final = 200
MINOR_PER_MAJOR: Final = 5
MIN_MINOR_PITCH: Final = 4
RING: Final = 2
VALUE_DROP: Final = 0.32
# The readout stays between the numbers at the two lower ends of the scale.
VALUE_WIDTH: Final = 1.0
# The renderer measures text a pixel or two apart from the SDK; this keeps it whole.
MEASURE_SLACK: Final = 8
# The name has the room below the dial, which is wider than the readout.
NAME_WIDTH: Final = 1.6
NAME_GAP: Final = 2


@dataclass(frozen=True, slots=True)
class Texts:
    """The sizes of the texts under the hub, and how far down they reach."""

    value_size: int
    name_size: int
    below: int


@dataclass(frozen=True, slots=True)
class Plan:
    """The dial and what is drawn around it, once the frame has been fitted."""

    reading: Reading
    show_name: bool
    radius: int
    center: tuple[int, int]
    texts: Texts


def _scale(options: dict[str, Any]) -> tuple[float, float]:
    low, high = float(options["min"]), float(options["max"])
    return (low, high) if high > low else (low, low + 1)


def _texts(radius: int, reading: Reading, *, show_name: bool) -> Texts:
    """Return the sizes of the texts under the hub for a dial of this radius."""
    value_size = fit_text(
        reading.text,
        round(radius * VALUE_WIDTH),
        clamp(round(radius * 0.32), MIN_TEXT, 56),
        MIN_TEXT,
    )
    name_size = clamp(round(radius * 0.16), MIN_TEXT, 22)
    value_bottom = round(radius * VALUE_DROP) + line_height(value_size) // 2
    ring_bottom = round(radius * 0.5)
    if not show_name:
        return Texts(value_size, name_size, max(value_bottom, ring_bottom))
    name_bottom = value_bottom + NAME_GAP + line_height(name_size)
    return Texts(value_size, name_size, max(name_bottom, ring_bottom))


def _fits(radius: int, reading: Reading, height: int, *, show_name: bool) -> bool:
    return radius + _texts(radius, reading, show_name=show_name).below <= height


def _largest_radius(
    reading: Reading, width: int, height: int, *, show_name: bool
) -> int:
    """Return the biggest radius whose dial and texts fit the room, by bisection."""
    low, high = 0, width // 2
    while low < high:
        middle = (low + high + 1) // 2
        if _fits(middle, reading, height, show_name=show_name):
            low = middle
        else:
            high = middle - 1
    return low


def _plan(context: WidgetContext, reading: Reading) -> Plan:
    box = context.box
    padding = clamp(min(box.width, box.height) // 14, 4, 16)
    inside = box.inset(padding)
    show_name = bool(context.options["showName"])
    room = (inside.width, inside.height)
    radius = _largest_radius(reading, *room, show_name=show_name)
    if show_name and radius < MIN_RADIUS:
        show_name = False
        radius = _largest_radius(reading, *room, show_name=show_name)
    texts = _texts(radius, reading, show_name=show_name)
    top = inside.y + (inside.height - radius - texts.below) // 2
    return Plan(
        reading=reading,
        show_name=show_name,
        radius=radius,
        center=(inside.x + inside.width // 2, top + radius),
        texts=texts,
    )


def _values(low: float, high: float, step: float) -> list[float]:
    """Return the values from `low` to `high` that are whole steps from `low`."""
    count = int((high - low) / step + 1e-9)
    return [low + step * index for index in range(count + 1)]


def _major_step(options: dict[str, Any], low: float, high: float) -> float:
    """Return the distance between the long ticks, kept to a drawable number."""
    step = float(options["majorStep"])
    if step <= 0 or (high - low) / step > MAX_TICKS:
        return (high - low) / 10
    return step


def _arc_length(radius: float) -> float:
    """Return how long the whole scale is along its arc, in pixels."""
    return radius * radians(SWEEP)


def _ticks(plan: Plan, scale: Dial, step: float, ink: str) -> list[dict[str, Any]]:
    major_length = clamp(round(scale.radius * 0.1), 4, 12)
    minor_length = clamp(round(scale.radius * 0.05), 3, 6)
    edge = scale.radius - RING
    majors = _values(scale.low, scale.high, step)
    elements = dial.ticks(
        scale,
        majors,
        inner=edge - major_length,
        outer=edge,
        stroke=Stroke(ink, 2),
    )
    minor_step = step / MINOR_PER_MAJOR
    pitch = _arc_length(scale.radius) * minor_step / (scale.high - scale.low)
    if pitch >= MIN_MINOR_PITCH:
        minors = [
            value
            for value in _values(scale.low, scale.high, minor_step)
            if min(abs(value - major) for major in majors) > minor_step / 2
        ]
        elements += dial.ticks(
            scale,
            minors,
            inner=edge - minor_length,
            outer=edge,
            stroke=Stroke(ink, 1),
        )
    return elements


def _labels(plan: Plan, scale: Dial, step: float, ink: str) -> list[dict[str, Any]]:
    if scale.radius < LABELS_FROM_RADIUS:
        return []
    size = clamp(round(scale.radius * 0.11), MIN_TEXT, 16)
    distance = scale.radius - clamp(round(scale.radius * 0.1), 4, 12) - size
    labels = []
    for value in _values(scale.low, scale.high, step):
        x, y = scale.place(value, distance)
        labels.append(
            {
                "type": "text",
                "value": f"{value:g}",
                "x": x,
                "y": y,
                "size": size,
                "color": ink,
                "anchor": "mm",
            }
        )
    return labels


def _readout(plan: Plan, look: Look) -> list[dict[str, Any]]:
    reading = plan.reading
    x, y = plan.center
    value_y = y + round(plan.radius * VALUE_DROP)
    texts = plan.texts
    elements: list[dict[str, Any]] = [
        {
            "type": "text",
            "value": reading.text,
            "x": x,
            "y": value_y,
            "size": texts.value_size,
            "color": reading.color,
            "anchor": "mm",
            "max_width": round(plan.radius * VALUE_WIDTH) + MEASURE_SLACK,
            "truncate": True,
        }
    ]
    if plan.show_name:
        name_y = value_y + line_height(texts.value_size) // 2 + NAME_GAP
        elements.append(
            {
                "type": "text",
                "value": reading.name,
                "x": x,
                "y": name_y,
                "size": texts.name_size,
                "color": look.ink,
                "anchor": "mt",
                "max_width": round(plan.radius * NAME_WIDTH),
                "truncate": True,
            }
        )
    return elements


def _needle(
    plan: Plan, scale: Dial, number: float, color: str, ink: str
) -> list[dict[str, Any]]:
    length = scale.radius - clamp(round(scale.radius * 0.1), 4, 12) - 3
    width = clamp(scale.radius // 14, 3, 8)
    return [
        dial.needle(scale, number, length=length, stroke=Stroke(color, width)),
        dial.hub(scale, width, ink),
    ]


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the thermometer of the picked entity, or say that none is picked."""
    look = Look.of(context)
    if not context.sources["entities"]:
        return compose(context, look.message(context.box, context.t("choose_entity")))
    options = context.options
    reading = readings_of(context, look.ink)[0]
    plan = _plan(context, reading)
    elements = compose(context, {"type": "column", **look.frame(), "children": []})
    if plan.radius < MIN_RADIUS:
        return elements
    low, high = _scale(options)
    outer = Dial(*plan.center, plan.radius, START, SWEEP, low, high)
    spans = spans_of(options["ranges"], low, high)
    band_width = clamp(round(plan.radius * 0.06), 3, 8) if spans else 0
    scale = replace(outer, radius=plan.radius - (band_width + 1 if spans else 0))
    step = _major_step(options, low, high)
    for span in spans:
        elements += dial.band(
            outer,
            outer.angle(span.first),
            outer.angle(span.last),
            thickness=band_width,
            color=span.color,
        )
    elements += dial.band(scale, scale.start, scale.end, thickness=RING, color=look.ink)
    elements += _ticks(plan, scale, step, look.ink)
    if options["showLabels"]:
        elements += _labels(plan, scale, step, look.ink)
    number = number_of(context.data["entities"][0]["state"])
    if number is not None:
        elements += _needle(plan, scale, number, options["needleColor"], look.ink)
    if options["showValue"]:
        elements += _readout(plan, look)
    return elements


RENDERER = render
