"""Validation of the item tree: widgets, primitives and containers."""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from typing import Any, Final

from .primitives import PrimitiveRegistry
from .validation import (
    DashboardValidationError,
    boolean,
    color,
    expression,
    fail,
    integer,
    single_expression_body,
    string,
)
from .widgets import WidgetRegistry

MAX_ITEMS: Final = 256
MAX_DEPTH: Final = 8
MAX_NAME_LENGTH: Final = 100
CONTAINER_KIND: Final = "container"
# Every kind of item can be shown or hidden by a template.
ITEM_EXPRESSIONS: Final = frozenset({"visible"})


@dataclass
class _Walk:
    """What one pass over the tree needs to remember."""

    registry: WidgetRegistry
    primitives: PrimitiveRegistry
    width: int
    height: int
    ids: set[str] = field(default_factory=set)
    used_names: set[str] = field(default_factory=set)
    count: int = 0


def _item_state(value: dict[str, Any], walk: _Walk) -> dict[str, Any]:
    walk.count += 1
    if walk.count > MAX_ITEMS:
        fail(f"items must contain at most {MAX_ITEMS} items")
    item_id = string(value.get("id"), "item.id", 64)
    if item_id in walk.ids:
        fail("item ids must be unique")
    walk.ids.add(item_id)
    state: dict[str, Any] = {
        "id": item_id,
        "locked": boolean(value.get("locked", False), "item.locked"),
        "hidden": boolean(value.get("hidden", False), "item.hidden"),
    }
    name = value.get("name")
    if name is not None:
        state["name"] = string(name, "item.name", MAX_NAME_LENGTH)
        walk.used_names.add(state["name"])
    return state


def _expressions(
    value: dict[str, Any],
    allowed: frozenset[str],
    *,
    single: frozenset[str] = frozenset(),
) -> dict[str, str]:
    """
    Validate the templates beside an item's literal fields.

    The fields in `single` must be one `{{ ... }}` expression, so the Code view can
    fold a container's offset or visibility into it.
    """
    raw = value.get("expressions", {})
    if not isinstance(raw, dict):
        fail("expressions must be an object")
    result: dict[str, str] = {}
    for key, template in raw.items():
        if key not in allowed:
            fail(f"expressions.{key} is not a field that can be an expression")
        result[key] = expression(template, f"expressions.{key}")
        if key in single and single_expression_body(result[key]) is None:
            fail(f"expressions.{key} must be a single {{{{ ... }}}} expression")
    return result


def _single(*, relative: bool) -> frozenset[str]:
    """Return the templates that must be a single expression inside a container."""
    return ITEM_EXPRESSIONS if relative else frozenset()


def _with_expressions(item: dict[str, Any], expressions: dict[str, str]) -> None:
    if expressions:
        item["expressions"] = expressions


def _validate_frame(
    value: object, width: int, height: int, *, relative: bool
) -> dict[str, int]:
    if not isinstance(value, dict):
        fail("widget frame must be an object")
    if relative:
        x = integer(value.get("x"), "frame.x", -width, width)
        y = integer(value.get("y"), "frame.y", -height, height)
    else:
        x = integer(value.get("x"), "frame.x", 0, width - 1)
        y = integer(value.get("y"), "frame.y", 0, height - 1)
    frame_width = integer(value.get("width"), "frame.width", 1, width)
    frame_height = integer(value.get("height"), "frame.height", 1, height)
    if not relative and (x + frame_width > width or y + frame_height > height):
        fail("widget frame exceeds the display")
    return {"x": x, "y": y, "width": frame_width, "height": frame_height}


def _validate_widget(
    value: dict[str, Any], walk: _Walk, *, relative: bool
) -> dict[str, Any]:
    state = _item_state(value, walk)
    widget = value.get("widget")
    if not isinstance(widget, dict):
        fail("widget item requires widget")
    widget_type = string(widget.get("type"), "widget.type", 64)
    definition = walk.registry.definition(widget_type)
    version = string(widget.get("version", definition["version"]), "widget.version", 64)
    config = widget.get("config", {})
    if not isinstance(config, dict):
        fail("widget.config must be an object")
    layout = value.get("layout", {})
    if not isinstance(layout, dict):
        fail("widget layout must be an object")
    item = {
        **state,
        "kind": "widget",
        "widget": {"type": widget_type, "version": version, "config": deepcopy(config)},
        "frame": _validate_frame(
            value.get("frame"), walk.width, walk.height, relative=relative
        ),
        "layout": {
            "padding": integer(layout.get("padding", 0), "layout.padding", 0, 128)
        },
    }
    _with_expressions(
        item, _expressions(value, ITEM_EXPRESSIONS, single=_single(relative=relative))
    )
    item["_type"] = widget_type
    return item


