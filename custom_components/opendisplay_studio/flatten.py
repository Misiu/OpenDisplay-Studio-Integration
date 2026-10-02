"""Flatten the item tree into the absolute, ordered list the compiler draws."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .primitives import DEFAULT_PRIMITIVES, PrimitiveRegistry
from .validation import single_expression_body


@dataclass(frozen=True, slots=True)
class Placed:
    """One item of the tree with the offset of the containers above it."""

    item: dict[str, Any]
    x: int
    y: int
    hidden: bool
    # `visible` templates of the containers above, each the inside of a `{{ }}`.
    conditions: tuple[str, ...] = ()


def flatten_items(items: list[dict[str, Any]]) -> list[Placed]:
    """
    Return every item in drawing order: a container, then its children.

    Sibling order is z-order, so the first item is drawn first. A hidden container
    hides everything inside it.
    """
    placed: list[Placed] = []
    _place(items, Placed({}, 0, 0, hidden=False), placed)
    return placed


def _place(items: list[dict[str, Any]], parent: Placed, into: list[Placed]) -> None:
    """Place `items` inside `parent`, which supplies the offset and inherited state."""
    for item in items:
        placed = Placed(
            item,
            parent.x,
            parent.y,
            parent.hidden or item.get("hidden", False),
            parent.conditions,
        )
        into.append(placed)
        if item["kind"] == "container":
            visible = item.get("expressions", {}).get("visible")
            body = single_expression_body(visible) if visible else None
            inside = Placed(
                item,
                parent.x + item["x"],
                parent.y + item["y"],
                placed.hidden,
                (*parent.conditions, body) if body else parent.conditions,
            )
            _place(item["children"], inside, into)


def shift_primitive(
    primitive: dict[str, Any],
    offset_x: int,
    offset_y: int,
    registry: PrimitiveRegistry = DEFAULT_PRIMITIVES,
) -> dict[str, Any]:
    """
    Return the ODL element of `primitive`, its coordinates moved by the offset.

    Optional fields left unset are omitted, so the renderer applies its own default.
    """
    shifted = registry.element(primitive)
    for field in registry.definition(primitive["type"])["fields"]:
        key = field["key"]
        if key not in shifted:
            continue
        if field["shape"] == "coordinate":
            shifted[key] += offset_x if field["axis"] == "x" else offset_y
        elif field["shape"] == "points":
            shifted[key] = [[x + offset_x, y + offset_y] for x, y in shifted[key]]
    return shifted


X_KEYS = ("x", "x_start", "x_end")
Y_KEYS = ("y", "y_start", "y_end")


def translate_elements(
    elements: list[dict[str, Any]], offset_x: int, offset_y: int
) -> list[dict[str, Any]]:
    """Return ODL elements with every position moved by the offset."""
    moved = []
    for element in elements:
        copy = dict(element)
        for key in X_KEYS:
            if key in copy:
                copy[key] += offset_x
        for key in Y_KEYS:
            if key in copy:
                copy[key] += offset_y
        if "points" in copy:
            copy["points"] = [[x + offset_x, y + offset_y] for x, y in copy["points"]]
        moved.append(copy)
    return moved


def background_element(container: dict[str, Any], x: int, y: int) -> dict[str, Any]:
    """Return the rectangle a container's background is drawn as."""
    background = container["background"]
    element: dict[str, Any] = {
        "type": "rectangle",
        "x_start": x + container["x"],
        "y_start": y + container["y"],
        "x_end": x + container["x"] + container["width"] - 1,
        "y_end": y + container["y"] + container["height"] - 1,
        "fill": background["fill"],
        "outline": background["outline"],
        "width": background["width"],
    }
    if background["radius"]:
        element["radius"] = background["radius"]
    return element
