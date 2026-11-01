"""
A dial: a scale drawn along an arc, with bands, ticks and a pointer, as on a gauge.

A dial is placed by arithmetic, not by odl-layout: its parts lie at angles from one
center, which no row or column describes. The angles are those of ODL's `arc`:
degrees clockwise from the three o'clock position, so 180 is the left, 270 the top and
0 the right.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import cos, radians, sin
from typing import Any, Final

# An arc shorter than this many degrees is not drawn; the renderer would draw a dot.
MIN_SWEEP: Final = 0.5
FULL_TURN: Final = 360


@dataclass(frozen=True, slots=True)
class Stroke:
    """The color and thickness a part of the dial is drawn with."""

    color: str
    width: int


@dataclass(frozen=True, slots=True)
class Dial:
    """
    Where a scale lies: its center, its outer radius and the angles it spans.

    `start` is the angle of `low`, the lowest value, and the scale runs `sweep` degrees
    clockwise to `high`. A value outside the scale is drawn at the nearer end.
    """

    x: int
    y: int
    radius: int
    start: float
    sweep: float
    low: float
    high: float

    def angle(self, value: float) -> float:
        """Return the angle of a value on the scale."""
        reach = (value - self.low) / (self.high - self.low)
        return self.start + self.sweep * min(1.0, max(0.0, reach))

    def point(self, angle: float, distance: float) -> tuple[int, int]:
        """Return the pixel `distance` from the center at `angle`."""
        return (
            round(self.x + distance * cos(radians(angle))),
            round(self.y + distance * sin(radians(angle))),
        )

    def place(self, value: float, distance: float) -> tuple[int, int]:
        """Return the pixel `distance` from the center at the angle of a value."""
        return self.point(self.angle(value), distance)

    @property
    def end(self) -> float:
        """Return the angle of the highest value."""
        return self.start + self.sweep


def _arc(
    dial: Dial, first: float, last: float, radius: int, stroke: Stroke
) -> list[dict[str, Any]]:
    if last - first < MIN_SWEEP or stroke.width < 1:
        return []
    return [
        {
            "type": "arc",
            "x": dial.x,
            "y": dial.y,
            "radius": radius,
            "start_angle": first % FULL_TURN,
            "end_angle": last % FULL_TURN,
            "outline": stroke.color,
            "width": stroke.width,
        }
    ]


def _segment(
    dial: Dial, angle: float, inner: float, outer: float, stroke: Stroke
) -> dict[str, Any]:
    start = dial.point(angle, inner)
    end = dial.point(angle, outer)
    return {
        "type": "line",
        "x_start": start[0],
        "y_start": start[1],
        "x_end": end[0],
        "y_end": end[1],
        "fill": stroke.color,
        "width": stroke.width,
    }


def band(
    dial: Dial, first: float, last: float, *, thickness: int, color: str
) -> list[dict[str, Any]]:
    """Return a solid band between two angles, its outer edge on the dial's radius."""
    return _arc(dial, first, last, dial.radius, Stroke(color, thickness))


def outline_band(
    dial: Dial, first: float, last: float, *, thickness: int, stroke: Stroke
) -> list[dict[str, Any]]:
    """Return a band drawn as its two edges and its two ends, empty inside."""
    inner = dial.radius - thickness + stroke.width
    return [
        *_arc(dial, first, last, dial.radius, stroke),
        *_arc(dial, first, last, inner, stroke),
        _segment(dial, first, inner, dial.radius, stroke),
        _segment(dial, last, inner, dial.radius, stroke),
    ]


def ticks(
    dial: Dial, values: list[float], *, inner: float, outer: float, stroke: Stroke
) -> list[dict[str, Any]]:
    """Return a short line across the scale at each value, from `inner` to `outer`."""
    return [_segment(dial, dial.angle(value), inner, outer, stroke) for value in values]


def pointer(
    dial: Dial, value: float, *, inner: float, outer: float, stroke: Stroke
) -> dict[str, Any]:
    """Return a line across the scale at a value, as thick as the stroke."""
    return _segment(dial, dial.angle(value), inner, outer, stroke)


def needle(
    dial: Dial, value: float, *, length: float, stroke: Stroke
) -> dict[str, Any]:
    """Return a needle from the center to `length` at a value, as wide as the stroke."""
    angle = dial.angle(value)
    left = dial.point(angle - 90, stroke.width / 2)
    right = dial.point(angle + 90, stroke.width / 2)
    return {
        "type": "polygon",
        "points": [list(left), list(dial.point(angle, length)), list(right)],
        "fill": stroke.color,
        "outline": stroke.color,
    }


def hub(dial: Dial, radius: int, color: str) -> dict[str, Any]:
    """Return the disc at the center of the dial."""
    return {
        "type": "circle",
        "x": dial.x,
        "y": dial.y,
        "radius": radius,
        "fill": color,
        "outline": color,
    }
