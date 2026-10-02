"""
ODL primitive definitions: the single source of truth for every primitive.

Each `<type>.yml` next to this file declares one primitive: how it is offered in
the library, which fields it has, their shapes, limits and defaults. The panel
builds its controls and new-item defaults from these definitions, and
`PrimitiveRegistry.normalize` validates stored primitives from the same data.
"""

from __future__ import annotations

import json
import re
from collections.abc import Callable
from copy import deepcopy
from pathlib import Path
from typing import Any, Final, NoReturn

import yaml  # type: ignore[import-untyped]

from custom_components.opendisplay_studio.icons import ICON_NAMES, icon_name
from custom_components.opendisplay_studio.validation import (
    MAX_TEXT_LENGTH,
    boolean,
    color,
    decimal,
    fail,
    integer,
    reach,
    size_limit,
    string,
)

BUILTIN_PRIMITIVE_DIRECTORY: Final = Path(__file__).parent

SHAPES: Final = frozenset(
    {
        "number",
        "coordinate",
        "boolean",
        "enum",
        "flags",
        "color",
        "string",
        "entity",
        "text",
        "font",
        "icon",
        "image",
        "points",
        "icons",
        "object",
        "objects",
    }
)
SECTIONS: Final = frozenset({"layout", "appearance"})
GEOMETRIES: Final = frozenset(
    {"point", "box", "line", "radial", "points", "pattern", "image", "canvas"}
)
BOXED_GEOMETRIES: Final = frozenset({"box", "line"})
ENTITY_ID_PATTERN: Final = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
ENTITY_ID_LENGTH: Final = 255
FONT_PATTERN: Final = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 _.\-]{0,127}$")
MAX_POINTS: Final = 256
MAX_ICONS: Final = 64
MAX_SERIES: Final = 4
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


def _check_field(field: object, where: str, *, nested: bool = False) -> dict[str, Any]:
    if not isinstance(field, dict):
        _malformed(f"{where}: every field must be an object")
    key = _require_text(field, "key", where)
    where = f"{where}.{key}"
    _require_text(field, "label", where)
    shape = field.get("shape")
    if shape not in SHAPES:
        _malformed(f"{where}: unknown shape {shape!r}")
    if not nested and field.get("section") not in SECTIONS:
        _malformed(f"{where}: section must be layout or appearance")
    if not (
        field.get("required") is True
        or "default" in field
        or field.get("nullable") is True
        or field.get("optional") is True
    ):
        _malformed(f"{where}: needs required, a default, nullable or optional")
    if shape == "coordinate" and field.get("axis") not in {"x", "y"}:
        _malformed(f"{where}: a coordinate needs axis x or y")
    if shape == "number":
        _check_number_limits(field, where)
    if shape in {"enum", "flags"} and not (
        isinstance(field.get("options"), list) and field["options"]
    ):
        _malformed(f"{where}: {shape} needs options")
    if shape in {"object", "objects"}:
        children = field.get("nested")
        if not isinstance(children, list) or not children:
            _malformed(f"{where}: {shape} needs nested fields")
        for child in children:
            _check_field(child, where, nested=True)
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
    if raw["geometry"] in BOXED_GEOMETRIES and not isinstance(raw.get("extent"), dict):
        _malformed(f"{where}: box and line need an extent")
    return raw


