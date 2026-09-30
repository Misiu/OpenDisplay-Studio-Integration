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


def _selector_kind(selector: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    kind, config = next(iter(selector.items()))
    return kind, config if isinstance(config, dict) else {}


def _select_values(config: dict[str, Any]) -> list[str]:
    return [
        str(option["value"] if isinstance(option, dict) else option)
        for option in config.get("options", [])
    ]


def default_for(selector: dict[str, Any], declared: object = None) -> Any:
    """Return an option's default: the declared one, else a neutral value."""
    if declared is not None:
        return declared
    kind, config = _selector_kind(selector)
    if kind == "boolean":
        return False
    if kind == "number":
        return config.get("min", 0)
    if kind == "select":
        values = _select_values(config)
        return values[0] if values else ""
    if kind == "opendisplay_color":
        return "black"
    return ""


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


def _id_or_ids(value: object, name: str) -> str | list[str]:
    if isinstance(value, list):
        if len(value) > MAX_LIST_ITEMS:
            fail(f"{name} has too many entries")
        return [_text(entry, name) for entry in value]
    return _text(value, name)


def normalize_value(selector: dict[str, Any], value: object, name: str) -> Any:
    """Check one stored value against the selector that edits it."""
    kind, config = _selector_kind(selector)
    if kind == "boolean":
        if not isinstance(value, bool):
            fail(f"{name} must be true or false")
        return value
    if kind == "number":
        return _number(value, config, name)
    if kind == "select":
        if value not in _select_values(config):
            fail(f"{name} is not one of the allowed values")
        return value
    if kind == "opendisplay_color":
        if value not in COLORS:
            fail(f"{name} is not a supported palette color")
        return value
    if kind == "text":
        return _text(value, name, MAX_TEXT_LENGTH)
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
