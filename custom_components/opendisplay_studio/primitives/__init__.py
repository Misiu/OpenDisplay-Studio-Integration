"""
ODL primitive definitions: the single source of truth for every primitive.

Each `<type>.yml` next to this file declares one primitive: how it is offered in
the library, which fields it has, their shapes, limits and defaults. The panel
builds its controls and new-item defaults from these definitions, and
`PrimitiveRegistry.normalize` validates stored primitives from the same data.
"""

from __future__ import annotations

from copy import deepcopy
from pathlib import Path
from typing import Any, Final, NoReturn

import yaml  # type: ignore[import-untyped]

from custom_components.opendisplay_studio.validation import (
    MAX_TEXT_LENGTH,
    boolean,
    color,
    fail,
    integer,
    string,
)

BUILTIN_PRIMITIVE_DIRECTORY: Final = Path(__file__).parent

SHAPES: Final = frozenset(
    {"number", "coordinate", "boolean", "enum", "color", "string", "text"}
)
SECTIONS: Final = frozenset({"layout", "appearance"})
GEOMETRIES: Final = frozenset({"point", "box", "line"})
DISPLAY_LIMITS: Final = frozenset(
    {"display_width", "display_height", "display_shorter_side"}
)
DEFAULT_STRING_LENGTH: Final = 128
HEADER_TEXT_FIELDS: Final = ("name", "description", "icon", "category")


class PrimitiveDefinitionError(ValueError):
    """A primitive definition file is malformed."""


def _malformed(message: str) -> NoReturn:
    raise PrimitiveDefinitionError(message)


def _require_text(raw: dict[str, Any], key: str, where: str) -> str:
    value = raw.get(key)
    if not isinstance(value, str) or not value:
        _malformed(f"{where} requires a {key}")
    return value


def _check_field(field: object, where: str) -> dict[str, Any]:
    if not isinstance(field, dict):
        _malformed(f"{where}: every field must be an object")
    key = _require_text(field, "key", where)
    where = f"{where}.{key}"
    _require_text(field, "label", where)
    shape = field.get("shape")
    if shape not in SHAPES:
        _malformed(f"{where}: unknown shape {shape!r}")
    if field.get("section") not in SECTIONS:
        _malformed(f"{where}: section must be layout or appearance")
    if not (
        field.get("required") is True
        or "default" in field
        or field.get("nullable") is True
    ):
        _malformed(f"{where}: needs required, a default, or nullable")
    if shape == "coordinate" and field.get("axis") not in {"x", "y"}:
        _malformed(f"{where}: a coordinate needs axis x or y")
    if shape == "number":
        _check_number_limits(field, where)
    if shape == "enum" and not (
        isinstance(field.get("options"), list) and field["options"]
    ):
        _malformed(f"{where}: an enum needs options")
    return field


def _check_number_limits(field: dict[str, Any], where: str) -> None:
    for limit in ("min", "max"):
        value = field.get(limit)
        valid = isinstance(value, int) and not isinstance(value, bool)
        if not valid and value not in DISPLAY_LIMITS:
            _malformed(f"{where}: number needs an integer {limit}")


def _check_definition(raw: object, path: Path) -> dict[str, Any]:
    if not isinstance(raw, dict):
        _malformed(f"{path.name} must contain an object")
    where = path.name
    if raw.get("type") != path.stem:
        _malformed(f"{where}: type does not match the file name")
    for key in HEADER_TEXT_FIELDS:
        _require_text(raw, key, where)
    if not isinstance(raw.get("order"), int):
        _malformed(f"{where} requires an integer order")
    if raw.get("geometry") not in GEOMETRIES:
        _malformed(f"{where}: unknown geometry {raw.get('geometry')!r}")
    fields = raw.get("fields")
    if not isinstance(fields, list) or not fields:
        _malformed(f"{where} requires fields")
    keys = [_check_field(field, where)["key"] for field in fields]
    if len(keys) != len(set(keys)):
        _malformed(f"{where}: field keys must be unique")
    if raw["geometry"] != "point" and not isinstance(raw.get("extent"), dict):
        _malformed(f"{where}: box and line need an extent")
    return raw


