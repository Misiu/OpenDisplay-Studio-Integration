"""A font that is not installed is drawn with the default one, and a warning says so."""

from __future__ import annotations

import asyncio
from collections.abc import Iterable
from dataclasses import replace
from typing import TYPE_CHECKING, Any

from .flatten import Placed
from .font_usage import fonts_used_by
from .fonts import BUNDLED_FONTS, DEFAULT_FONT, available_fonts, font_directories
from .primitives import DEFAULT_PRIMITIVES

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


class InstalledFonts:
    """The names of the fonts the renderer can find."""

    def __init__(self, names: Iterable[str]) -> None:
        """Remember the `names` of the fonts that exist."""
        self._names = frozenset(names)

    @classmethod
    async def for_items(
        cls, hass: HomeAssistant, items: list[dict[str, Any]]
    ) -> InstalledFonts:
        """Find the installed fonts; the folder is read only when an item names one."""
        if not fonts_used_by(items) - set(BUNDLED_FONTS):
            return cls(BUNDLED_FONTS)
        return cls(await asyncio.to_thread(available_fonts, font_directories(hass)))

    def resolve(self, name: str, owner: str, warnings: list[str]) -> str:
        """Return `name` when the font exists, else the default font and a warning."""
        if name in self._names:
            return name
        warnings.append(f"{owner}: font {name} is not installed, using {DEFAULT_FONT}")
        return DEFAULT_FONT


def _primitive_fonts(primitive: dict[str, Any]) -> dict[str, str]:
    keys = DEFAULT_PRIMITIVES.keys_of_shape(primitive["type"], "font")
    return {key: primitive[key] for key in keys if key in primitive}


def _with_installed_font(
    placed: Placed, installed: InstalledFonts, warnings: list[str]
) -> Placed:
    """Return `placed` with the installed fonts of its primitive, without editing it."""
    item = placed.item
    if item["kind"] != "primitive":
        return placed
    # A hidden primitive is measured too, so it needs a font, but is not warned about.
    unheard: list[str] = []
    sink = unheard if placed.hidden else warnings
    chosen = _primitive_fonts(item["primitive"])
    resolved = {
        key: installed.resolve(name, item["name"], sink) for key, name in chosen.items()
    }
    if resolved == chosen:
        return placed
    return replace(
        placed, item={**item, "primitive": {**item["primitive"], **resolved}}
    )


def with_installed_fonts(
    placed_items: list[Placed], installed: InstalledFonts, warnings: list[str]
) -> list[Placed]:
    """Replace the fonts of primitives that are not installed, as `resolve` does."""
    return [
        _with_installed_font(placed, installed, warnings) for placed in placed_items
    ]
