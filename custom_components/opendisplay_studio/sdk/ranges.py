"""Colored ranges of a scale: where each one starts and what color it is."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, slots=True)
class Span:
    """A stretch of the scale, from `first` to `last`, in one color."""

    first: float
    last: float
    color: str


def spans_of(ranges: list[dict[str, Any]], low: float, high: float) -> list[Span]:
    """
    Return the colored stretches of a scale from `low` to `high`.

    Each range starts where it says and lasts until the next one starts, and the last
    one to `high`. A range with no start, or one that starts at or before `low`, starts
    at the lowest value; of several that do, the one that comes last in the list wins.
    Where no range has started yet the scale has no color, and a range that starts
    at or past `high` is left out.
    """
    starts: dict[float, str] = {}
    for entry in ranges:
        begin = entry["from"]
        starts[low if begin is None or begin <= low else float(begin)] = entry["color"]
    positions = sorted(position for position in starts if position < high)
    ends = [*positions[1:], high]
    return [
        Span(position, end, starts[position])
        for position, end in zip(positions, ends, strict=False)
    ]
