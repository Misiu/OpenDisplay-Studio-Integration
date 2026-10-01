"""
The display palettes of OpenDisplay, from `palettes.json`.

That file is the one source of palettes: the backend reads it here and the panel
imports it at build time. Each palette lists the colors of one OpenDisplay color scheme
(`schemes` names the `ColorScheme` members that use it). A color has an `id` to name
it, a `value` to store in a dashboard, which the renderer resolves, and a `hex` to draw.
Gray levels and orange are not names the renderer knows, so their value is their hex.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Final

_PALETTES: Final[dict[str, dict[str, Any]]] = json.loads(
    (Path(__file__).parent / "palettes.json").read_text(encoding="utf-8")
)

PALETTE_COLORS: Final[dict[str, tuple[str, ...]]] = {
    palette: tuple(color["value"] for color in definition["colors"])
    for palette, definition in _PALETTES.items()
}

PALETTE_BY_COLOR_SCHEME: Final[dict[str, str]] = {
    scheme: palette
    for palette, definition in _PALETTES.items()
    for scheme in definition["schemes"]
}

SUPPORTED_COLORS: Final[frozenset[str]] = frozenset(
    color for colors in PALETTE_COLORS.values() for color in colors
)


def accent_color_for_palette(palette: str) -> str:
    """Return the renderer accent used by a display palette."""
    return str(_PALETTES[palette]["accent"])
