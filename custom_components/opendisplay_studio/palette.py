"""Canonical output colors exposed to palette-aware widget fields."""

from __future__ import annotations

from typing import Final


def _grayscale(levels: int) -> tuple[str, ...]:
    """Return evenly distributed grayscale colors including black and white."""
    values = (round(255 * index / (levels - 1)) for index in range(levels))
    return tuple(f"#{channel:02x}{channel:02x}{channel:02x}" for channel in values)


PALETTE_COLORS: Final[dict[str, tuple[str, ...]]] = {
    "bw": ("#000000", "#ffffff"),
    "gray4": _grayscale(4),
    "gray16": _grayscale(16),
    "bwr": ("#000000", "#ffffff", "#d22626"),
    "bwy": ("#000000", "#ffffff", "#e5b800"),
    "bwry": ("#000000", "#ffffff", "#d22626", "#e5b800"),
    "spectra6": (
        "#000000",
        "#ffffff",
        "#d22626",
        "#e5b800",
        "#285995",
        "#72a85a",
    ),
}


def normalize_palette_color(palette: str, value: object) -> str:
    """Keep a configured color only when the selected display can produce it."""
    colors = PALETTE_COLORS[palette]
    normalized = str(value).lower()
    return normalized if normalized in colors else colors[0]
