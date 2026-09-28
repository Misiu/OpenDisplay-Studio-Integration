"""Canonical display palettes supported by OpenDisplay Studio."""

from typing import Final

PALETTE_COLORS: Final[dict[str, tuple[str, ...]]] = {
    "bw": ("black", "white"),
    "bwr": ("black", "white", "red"),
    "bwy": ("black", "white", "yellow"),
    "bwry": ("black", "white", "red", "yellow"),
    "spectra6": ("black", "white", "red", "yellow", "blue", "green"),
}

SUPPORTED_COLORS: Final[frozenset[str]] = frozenset(
    color for colors in PALETTE_COLORS.values() for color in colors
)


def accent_color_for_palette(palette: str) -> str:
    """Return the renderer accent used by a display palette."""
    return "yellow" if palette in {"bwy", "bwry"} else "red"