def _validate_primitive(
    value: dict[str, Any], walk: _Walk, *, relative: bool
) -> dict[str, Any]:
    state = _item_state(value, walk)
    primitive = value.get("primitive")
    if not isinstance(primitive, dict):
        fail("primitive item requires primitive")
    primitive_type = primitive.get("type")
    if not isinstance(primitive_type, str):
        fail(f"Unsupported primitive type: {primitive_type}")
    # An unknown type has no fields; `normalize` reports it.
    known = walk.primitives.field_keys(primitive_type)
    single = _single(relative=relative)
    if relative:
        single |= walk.primitives.coordinate_keys(primitive_type)
    expressions = _expressions(value, known | ITEM_EXPRESSIONS, single=single)
    item = {
        **state,
        "kind": "primitive",
        "primitive": walk.primitives.normalize(
            primitive,
            walk.width,
            walk.height,
            relative=relative,
            expressed=frozenset(expressions),
        ),
    }
    _with_expressions(item, expressions)
    item["_type"] = primitive_type
    return item


def _validate_background(value: object) -> dict[str, Any] | None:
    if value is None:
        return None
    if not isinstance(value, dict):
        fail("container.background must be an object")
    return {
        "fill": color(value.get("fill"), "background.fill", allow_none=True),
        "outline": color(value.get("outline", "black"), "background.outline"),
        "width": integer(value.get("width", 1), "background.width", 0, 32),
        "radius": integer(value.get("radius", 0), "background.radius", 0, 256),
    }


def _validate_container(
    value: dict[str, Any], walk: _Walk, *, relative: bool, depth: int
) -> dict[str, Any]:
    if depth > MAX_DEPTH:
        fail(f"containers can be nested at most {MAX_DEPTH} levels")
    state = _item_state(value, walk)
    width, height = walk.width, walk.height
    if relative:
        x = integer(value.get("x"), "container.x", -width, width)
        y = integer(value.get("y"), "container.y", -height, height)
    else:
        x = integer(value.get("x"), "container.x", 0, width - 1)
        y = integer(value.get("y"), "container.y", 0, height - 1)
    grouped = boolean(value.get("grouped", False), "container.grouped")
    background = None if grouped else _validate_background(value.get("background"))
    raw_children = value.get("children", [])
    if not isinstance(raw_children, list):
        fail("container.children must be a list")
    item = {
        **state,
        "kind": CONTAINER_KIND,
        "x": x,
        "y": y,
        "width": integer(value.get("width"), "container.width", 1, width),
        "height": integer(value.get("height"), "container.height", 1, height),
        "grouped": grouped,
        "background": background,
        "children": [
            _validate_item(child, walk, relative=True, depth=depth + 1)
            for child in raw_children
        ],
    }
    _with_expressions(
        item, _expressions(value, ITEM_EXPRESSIONS, single=_single(relative=True))
    )
    item["_type"] = CONTAINER_KIND
    return item


def _validate_item(
    value: object, walk: _Walk, *, relative: bool, depth: int
) -> dict[str, Any]:
    if not isinstance(value, dict):
        fail("every item must be an object")
    kind = value.get("kind")
    if kind != CONTAINER_KIND and "children" in value:
        fail("only a container can have children")
    if kind == "widget":
        return _validate_widget(value, walk, relative=relative)
    if kind == "primitive":
        return _validate_primitive(value, walk, relative=relative)
    if kind == CONTAINER_KIND:
        return _validate_container(value, walk, relative=relative, depth=depth)
    message = "item.kind must be widget, primitive or container"
    raise DashboardValidationError(message)


def _name_items(items: list[dict[str, Any]], walk: _Walk) -> None:
    """Give every unnamed item `<type>_<n>`, numbering per type in document order."""
    counters: dict[str, int] = {}
    stack = list(reversed(items))
    while stack:
        item = stack.pop()
        item_type = item.pop("_type")
        if "name" not in item:
            number = counters.get(item_type, 0) + 1
            while f"{item_type}_{number}" in walk.used_names:
                number += 1
            counters[item_type] = number
            item["name"] = f"{item_type}_{number}"
            walk.used_names.add(item["name"])
        stack.extend(reversed(item.get("children", [])))


def validate_items(
    raw_items: object,
    registry: WidgetRegistry,
    primitives: PrimitiveRegistry,
    width: int,
    height: int,
) -> list[dict[str, Any]]:
    """Validate and normalize the whole item tree of a dashboard."""
    if not isinstance(raw_items, list):
        fail("items must be a list")
    walk = _Walk(registry, primitives, width, height)
    items = [_validate_item(raw, walk, relative=False, depth=1) for raw in raw_items]
    _name_items(items, walk)
    return items
