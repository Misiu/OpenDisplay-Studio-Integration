"""Bring the elements of a dashboard file into the dashboard that is open."""

from __future__ import annotations

from typing import Any

from custom_components.opendisplay_studio.color_mapping import (
    EVERY_PALETTE,
    colors_to_map,
    recolored,
    used_colors,
)
from custom_components.opendisplay_studio.dashboard_files import read_file
from custom_components.opendisplay_studio.item_fit import fit_items
from custom_components.opendisplay_studio.items import validate_items
from custom_components.opendisplay_studio.palette import PALETTE_COLORS
from custom_components.opendisplay_studio.primitives import PrimitiveRegistry
from custom_components.opendisplay_studio.validation import fail
from custom_components.opendisplay_studio.widgets import WidgetRegistry


def _checked_mapping(mapping: dict[str, str], palette: str) -> dict[str, str]:
    """Refuse a mapping onto a color the palette does not have."""
    allowed = set(PALETTE_COLORS[palette]) | EVERY_PALETTE
    for source, target in mapping.items():
        if target not in allowed:
            fail(f"colorMap.{source}: {target} is not a color of the palette")
    return mapping


def prepare_import(
    raw_file: object,
    display: dict[str, Any],
    color_map: dict[str, str],
    registry: WidgetRegistry,
    primitives: PrimitiveRegistry,
) -> dict[str, Any]:
    """
    Validate a file against the open dashboard's display and bring its colors over.

    Returns the elements ready to replace the dashboard's, and the colors the palette
    lacks that the user still has to map (those not yet in `color_map`).
    """
    imported = read_file(raw_file)
    width, height, palette = display["width"], display["height"], display["palette"]
    fitted = fit_items(imported["items"], width, height, primitives)
    items = validate_items(fitted, registry, primitives, width, height)
    to_map = colors_to_map(used_colors(items, registry, primitives), palette)
    mapping = _checked_mapping(color_map, palette)
    if mapping:
        items = validate_items(
            recolored(items, mapping, registry, primitives),
            registry,
            primitives,
            width,
            height,
        )
    return {
        "items": items,
        "colorsToMap": [row for row in to_map if row["source"] not in mapping],
        "sourcePalette": imported["display"].get("palette"),
        # True when elements had to be made smaller or moved nearer to fit.
        "adjusted": fitted != imported["items"],
    }
