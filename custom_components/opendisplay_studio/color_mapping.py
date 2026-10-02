"""
Colors of imported elements, brought over to the palette of the dashboard they land in.

A file made for a display with six colors may be imported into a dashboard of three. The
colors both palettes have stay as they are; for each other color the user chooses one of
the dashboard's palette, and the nearest is suggested. Every place an element keeps a
color is visited by one walk, so finding the colors and replacing them cannot disagree.
"""

from __future__ import annotations

import json
from collections.abc import Callable
from copy import deepcopy
from pathlib import Path
from typing import Any, Final, TypeGuard

from custom_components.opendisplay_studio.palette import PALETTE_COLORS
from custom_components.opendisplay_studio.primitives import PrimitiveRegistry
from custom_components.opendisplay_studio.widgets import WidgetRegistry

# Names the renderer resolves against the display itself: they exist in every palette.
EVERY_PALETTE: Final = frozenset({"accent", "transparent"})
COLOR_SELECTOR: Final = "opendisplay_color"

type Recolor = Callable[[str], str]

_HEX_BY_COLOR: Final[dict[str, str]] = {
    color["value"]: color["hex"]
    for definition in json.loads(
        (Path(__file__).parent / "palettes.json").read_text(encoding="utf-8")
    ).values()
    for color in definition["colors"]
}


def _is_color(value: object) -> TypeGuard[str]:
    return isinstance(value, str) and value not in EVERY_PALETTE


def _walk_primitive_fields(
    fields: list[dict[str, Any]], values: dict[str, Any], recolor: Recolor
) -> None:
    """Recolor the color fields of a primitive or of an object nested in one."""
    for field in fields:
        value = values.get(field["key"])
        shape = field["shape"]
        if shape == "color" and _is_color(value):
            values[field["key"]] = recolor(value)
        elif shape == "object" and isinstance(value, dict):
            _walk_primitive_fields(field["nested"], value, recolor)
        elif shape == "objects" and isinstance(value, list):
            for entry in value:
                if isinstance(entry, dict):
                    _walk_primitive_fields(field["nested"], entry, recolor)


def _walk_color_selectors(
    fields: list[dict[str, Any]], values: dict[str, Any], recolor: Recolor
) -> None:
    """Recolor the values of widget fields that are edited as a palette color."""
    for field in fields:
        if COLOR_SELECTOR not in field["selector"]:
            continue
        value = values.get(field["key"])
        if _is_color(value):
            values[field["key"]] = recolor(value)


def _walk_widget(
    widget: dict[str, Any], registry: WidgetRegistry, recolor: Recolor
) -> None:
    if widget["type"] not in registry.widget_types:
        return
    definition = registry.definition(widget["type"])
    option_fields = [
        field for section in definition["options"] for field in section["fields"]
    ]
    _walk_color_selectors(option_fields, widget["options"], recolor)
    for source in definition["sources"]:
        for pick in widget["sources"].get(source["key"], []):
            _walk_color_selectors(source["perSource"], pick, recolor)


def _walk_background(background: object, recolor: Recolor) -> None:
    if not isinstance(background, dict):
        return
    for key in ("fill", "outline"):
        if _is_color(background.get(key)):
            background[key] = recolor(background[key])


def _walk_items(
    items: list[dict[str, Any]],
    recolor: Recolor,
    registry: WidgetRegistry,
    primitives: PrimitiveRegistry,
) -> None:
    for item in items:
        if item["kind"] == "primitive":
            definition = primitives.definition(item["primitive"]["type"])
            _walk_primitive_fields(definition["fields"], item["primitive"], recolor)
        elif item["kind"] == "widget":
            _walk_widget(item["widget"], registry, recolor)
        else:
            _walk_background(item.get("background"), recolor)
            _walk_background(item.get("savedBackground"), recolor)
            _walk_items(item.get("children", []), recolor, registry, primitives)


def used_colors(
    items: list[dict[str, Any]],
    registry: WidgetRegistry,
    primitives: PrimitiveRegistry,
) -> list[str]:
    """Return the colors the elements really use, each once, in order of first use."""
    found: dict[str, None] = {}

    def note(color: str) -> str:
        found.setdefault(color)
        return color

    _walk_items(items, note, registry, primitives)
    return list(found)


def recolored(
    items: list[dict[str, Any]],
    mapping: dict[str, str],
    registry: WidgetRegistry,
    primitives: PrimitiveRegistry,
) -> list[dict[str, Any]]:
    """Return the elements with every color in `mapping` replaced by its target."""
    result = deepcopy(items)
    _walk_items(result, lambda color: mapping.get(color, color), registry, primitives)
    return result


def _rgb(color: str) -> tuple[int, int, int]:
    text = _HEX_BY_COLOR.get(color, color).removeprefix("#")
    return int(text[0:2], 16), int(text[2:4], 16), int(text[4:6], 16)


def nearest_color(color: str, palette: str) -> str:
    """Return the color of `palette` that looks most like `color`."""
    source = _rgb(color)

    def distance(candidate: str) -> int:
        return sum((a - b) ** 2 for a, b in zip(source, _rgb(candidate), strict=True))

    return min(PALETTE_COLORS[palette], key=distance)


def colors_to_map(used: list[str], palette: str) -> list[dict[str, str]]:
    """Return the used colors the palette lacks, each with its nearest color."""
    return [
        {"source": color, "suggestion": nearest_color(color, palette)}
        for color in used
        if color not in PALETTE_COLORS[palette]
    ]
