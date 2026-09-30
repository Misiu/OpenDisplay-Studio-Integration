"""The `widget.yml` manifest of a widget package (widget API v1)."""

from __future__ import annotations

import re
from collections.abc import Callable
from typing import Any, Final

import voluptuous as vol

WIDGET_API: Final = 1
WIDGET_ID_PATTERN: Final = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VERSION_PATTERN: Final = re.compile(r"^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$")
KEY_PATTERN: Final = re.compile(r"^[A-Za-z][A-Za-z0-9_]*$")
DEFAULT_CATEGORY: Final = "General"
OPTION_REFERENCE_PREFIX: Final = "@options."


class ManifestError(ValueError):
    """A `widget.yml` does not follow the widget API."""


def _selector(value: object) -> dict[str, Any]:
    if not isinstance(value, dict) or len(value) != 1:
        message = "must hold exactly one Home Assistant selector"
        raise vol.Invalid(message)
    return value


def _key(value: object) -> str:
    if not isinstance(value, str) or KEY_PATTERN.fullmatch(value) is None:
        message = "must be a name of letters, digits and underscores"
        raise vol.Invalid(message)
    return value


def _pattern(pattern: re.Pattern[str], message: str) -> Callable[[object], str]:
    def check(value: object) -> str:
        if not isinstance(value, str) or pattern.fullmatch(value) is None:
            raise vol.Invalid(message)
        return value

    return check


def _api(value: object) -> int:
    if value != WIDGET_API:
        message = f"unsupported widget API {value!r}; this version reads {WIDGET_API}"
        raise vol.Invalid(message)
    return WIDGET_API


SIZE_SCHEMA: Final = vol.Schema(
    {
        vol.Required("width"): vol.All(int, vol.Range(min=1, max=4096)),
        vol.Required("height"): vol.All(int, vol.Range(min=1, max=4096)),
    }
)

FIELD_SCHEMA: Final[dict[Any, Any]] = {
    vol.Required("key"): _key,
    vol.Required("label"): vol.All(str, vol.Length(min=1)),
    vol.Required("selector"): _selector,
}

SOURCE_SCHEMA: Final = vol.Schema(
    {
        **FIELD_SCHEMA,
        vol.Optional("required", default=False): bool,
        vol.Optional("max", default=10): vol.All(int, vol.Range(min=1, max=100)),
        vol.Optional("data"): vol.All(str, vol.Length(min=1)),
        vol.Optional("perSource", default=list): [FIELD_SCHEMA],
    }
)

OPTION_SCHEMA: Final = vol.Schema({**FIELD_SCHEMA, vol.Optional("default"): object})

SECTION_SCHEMA: Final = vol.Schema(
    {
        vol.Required("section"): vol.All(str, vol.Length(min=1)),
        vol.Required("fields"): [OPTION_SCHEMA],
    }
)

DATA_SCHEMA: Final[dict[Any, Any]] = {str: {str: object}}

MANIFEST_SCHEMA: Final = vol.Schema(
    {
        vol.Required("api"): _api,
        vol.Required("id"): _pattern(WIDGET_ID_PATTERN, "must be kebab-case"),
        vol.Required("name"): vol.All(str, vol.Length(min=1)),
        vol.Required("version"): _pattern(
            VERSION_PATTERN, "must be a semantic version"
        ),
        vol.Required("description"): vol.All(str, vol.Length(min=1)),
        vol.Required("icon"): vol.All(str, vol.Length(min=1)),
        vol.Optional("category", default=DEFAULT_CATEGORY): vol.All(
            str, vol.Length(min=1)
        ),
        vol.Optional("author", default=""): str,
        vol.Required("layout"): vol.Schema(
            {
                vol.Required("defaultSize"): SIZE_SCHEMA,
                vol.Required("minSize"): SIZE_SCHEMA,
            }
        ),
        vol.Optional("sources", default=list): [SOURCE_SCHEMA],
        vol.Optional("options", default=list): [SECTION_SCHEMA],
        vol.Optional("data", default=dict): DATA_SCHEMA,
        vol.Optional("renderer", default="renderer.py"): str,
        vol.Optional("provider"): str,
    }
)


def _path(error: vol.Invalid) -> str:
    parts: list[str] = []
    for step in error.path:
        if isinstance(step, int):
            parts[-1:] = [f"{parts[-1]}[{step}]"] if parts else [f"[{step}]"]
        else:
            parts.append(str(step))
    return ".".join(parts)


def parse_manifest(raw: object, folder: str) -> dict[str, Any]:
    """Validate a parsed `widget.yml`; errors name the file and the field."""
    if not isinstance(raw, dict):
        message = f"{folder}/widget.yml: must contain an object"
        raise ManifestError(message)
    try:
        manifest: dict[str, Any] = MANIFEST_SCHEMA(raw)
    except vol.MultipleInvalid as err:
        first = err.errors[0]
        message = f"{folder}/widget.yml: {_path(first) or 'manifest'}: {first.msg}"
        raise ManifestError(message) from err
    _check_references(manifest, folder)
    return manifest


def _check_references(manifest: dict[str, Any], folder: str) -> None:
    """Reject duplicate keys and references to options that do not exist."""
    option_keys = [
        field["key"] for section in manifest["options"] for field in section["fields"]
    ]
    source_keys = [source["key"] for source in manifest["sources"]]
    for label, keys in (("options", option_keys), ("sources", source_keys)):
        duplicated = {key for key in keys if keys.count(key) > 1}
        if duplicated:
            message = (
                f"{folder}/widget.yml: {label}: duplicate key {sorted(duplicated)[0]}"
            )
            raise ManifestError(message)
    for provider, params in manifest["data"].items():
        for name, value in params.items():
            if not isinstance(value, str) or not value.startswith(
                OPTION_REFERENCE_PREFIX
            ):
                continue
            if value.removeprefix(OPTION_REFERENCE_PREFIX) not in option_keys:
                message = (
                    f"{folder}/widget.yml: data.{provider}.{name}: "
                    f"unknown option {value}"
                )
                raise ManifestError(message)
