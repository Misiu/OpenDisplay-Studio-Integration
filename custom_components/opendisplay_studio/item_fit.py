"""
Bring elements within what a display accepts, without refusing them.

An imported design may come from a display of another size. Rather than refuse it,
each position is moved no farther out than a display allows (`validation.reach`) and
each size is cut down to the display, so the design arrives and the user can move
things where they want.
"""

from __future__ import annotations

from copy import deepcopy
from typing import Any, TypeGuard

from custom_components.opendisplay_studio.primitives import (
    PrimitiveRegistry,
    resolve_limit,
)
from custom_components.opendisplay_studio.validation import reach


def _is_number(value: object) -> TypeGuard[int]:
    return isinstance(value, int) and not isinstance(value, bool)


def _clamp(value: int, bounds: tuple[int, int]) -> int:
    return max(bounds[0], min(bounds[1], value))


def _fit_fields(
    fields: list[dict[str, Any]], values: dict[str, Any], width: int, height: int
) -> None:
    """Fit the coordinates, numbers and points of a primitive or a nested object."""
    for field in fields:
        key, shape, value = field["key"], field["shape"], values.get(field["key"])
        if shape == "coordinate" and _is_number(value):
            extent = width if field["axis"] == "x" else height
            values[key] = _clamp(value, reach(extent))
        elif shape == "number" and _is_number(value) and not field.get("decimal"):
            values[key] = _clamp(
                value,
                (
                    resolve_limit(field["min"], width, height),
                    resolve_limit(field["max"], width, height),
                ),
            )
        elif shape == "points" and isinstance(value, list):
            values[key] = [
                [_clamp(x, reach(width)), _clamp(y, reach(height))]
                for x, y in value
                if _is_number(x) and _is_number(y)
            ]
        elif shape == "object" and isinstance(value, dict):
            _fit_fields(field["nested"], value, width, height)
        elif shape == "objects" and isinstance(value, list):
            for entry in value:
                if isinstance(entry, dict):
                    _fit_fields(field["nested"], entry, width, height)


def _fit_box(box: dict[str, Any], width: int, height: int) -> None:
    """Fit the position and size of a widget frame or a container."""
    for key, extent in (("x", width), ("y", height)):
        if _is_number(box.get(key)):
            box[key] = _clamp(box[key], reach(extent))
    for key, extent in (("width", width), ("height", height)):
        if _is_number(box.get(key)):
            box[key] = _clamp(box[key], (1, extent))


def _fit(
    items: list[dict[str, Any]], width: int, height: int, primitives: PrimitiveRegistry
) -> None:
    for item in items:
        if item["kind"] == "primitive":
            if not primitives.field_keys(str(item["primitive"].get("type"))):
                continue  # the validator names the unknown type
            fields = primitives.definition(item["primitive"]["type"])["fields"]
            _fit_fields(fields, item["primitive"], width, height)
        elif item["kind"] == "widget":
            _fit_box(item["frame"], width, height)
        else:
            _fit_box(item, width, height)
            _fit(item.get("children", []), width, height, primitives)


def fit_items(
    items: list[dict[str, Any]],
    width: int,
    height: int,
    primitives: PrimitiveRegistry,
) -> list[dict[str, Any]]:
    """Return the elements with each position and size within what the display takes."""
    fitted = deepcopy(items)
    _fit(fitted, width, height, primitives)
    return fitted