class PrimitiveRegistry:
    """The loaded primitive definitions and the validator built on them."""

    def __init__(self, definitions: list[dict[str, Any]]) -> None:
        """Index already-checked definitions by type, in library order."""
        ordered = sorted(definitions, key=lambda definition: definition["order"])
        self._definitions = {definition["type"]: definition for definition in ordered}

    @classmethod
    def from_directory(cls, directory: Path) -> PrimitiveRegistry:
        """Load every `<type>.yml` in `directory`."""
        definitions = []
        for path in sorted(directory.glob("*.yml")):
            raw = yaml.safe_load(path.read_text(encoding="utf-8"))
            definitions.append(_check_definition(raw, path))
        return cls(definitions)

    @property
    def definitions(self) -> list[dict[str, Any]]:
        """Every definition in library order, as JSON-serializable copies."""
        return deepcopy(list(self._definitions.values()))

    def definition(self, primitive_type: str) -> dict[str, Any]:
        """One definition; raises `KeyError` for an unknown type."""
        return deepcopy(self._definitions[primitive_type])

    def field_keys(self, primitive_type: str) -> frozenset[str]:
        """Return the keys of the fields a type defines; none for an unknown type."""
        definition = self._definitions.get(primitive_type)
        if definition is None:
            return frozenset()
        return frozenset(field["key"] for field in definition["fields"])

    def coordinate_keys(self, primitive_type: str) -> frozenset[str]:
        """Return the keys of a type's position fields; none for an unknown type."""
        definition = self._definitions.get(primitive_type)
        if definition is None:
            return frozenset()
        return frozenset(
            field["key"]
            for field in definition["fields"]
            if field["shape"] == "coordinate"
        )

    def normalize(
        self,
        primitive: dict[str, Any],
        width: int,
        height: int,
        *,
        relative: bool = False,
        expressed: frozenset[str] = frozenset(),
    ) -> dict[str, Any]:
        """
        Validate one primitive against its definition for a display size.

        Inside a container coordinates are relative to it, so they may lie outside
        the display (`relative`). Fields driven by an expression (`expressed`) keep
        their literal, but the checks that compare fields with each other are skipped.
        """
        primitive_type = primitive.get("type")
        if (
            not isinstance(primitive_type, str)
            or primitive_type not in self._definitions
        ):
            fail(f"Unsupported primitive type: {primitive_type}")
        definition = self._definitions[primitive_type]
        normalized: dict[str, Any] = {"type": primitive_type}
        for field in definition["fields"]:
            normalized[field["key"]] = self._normalize_field(
                field, primitive, width, height, relative=relative
            )
        if not expressed & self.coordinate_keys(primitive_type):
            self.check_geometry(normalized)
        return normalized

    def normalize_field(
        self,
        primitive_type: str,
        key: str,
        value: object,
        display: tuple[int, int],
        *,
        relative: bool = False,
    ) -> Any:
        """
        Validate one value for one field of a primitive type on a display.

        Used for values that arrive after the dashboard was stored, such as the
        result of an expression. Raises `KeyError` for an unknown type or field.
        """
        return self._normalize_field(
            self.field(primitive_type, key),
            {key: value},
            *display,
            relative=relative,
        )

    def field(self, primitive_type: str, key: str) -> dict[str, Any]:
        """One field definition; raises `KeyError` for an unknown type or field."""
        for field in self._definitions[primitive_type]["fields"]:
            if field["key"] == key:
                return deepcopy(field)
        raise KeyError(key)

    def _normalize_field(
        self,
        field: dict[str, Any],
        primitive: dict[str, Any],
        width: int,
        height: int,
        *,
        relative: bool,
    ) -> Any:
        key = field["key"]
        name = f"primitive.{key}"
        if key in primitive:
            value = primitive[key]
        elif field.get("required"):
            value = None
        else:
            value = field.get("default")
        shape = field["shape"]
        if shape == "number":
            return integer(
                value,
                name,
                _limit(field["min"], width, height),
                _limit(field["max"], width, height),
            )
        if shape == "coordinate":
            extent = width if field["axis"] == "x" else height
            return _coordinate(value, name, extent, relative=relative)
        if shape == "boolean":
            return boolean(value, name)
        if shape == "enum":
            if value not in field["options"]:
                fail(f"{name} is invalid")
            return value
        if shape == "color":
            return color(value, name, allow_none=bool(field.get("nullable")))
        return _normalize_text(field, value, name)

    def check_geometry(self, value: dict[str, Any]) -> None:
        """Reject a box or line whose fields, taken together, draw nothing."""
        primitive_type = value["type"]
        geometry = self._definitions[primitive_type]["geometry"]
        if geometry == "box" and (
            value["x_end"] <= value["x_start"] or value["y_end"] <= value["y_start"]
        ):
            fail(f"{primitive_type} must have positive width and height")
        if (
            geometry == "line"
            and value["x_start"] == value["x_end"]
            and value["y_start"] == value["y_end"]
        ):
            fail("line must have two distinct points")


def _coordinate(value: object, name: str, extent: int, *, relative: bool) -> int:
    if relative:
        return integer(value, name, -extent, extent)
    return integer(value, name, 0, extent - 1)


def _limit(value: int | str, width: int, height: int) -> int:
    if value == "display_width":
        return width
    if value == "display_height":
        return height
    if value == "display_shorter_side":
        return min(width, height)
    return int(value)


def _normalize_text(field: dict[str, Any], value: object, name: str) -> str:
    default_length = (
        DEFAULT_STRING_LENGTH if field["shape"] == "string" else MAX_TEXT_LENGTH
    )
    text = string(value, name, field.get("maxLength", default_length))
    max_bytes = field.get("maxBytes")
    if max_bytes is not None and len(text.encode()) > max_bytes:
        fail(f"{name} must be at most {max_bytes} bytes")
    return text


DEFAULT_PRIMITIVES: Final = PrimitiveRegistry.from_directory(
    BUILTIN_PRIMITIVE_DIRECTORY
)