class PrimitiveRegistry:
    """The loaded primitive definitions and the validator built on them."""

    def __init__(
        self,
        definitions: list[dict[str, Any]],
        translations: dict[str, dict[str, str]] | None = None,
    ) -> None:
        """Index already-checked definitions by type, in library order."""
        ordered = sorted(definitions, key=lambda definition: definition["order"])
        self._definitions = {definition["type"]: definition for definition in ordered}
        self._translations = translations or {}

    @classmethod
    def from_directory(cls, directory: Path) -> PrimitiveRegistry:
        """Load every `<type>.yml` in `directory`."""
        definitions = []
        for path in sorted(directory.glob("*.yml")):
            raw = yaml.safe_load(path.read_text(encoding="utf-8"))
            definitions.append(_check_definition(raw, path))
        translations = {
            path.stem: json.loads(path.read_text(encoding="utf-8"))
            for path in sorted((directory / "translations").glob("*.json"))
        }
        return cls(definitions, translations)

    def localized(self, language: str) -> list[dict[str, Any]]:
        """Return the definitions with names, descriptions and labels in `language`."""
        texts = self._translations.get(language.split("-", maxsplit=1)[0], {})
        result = self.definitions
        for definition in result:
            prefix = definition["type"]
            definition["name"] = texts.get(f"{prefix}.name", definition["name"])
            definition["description"] = texts.get(
                f"{prefix}.description", definition["description"]
            )
            for field in definition["fields"]:
                field["label"] = texts.get(f"{prefix}.{field['key']}", field["label"])
        return result

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

    def keys_of_shape(self, primitive_type: str, shape: str) -> frozenset[str]:
        """Return the keys of a type's fields of one shape; none for an unknown type."""
        definition = self._definitions.get(primitive_type)
        if definition is None:
            return frozenset()
        return frozenset(
            field["key"] for field in definition["fields"] if field["shape"] == shape
        )

    def coordinate_keys(self, primitive_type: str) -> frozenset[str]:
        """Return the keys of a type's position fields; none for an unknown type."""
        return self.keys_of_shape(primitive_type, "coordinate")

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
                field, primitive, (width, height), relative=relative
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
            display,
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
        display: tuple[int, int],
        *,
        relative: bool,
        prefix: str = "primitive",
    ) -> Any:
        key = field["key"]
        name = f"{prefix}.{key}"
        if key in primitive:
            value = primitive[key]
        elif field.get("required"):
            value = None
        else:
            value = field.get("default")
        if value is None and field.get("optional"):
            return None
        check = _CHECKS.get(field["shape"])
        if check is not None:
            return check(field, value, name, display, relative)
        if field["shape"] in {"object", "objects"}:
            return self._nested(field, value, name, display, relative=relative)
        return _normalize_text(field, value, name)

    def _nested(
        self,
        field: dict[str, Any],
        value: object,
        name: str,
        display: tuple[int, int],
        *,
        relative: bool,
    ) -> Any:
        """Validate an object, or a short list of objects, against nested fields."""
        if field["shape"] == "object":
            return self._nested_object(field, value, name, display, relative=relative)
        maximum = field.get("max", MAX_SERIES)
        minimum = field.get("min", 1)
        if not isinstance(value, list) or len(value) > maximum:
            fail(f"{name} must be a list of at most {maximum}")
        if len(value) < minimum:
            fail(f"{name} needs at least {minimum} entries")
        return [
            self._nested_object(
                field, entry, f"{name}[{index}]", display, relative=relative
            )
            for index, entry in enumerate(value)
        ]

    def _nested_object(
        self,
        field: dict[str, Any],
        value: object,
        name: str,
        display: tuple[int, int],
        *,
        relative: bool,
    ) -> dict[str, Any]:
        source = {} if value is None else value
        if not isinstance(source, dict):
            fail(f"{name} must be an object")
        known = {child["key"] for child in field["nested"]}
        for key in source:
            if key not in known:
                fail(f"{name}.{key} is not a field")
        return {
            child["key"]: self._normalize_field(
                child, source, display, relative=relative, prefix=name
            )
            for child in field["nested"]
        }

    def element(self, primitive: dict[str, Any]) -> dict[str, Any]:
        """Return the ODL element for a primitive: fields left unset are omitted."""
        definition = self._definitions[primitive["type"]]
        return _without_unset(definition["fields"], primitive)

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


type Check = Callable[
    [dict[str, Any], object, str, tuple[int, int], bool],
    Any,
]


def _check_number(
    field: dict[str, Any],
    value: object,
    name: str,
    display: tuple[int, int],
    _relative: bool,  # noqa: FBT001
) -> float:
    minimum = resolve_limit(field["min"], *display)
    maximum = resolve_limit(field["max"], *display)
    if field.get("decimal"):
        return decimal(value, name, minimum, maximum)
    return integer(value, name, minimum, maximum)


def _check_coordinate(
    field: dict[str, Any],
    value: object,
    name: str,
    display: tuple[int, int],
    relative: bool,  # noqa: FBT001
) -> int:
    extent = display[0] if field["axis"] == "x" else display[1]
    return _coordinate(value, name, extent)


def _check_enum(
    field: dict[str, Any],
    value: object,
    name: str,
    _display: tuple[int, int],
    _relative: bool,  # noqa: FBT001
) -> Any:
    if value not in field["options"]:
        fail(f"{name} is invalid")
    return value


