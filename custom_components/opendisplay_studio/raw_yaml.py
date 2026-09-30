"""The Code view: the flat ODL a dashboard compiles to, with templates left in."""

from __future__ import annotations

from typing import Any

from .flatten import Placed, background_element, shift_primitive
from .primitives import DEFAULT_PRIMITIVES, PrimitiveRegistry
from .validation import single_expression_body


def _shifted_template(template: str, offset: int) -> str:
    """Add a container's offset to a position template so it stays absolute."""
    body = single_expression_body(template)
    if body is None or offset == 0:
        return template
    sign = "+" if offset > 0 else "-"
    return f"{{{{ ({body}) | float(0) {sign} {abs(offset)} }}}}"


def _visible(placed: Placed, template: str | None) -> str | None:
    """Combine the item's own `visible` template with those of its containers."""
    if not placed.conditions:
        return template
    own = single_expression_body(template) if template else None
    bodies = (*placed.conditions, *((own,) if own else ()))
    return "{{ " + " and ".join(f"({body})" for body in bodies) + " }}"


def _primitive_element(placed: Placed, primitives: PrimitiveRegistry) -> dict[str, Any]:
    item = placed.item
    element = shift_primitive(item["primitive"], placed.x, placed.y, primitives)
    axes = {
        field["key"]: field["axis"]
        for field in primitives.definition(element["type"])["fields"]
        if field["shape"] == "coordinate"
    }
    for key, template in item.get("expressions", {}).items():
        if key in axes:
            offset = placed.x if axes[key] == "x" else placed.y
            element[key] = _shifted_template(template, offset)
        elif key != "visible":
            element[key] = template
    return element


def raw_elements(
    placed_items: list[Placed],
    widget_elements: dict[str, list[dict[str, Any]]],
    primitives: PrimitiveRegistry = DEFAULT_PRIMITIVES,
) -> list[dict[str, Any]]:
    """Return the elements of every visible item, expressions kept as written."""
    elements: list[dict[str, Any]] = []
    for placed in placed_items:
        item = placed.item
        if placed.hidden:
            continue
        if item["kind"] == "container":
            drawn = (
                [background_element(item, placed.x, placed.y)]
                if item["background"] is not None
                else []
            )
        elif item["kind"] == "primitive":
            drawn = [_primitive_element(placed, primitives)]
        else:
            drawn = [dict(element) for element in widget_elements.get(item["id"], [])]
        visible = _visible(placed, item.get("expressions", {}).get("visible"))
        elements.extend(
            {**element, "visible": visible} if visible else element for element in drawn
        )
    return elements
