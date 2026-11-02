"""Which dashboards use a font, so a font in use is not removed unawares."""

from __future__ import annotations

from typing import Any

from .primitives import DEFAULT_PRIMITIVES


def _fonts_of_item(item: dict[str, Any]) -> set[str]:
    if item["kind"] == "primitive":
        primitive = item["primitive"]
        keys = DEFAULT_PRIMITIVES.keys_of_shape(primitive["type"], "font")
        return {primitive[key] for key in keys if key in primitive}
    if item["kind"] == "widget":
        font = item["widget"].get("options", {}).get("font")
        return {font} if isinstance(font, str) else set()
    return set()


def fonts_used_by(items: list[dict[str, Any]]) -> set[str]:
    """
    Return the fonts stored in `items`, containers included.

    A font that an expression picks is only known when it is drawn, so it is not here.
    """
    used: set[str] = set()
    for item in items:
        used |= _fonts_of_item(item)
        used |= fonts_used_by(item.get("children", []))
    return used


def dashboards_using(
    dashboards: list[dict[str, Any]], font: str
) -> list[dict[str, str]]:
    """Return the id and name of every dashboard that uses `font`."""
    return [
        {"id": dashboard["id"], "name": dashboard["name"]}
        for dashboard in dashboards
        if font in fonts_used_by(dashboard["items"])
    ]
