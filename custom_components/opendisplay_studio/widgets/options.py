"""Validation of the sources and options a dashboard stores for a widget."""

from __future__ import annotations

from typing import Any, Final

from custom_components.opendisplay_studio.validation import (
    COLORS,
    MAX_TEXT_LENGTH,
    fail,
)

MAX_TEXT_OPTION: Final = 256
MAX_LIST_ITEMS: Final = 100
RANGES_SELECTOR: Final = "opendisplay_ranges"
MAX_RANGES: Final = 12


def _selector_kind(selector: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    kind, config = next(iter(selector.items()))
    return kind, config if isinstance(config, dict) else {}


def _select_values(config: dict[str, Any]) -> list[str]:
    return [
        str(option["value"] if isinstance(option, dict) else option)
        for option in config.get("options", [])
    ]


# What an option has when it declares nothing and no choice or limit tells otherwise.
_NEUTRAL: Final[dict[str, Any]] = {
    "boolean": False,
    RANGES_SELECTOR: [],
    "opendisplay_color": "black",
}


def default_for(selector: dict[str, Any], declared: object = None) -> Any:
    """Return an option's default: the declared one, else a neutral value."""
    if declared is not None:
        return declared
    kind, config = _selector_kind(selector)
    if kind == "number":
        return config.get("min", 0)
    if kind == "select":
        values = _select_values(config)
        return values[0] if values else ""
    return _NEUTRAL.get(kind, "")


def _number(value: object, config: dict[str, Any], name: str) -> int | float:
    if isinstance(value, bool) or not isinstance(value, int | float):
        fail(f"{name} must be a number")
    minimum = config.get("min")
    maximum = config.get("max")
    if (minimum is not None and value < minimum) or (
        maximum is not None and value > maximum
    ):
        fail(f"{name} must be between {minimum} and {maximum}")
    return value


def _text(value: object, name: str, maximum: int = MAX_TEXT_OPTION) -> str:
    if not isinstance(value, str) or len(value) > maximum:
        fail(f"{name} must be text of at most {maximum} characters")
    return value


def _ranges(value: object, config: dict[str, Any], name: str) -> list[dict[str, Any]]:
    """Check a list of colored ranges: where each starts, or None for the start."""
    most = int(config.get("max", MAX_RANGES))
    if not isinstance(value, list) or len(value) > most:
        fail(f"{name} must be a list of at most {most} ranges")
    ranges = []
    for index, entry in enumerate(value):
        where = f"{name}[{index}]"
        if not isinstance(entry, dict) or set(entry) - {"from", "color"}:
            fail(f"{where} must have a start (from) and a color")
        start = entry.get("from")
        if start is not None:
            start = _number(start, {}, f"{where}.from")
        color = entry.get("color")
        if color not in COLORS:
            fail(f"{where}.color is not a supported palette color")
        ranges.append({"from": start, "color": color})
    return ranges


def _id_or_ids(value: object, name: str) -> str | list[str]:
    if isinstance(value, list):
        if len(value) > MAX_LIST_ITEMS:
            fail(f"{name} has too many entries")
        return [_text(entry, name) for entry in value]
    return _text(value, name)


# Kinds whose value is checked above and kept as it is.
_CHECKED: Final = frozenset({"boolean", "select", "opendisplay_color"})


def normalize_value(selector: dict[str, Any], value: object, name: str) -> Any:
    """Check one stored value against the selector that edits it."""
    kind, config = _selector_kind(selector)
    if kind == "boolean" and not isinstance(value, bool):
        fail(f"{name} must be true or false")
    if kind == "select" and value not in _select_values(config):
        fail(f"{name} is not one of the allowed values")
    if kind == "opendisplay_color" and value not in COLORS:
        fail(f"{name} is not a supported palette color")
    if kind == "number":
        return _number(value, config, name)
    if kind == RANGES_SELECTOR:
        return _ranges(value, config, name)
    if kind == "text":
        return _text(value, name, MAX_TEXT_LENGTH)
    if kind in _CHECKED:
        return value
    return _id_or_ids(value, name)


def option_fields(definition: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Return every option field of a widget by key."""
    return {
        field["key"]: field
        for section in definition["options"]
        for field in section["fields"]
    }


def option_defaults(definition: dict[str, Any]) -> dict[str, Any]:
    """Return the value every option has on a new widget."""
    return {
        key: default_for(field["selector"], field.get("default"))
        for key, field in option_fields(definition).items()
    }


def normalize_options(definition: dict[str, Any], raw: object) -> dict[str, Any]:
    """Validate stored options; missing ones take their default."""
    if not isinstance(raw, dict):
        fail("widget.options must be an object")
    fields = option_fields(definition)
    for key in raw:
        if key not in fields:
            fail(f"widget.options.{key} is not an option of {definition['id']}")
    merged = {**option_defaults(definition), **raw}
    return {
        key: normalize_value(field["selector"], merged[key], f"widget.options.{key}")
        for key, field in fields.items()
    }


def _normalize_pick(source: dict[str, Any], pick: object, name: str) -> dict[str, Any]:
    if not isinstance(pick, dict):
        fail(f"{name} must be an object")
    extras = {field["key"]: field for field in source["perSource"]}
    for key in pick:
        if key != "id" and key not in extras:
            fail(f"{name}.{key} is not a field of {source['key']}")
    normalized: dict[str, Any] = {"id": _text(pick.get("id"), f"{name}.id", 255)}
    if not normalized["id"]:
        fail(f"{name}.id must not be empty")
    for key, field in extras.items():
        if key in pick:
            normalized[key] = normalize_value(
                field["selector"], pick[key], f"{name}.{key}"
            )
    return normalized


def normalize_sources(
    definition: dict[str, Any], raw: object
) -> dict[str, list[dict[str, Any]]]:
    """Validate the picks stored for each source; a missing source has none."""
    if not isinstance(raw, dict):
        fail("widget.sources must be an object")
    known = {source["key"]: source for source in definition["sources"]}
    for key in raw:
        if key not in known:
            fail(f"widget.sources.{key} is not a source of {definition['id']}")
    result: dict[str, list[dict[str, Any]]] = {}
    for key, source in known.items():
        picks = raw.get(key, [])
        name = f"widget.sources.{key}"
        if not isinstance(picks, list) or len(picks) > source["max"]:
            fail(f"{name} must be a list of at most {source['max']} items")
        result[key] = [
            _normalize_pick(source, pick, f"{name}[{index}]")
            for index, pick in enumerate(picks)
        ]
    return result
