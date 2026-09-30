"""Split a box into rows, columns and grid cells."""

from __future__ import annotations

from collections.abc import Sequence

from custom_components.opendisplay_studio.odl import Box


def _split(total: int, weights: Sequence[int], gap: int) -> list[tuple[int, int]]:
    """Return (offset, length) pairs that share `total` by weight, gaps between."""
    count = len(weights)
    available = max(count, total - gap * (count - 1))
    weight_sum = sum(weights)
    spans: list[tuple[int, int]] = []
    offset = 0
    used_weight = 0
    for weight in weights:
        used_weight += weight
        end = round(available * used_weight / weight_sum)
        spans.append((offset, max(1, end - offset)))
        offset = end + gap
    return spans


def rows(box: Box, weights: Sequence[int] | int, gap: int = 0) -> list[Box]:
    """Stack boxes top to bottom; an int means that many equal rows."""
    shares = [1] * weights if isinstance(weights, int) else list(weights)
    return [
        Box(box.x, box.y + offset, box.width, length)
        for offset, length in _split(box.height, shares, gap)
    ]


def columns(box: Box, weights: Sequence[int] | int, gap: int = 0) -> list[Box]:
    """Place boxes left to right; an int means that many equal columns."""
    shares = [1] * weights if isinstance(weights, int) else list(weights)
    return [
        Box(box.x + offset, box.y, length, box.height)
        for offset, length in _split(box.width, shares, gap)
    ]


def grid(box: Box, column_count: int, row_count: int, gap: int = 0) -> list[Box]:
    """Return the cells of a grid in reading order."""
    return [
        cell
        for row in rows(box, row_count, gap)
        for cell in columns(row, column_count, gap)
    ]


def inset(box: Box, amount: int) -> Box:
    """Shrink a box by `amount` on every side."""
    return box.inset(amount)