def _check_color(
    field: dict[str, Any],
    value: object,
    name: str,
    _display: tuple[int, int],
    _relative: bool,  # noqa: FBT001
) -> str | None:
    return color(value, name, allow_none=bool(field.get("nullable")))


_CHECKS: dict[str, Check] = {
    "number": _check_number,
    "coordinate": _check_coordinate,
    "boolean": lambda _f, value, name, _d, _r: boolean(value, name),
    "enum": _check_enum,
    "color": _check_color,
    "flags": lambda field, value, name, _d, _r: _flags(value, field["options"], name),
    "font": lambda _f, value, name, _d, _r: _font(value, name),
    "icon": lambda _f, value, name, _d, _r: _icon(value, name),
    "points": lambda _f, value, name, display, relative: _points(
        value, name, display, relative=relative
    ),
    "icons": lambda _f, value, name, _d, _r: _icons(value, name),
    "entity": lambda _f, value, name, _d, _r: _entity_id(value, name),
}


def _without_unset(
    fields: list[dict[str, Any]], value: dict[str, Any]
) -> dict[str, Any]:
    """Copy `value` without the optional fields that were left unset, at any depth."""
    by_key = {field["key"]: field for field in fields}
    result: dict[str, Any] = {}
    for key, item in value.items():
        field = by_key.get(key)
        if field is None:
            result[key] = item
        elif item is None and field.get("optional"):
            continue
        elif field["shape"] == "object" and isinstance(item, dict):
            result[key] = _without_unset(field["nested"], item)
        elif field["shape"] == "objects" and isinstance(item, list):
            result[key] = [_without_unset(field["nested"], entry) for entry in item]
        else:
            result[key] = item
    return result


def _flags(value: object, options: list[str], name: str) -> str:
    """Return a comma-separated subset of `options`, in the options' order."""
    if not isinstance(value, str):
        fail(f"{name} must be text")
    chosen = {part.strip() for part in value.split(",") if part.strip()}
    if not chosen or not chosen <= set(options):
        fail(f"{name} must be a list of {', '.join(options)}")
    return ",".join(option for option in options if option in chosen)


def _entity_id(value: object, name: str) -> str:
    text = string(value, name, ENTITY_ID_LENGTH)
    if ENTITY_ID_PATTERN.fullmatch(text) is None:
        fail(f"{name} must be an entity id such as sensor.temperature")
    return text


def _font(value: object, name: str) -> str:
    if not isinstance(value, str) or FONT_PATTERN.fullmatch(value) is None:
        fail(f"{name} must be the name of a font file or family")
    return value


def _points(
    value: object, name: str, display: tuple[int, int], *, relative: bool
) -> list[list[int]]:
    """Return a list of at least three [x, y] pairs."""
    if not isinstance(value, list) or not 3 <= len(value) <= MAX_POINTS:
        fail(f"{name} must have between 3 and {MAX_POINTS} points")
    points: list[list[int]] = []
    for index, pair in enumerate(value):
        if not isinstance(pair, list | tuple) or len(pair) != 2:
            fail(f"{name}[{index}] must be a pair [x, y]")
        points.append(
            [
                _coordinate(pair[0], f"{name}[{index}].x", display[0]),
                _coordinate(pair[1], f"{name}[{index}].y", display[1]),
            ]
        )
    return points


def _icons(value: object, name: str) -> list[str]:
    """Return a list of one or more icon names."""
    if not isinstance(value, list) or not 1 <= len(value) <= MAX_ICONS:
        fail(f"{name} must have between 1 and {MAX_ICONS} icons")
    return [_icon(entry, f"{name}[{index}]") for index, entry in enumerate(value)]


def _icon(value: object, name: str) -> str:
    """Return an icon the renderer has; an unknown one would fail the whole picture."""
    icon = string(value, name, 128)
    if icon_name(icon) not in ICON_NAMES:
        fail(f"{name} is not an icon of the Material Design Icons")
    return icon


def _coordinate(value: object, name: str, extent: int) -> int:
    return integer(value, name, *reach(extent))


def resolve_limit(value: int | str, width: int, height: int) -> int:
    """Return a number limit, which may be taken from the size of the display."""
    if value == "display_width":
        return size_limit(width)
    if value == "display_height":
        return size_limit(height)
    if value == "display_shorter_side":
        return size_limit(min(width, height))
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
