"""Resolve the Home Assistant templates an item keeps beside its literal fields."""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.template import Template

from .primitives import DEFAULT_PRIMITIVES, PrimitiveRegistry
from .validation import DashboardValidationError

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

VISIBLE = "visible"
_NUMERIC_SHAPES = frozenset({"number", "coordinate"})
_TEXT_SHAPES = frozenset({"string", "text", "font", "flags"})


@dataclass(slots=True)
class Resolution:
    """The item tree with its templates applied, and what they depend on."""

    items: list[dict[str, Any]]
    warnings: list[str] = field(default_factory=list)
    entities: set[str] = field(default_factory=set)
    domains: set[str] = field(default_factory=set)
    all_states: bool = False
    uses_time: bool = False


class _Failed(Exception):  # noqa: N818
    """One expression did not produce a usable value."""


def _coerce(shape: str, value: object) -> object:
    """Bring a rendered value to what its field's shape accepts."""
    if shape in _NUMERIC_SHAPES and isinstance(value, float):
        return round(value)
    if shape in _TEXT_SHAPES and isinstance(value, int | float):
        return str(value)
    return value


class _Resolver:
    def __init__(
        self,
        hass: HomeAssistant,
        primitives: PrimitiveRegistry,
        width: int,
        height: int,
    ) -> None:
        self._hass = hass
        self._primitives = primitives
        self._width = width
        self._height = height
        self.resolution = Resolution(items=[])

    def resolve(self, items: list[dict[str, Any]], *, relative: bool) -> list[Any]:
        return [self._resolve_item(item, relative=relative) for item in items]

    def _render(self, template: str) -> object:
        info = Template(template, self._hass).async_render_to_info(parse_result=True)
        resolution = self.resolution
        resolution.entities |= set(info.entities)
        resolution.domains |= set(info.domains)
        resolution.all_states = resolution.all_states or info.all_states
        resolution.uses_time = resolution.uses_time or info.has_time
        if info.exception is not None:
            message = str(info.exception).strip().splitlines()[0]
            raise _Failed(message)
        return info.result()

    def _warn(self, item: dict[str, Any], key: str, message: str) -> None:
        self.resolution.warnings.append(f"{item['name']}.{key}: {message}")

    def _resolve_item(self, item: dict[str, Any], *, relative: bool) -> dict[str, Any]:
        resolved = deepcopy(item)
        expressions: dict[str, str] = resolved.pop("expressions", {})
        if VISIBLE in expressions:
            self._resolve_visible(resolved, expressions[VISIBLE])
        if resolved["hidden"]:
            return resolved
        if resolved["kind"] == "container":
            resolved["children"] = self.resolve(resolved["children"], relative=True)
        elif resolved["kind"] == "primitive":
            self._resolve_fields(resolved, expressions, relative=relative)
        return resolved

    def _resolve_visible(self, item: dict[str, Any], template: str) -> None:
        try:
            value = self._render(template)
        except _Failed as err:
            self._warn(item, VISIBLE, str(err))
            item["hidden"] = True
            return
        if not isinstance(value, bool):
            self._warn(item, VISIBLE, f"must be true or false, not {value!r}")
            item["hidden"] = True
            return
        item["hidden"] = item["hidden"] or not value

    def _resolve_fields(
        self, item: dict[str, Any], expressions: dict[str, str], *, relative: bool
    ) -> None:
        primitive = item["primitive"]
        failed = False
        for key, template in expressions.items():
            if key == VISIBLE:
                continue
            try:
                primitive[key] = self._field_value(
                    primitive["type"], key, template, relative=relative
                )
            except _Failed as err:
                self._warn(item, key, str(err))
                failed = True
        if not failed:
            failed = not self._geometry_holds(item)
        if failed:
            item["hidden"] = True

    def _field_value(
        self, primitive_type: str, key: str, template: str, *, relative: bool
    ) -> object:
        value = self._render(template)
        shape = self._primitives.field(primitive_type, key)["shape"]
        try:
            return self._primitives.normalize_field(
                primitive_type,
                key,
                _coerce(shape, value),
                (self._width, self._height),
                relative=relative,
            )
        except DashboardValidationError as err:
            message = f"{err} (got {value!r})"
            raise _Failed(message) from err

    def _geometry_holds(self, item: dict[str, Any]) -> bool:
        try:
            self._primitives.check_geometry(item["primitive"])
        except DashboardValidationError as err:
            self._warn(item, "geometry", str(err))
            return False
        return True


def has_expressions(items: list[dict[str, Any]]) -> bool:
    """Return whether any item in the tree keeps a template."""
    return any(
        item.get("expressions") or has_expressions(item.get("children", []))
        for item in items
    )


async def async_resolve_expressions(
    hass: HomeAssistant,
    items: list[dict[str, Any]],
    width: int,
    height: int,
    primitives: PrimitiveRegistry = DEFAULT_PRIMITIVES,
) -> Resolution:
    """
    Return the tree with every template replaced by its value.

    An item whose template fails is hidden, so nothing is drawn for it, and a
    warning names the item, the field and the reason. A hidden container is not
    resolved further: its `visible` template is evaluated once for the subtree.
    """
    resolver = _Resolver(hass, primitives, width, height)
    resolver.resolution.items = resolver.resolve(items, relative=False)
    return resolver.resolution
