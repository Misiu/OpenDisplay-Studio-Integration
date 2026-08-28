"""Persistent screen project model for OpenDisplay Studio."""

from __future__ import annotations

import asyncio
import re
from collections.abc import Iterable
from copy import deepcopy
from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .widgets import DEFAULT_REGISTRY, WidgetRegistry

type Project = dict[str, Any]

MAX_PROJECTS = 100
MAX_REGIONS = 256
MAX_NAME_LENGTH = 100
MAX_TEXT_LENGTH = 4_096
PALETTES = {"bw", "gray4", "gray16", "bwr", "bwy", "bwry", "spectra6"}
DISPLAY_THEMES = {"light", "dark"}
FONT_FAMILIES = {"default", "classic", "trmnl"}
TEXT_SCALES = {"small", "regular", "large", "xlarge"}
BACKGROUND_MODES = {"stretch", "contain", "cover", "manual"}
BACKGROUND_ANCHORS = {
    "top-left",
    "top-center",
    "top-right",
    "center-left",
    "center",
    "center-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
}
LANGUAGE_PATTERN = re.compile(r"^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$")
WIDGET_VERSION_PATTERN = re.compile(
    r"^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$"
)


class ProjectValidationError(ValueError):
    """A project submitted by the frontend is invalid."""


def _invalid(message: str) -> ProjectValidationError:
    return ProjectValidationError(message)


def _integer(value: object, name: str, minimum: int, maximum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        message = f"{name} must be an integer"
        raise _invalid(message)
    if not minimum <= value <= maximum:
        message = f"{name} must be between {minimum} and {maximum}"
        raise _invalid(message)
    return value


def _string(value: object, name: str, maximum: int = MAX_TEXT_LENGTH) -> str:
    if not isinstance(value, str):
        message = f"{name} must be a string"
        raise _invalid(message)
    result = value.strip()
    if not result or len(result) > maximum:
        message = f"{name} must contain 1-{maximum} characters"
        raise _invalid(message)
    return result


def _widget_version(value: object) -> str:
    """Validate one semantic widget version."""
    if isinstance(value, str) and WIDGET_VERSION_PATTERN.fullmatch(value):
        return value
    raise ProjectValidationError("widget.version must be a semantic version")


def _validate_background(value: object) -> dict[str, Any] | None:
    """Validate a display background selected through Home Assistant media."""
    if value is None:
        return None
    if not isinstance(value, dict):
        raise ProjectValidationError("background must be an object")
    media = value.get("media")
    if not isinstance(media, dict):
        raise ProjectValidationError("background.media must be an object")
    media_content_id = _string(
        media.get("media_content_id"), "background.media.media_content_id"
    )
    media_content_type = _string(
        media.get("media_content_type"), "background.media.media_content_type", 100
    ).lower()
    if not media_content_type.startswith("image/"):
        raise ProjectValidationError("background media must be an image")
    mode = value.get("mode", "contain")
    if mode not in BACKGROUND_MODES:
        raise ProjectValidationError("background.mode is invalid")
    anchor = value.get("anchor", "center")
    if anchor not in BACKGROUND_ANCHORS:
        raise ProjectValidationError("background.anchor is invalid")
    scale = _integer(value.get("scale", 100), "background.scale", 1, 400)
    return {
        "media": {
            "media_content_id": media_content_id,
            "media_content_type": media_content_type,
        },
        "mode": mode,
        "anchor": anchor,
        "scale": scale,
    }


def _validate_widget(value: object, registry: WidgetRegistry) -> dict[str, Any] | None:
    if value is None:
        return None
    if not isinstance(value, dict):
        raise ProjectValidationError("widget must be an object")
    widget_type = _string(value.get("type"), "widget.type", 50)
    if widget_type not in registry.widget_types:
        message = f"Unsupported widget type: {widget_type}"
        raise _invalid(message)
    config = value.get("config", {})
    if not isinstance(config, dict):
        raise ProjectValidationError("widget.config must be an object")
    widget_definition = registry.definition(widget_type)
    allowed_keys = set(widget_definition["defaults"])
    allowed_keys.update(
        field["key"]
        for field in widget_definition["fields"]
        if isinstance(field.get("key"), str)
    )
    unknown_keys = set(config) - allowed_keys
    if unknown_keys:
        message = (
            f"{widget_type} widget has unknown configuration: "
            f"{', '.join(sorted(str(key) for key in unknown_keys))}"
        )
        raise ProjectValidationError(message)
    merged_config = {**widget_definition["defaults"], **config}
    normalized_config: dict[str, str | int | float | bool | list[str]] = {}
    for key, item in merged_config.items():
        if not isinstance(key, str) or not key or len(key) > 64:
            raise ProjectValidationError("widget configuration key is invalid")
        scalar = isinstance(item, str | int | float | bool) and not isinstance(
            item, complex
        )
        string_list = isinstance(item, list) and all(
            isinstance(value, str) and len(value) <= MAX_TEXT_LENGTH for value in item
        )
        if not scalar and not string_list:
            message = f"widget configuration '{key}' is invalid"
            raise _invalid(message)
        if isinstance(item, str) and len(item) > MAX_TEXT_LENGTH:
            message = f"widget configuration '{key}' is too long"
            raise _invalid(message)
        if isinstance(item, list):
            normalized_config[key] = [str(value) for value in item]
        else:
            normalized_config[key] = item
    for field in widget_definition["fields"]:
        key = field.get("key")
        if not isinstance(key, str) or key not in normalized_config:
            continue
        item = normalized_config[key]
        field_type = field.get("type")
        selector = field.get("selector")
        if field_type == "toggle" or (
            isinstance(selector, dict) and "boolean" in selector
        ):
            normalized_config[key] = bool(item)
        elif field_type == "number":
            if isinstance(item, bool) or not isinstance(item, int | float):
                message = f"{widget_type} {key} must be numeric"
                raise ProjectValidationError(message)
            minimum = field.get("min")
            maximum = field.get("max")
            if isinstance(minimum, int | float) and item < minimum:
                message = f"{widget_type} {key} is too small"
                raise ProjectValidationError(message)
            if isinstance(maximum, int | float) and item > maximum:
                message = f"{widget_type} {key} is too large"
                raise ProjectValidationError(message)
        elif field_type == "select":
            allowed = {
                option.get("value")
                for option in field.get("options", [])
                if isinstance(option, dict)
            }
            if item not in allowed:
                normalized_config[key] = widget_definition["defaults"].get(key, "")
    return {
        "type": widget_type,
        "version": _widget_version(value.get("version", widget_definition["version"])),
        "config": normalized_config,
    }


def validate_project(value: object, registry: WidgetRegistry | None = None) -> Project:
    """Validate and normalize a complete project payload."""
    registry = registry or DEFAULT_REGISTRY
    if not isinstance(value, dict):
        raise ProjectValidationError("project must be an object")
    name = _string(value.get("name"), "name", MAX_NAME_LENGTH)
    width = _integer(value.get("width"), "width", 64, 4_096)
    height = _integer(value.get("height"), "height", 64, 4_096)
    orientation = value.get("orientation", "landscape")
    if orientation not in {"landscape", "portrait"}:
        raise ProjectValidationError("orientation is invalid")
    palette = value.get("palette", "bw")
    if palette not in PALETTES:
        raise ProjectValidationError("palette is invalid")
    status = value.get("status", "draft")
    if status not in {"draft", "ready"}:
        raise ProjectValidationError("status is invalid")
    language = value.get("language", "system")
    if not isinstance(language, str) or (
        language != "system" and LANGUAGE_PATTERN.fullmatch(language) is None
    ):
        raise ProjectValidationError("language is invalid")
    theme = value.get("theme", "light")
    if theme not in DISPLAY_THEMES:
        raise ProjectValidationError("theme is invalid")
    font_family = value.get("fontFamily", "default")
    if font_family not in FONT_FAMILIES:
        raise ProjectValidationError("fontFamily is invalid")
    text_scale = value.get("textScale", "regular")
    if text_scale not in TEXT_SCALES:
        raise ProjectValidationError("textScale is invalid")
    background = _validate_background(value.get("background"))
    grid = value.get("grid")
    if not isinstance(grid, dict):
        raise ProjectValidationError("grid must be an object")
    columns = _integer(grid.get("columns"), "grid.columns", 1, 24)
    rows = _integer(grid.get("rows"), "grid.rows", 1, 24)
    regions = value.get("regions", [])
    if not isinstance(regions, list) or len(regions) > MAX_REGIONS:
        message = f"regions must contain at most {MAX_REGIONS} items"
        raise _invalid(message)

    normalized_regions: list[dict[str, Any]] = []
    occupied: set[tuple[int, int]] = set()
    region_ids: set[str] = set()
    for region in regions:
        if not isinstance(region, dict):
            raise ProjectValidationError("region must be an object")
        region_id = _string(region.get("id"), "region.id", 64)
        if region_id in region_ids:
            raise ProjectValidationError("region IDs must be unique")
        region_ids.add(region_id)
        row = _integer(region.get("row"), "region.row", 1, rows)
        column = _integer(region.get("column"), "region.column", 1, columns)
        row_span = _integer(region.get("rowSpan"), "region.rowSpan", 1, rows)
        column_span = _integer(
            region.get("columnSpan"), "region.columnSpan", 1, columns
        )
        if row + row_span - 1 > rows or column + column_span - 1 > columns:
            raise ProjectValidationError("region extends beyond the logical grid")
        cells = {
            (cell_row, cell_column)
            for cell_row in range(row, row + row_span)
            for cell_column in range(column, column + column_span)
        }
        if occupied & cells:
            raise ProjectValidationError("regions cannot overlap")
        occupied |= cells
        normalized_region: dict[str, Any] = {
            "id": region_id,
            "row": row,
            "column": column,
            "rowSpan": row_span,
            "columnSpan": column_span,
        }
        label = region.get("label")
        if isinstance(label, str) and label.strip():
            normalized_region["label"] = label.strip()[:MAX_NAME_LENGTH]
        widget = _validate_widget(region.get("widget"), registry)
        if widget is not None:
            normalized_region["widget"] = widget
        normalized_regions.append(normalized_region)

    if status == "ready":
        for region in normalized_regions:
            widget = region.get("widget")
            if widget is None:
                continue
            widget_definition = registry.definition(widget["type"])
            config = widget["config"]
            for requirement in widget_definition["dataRequirements"]:
                if requirement.get("optional"):
                    continue
                config_key = requirement.get("configKey")
                field: dict[str, Any] = next(
                    (
                        item
                        for item in widget_definition["fields"]
                        if item.get("key") == config_key
                    ),
                    {},
                )
                label = str(field.get("label", config_key or "data source")).lower()
                source_value = (
                    config.get(config_key) if isinstance(config_key, str) else None
                )
                sources = (
                    source_value
                    if isinstance(source_value, list)
                    else [source_value]
                    if source_value
                    else []
                )
                expected_domain = (
                    "calendar" if field.get("type") == "calendar" else None
                )
                selector = field.get("selector")
                if isinstance(selector, dict):
                    entity_selector = selector.get("entity")
                    if isinstance(entity_selector, dict):
                        selector_filter = entity_selector.get("filter")
                        if isinstance(selector_filter, dict):
                            domain = selector_filter.get("domain")
                            if isinstance(domain, str):
                                expected_domain = domain
                if sources and (
                    expected_domain is None
                    or all(
                        str(source).startswith(f"{expected_domain}.")
                        for source in sources
                    )
                ):
                    continue
                message = f"Ready {widget['type']} widgets require {label}"
                raise ProjectValidationError(message)

    display_id = value.get("displayId", "custom")
    if not isinstance(display_id, str) or len(display_id) > 100:
        raise ProjectValidationError("displayId is invalid")
    normalized_project: Project = {
        "schemaVersion": 1,
        "name": name,
        "status": status,
        "language": language,
        "theme": theme,
        "fontFamily": font_family,
        "textScale": text_scale,
        "displayId": display_id or "custom",
        "width": width,
        "height": height,
        "orientation": orientation,
        "palette": palette,
        "grid": {"columns": columns, "rows": rows},
        "regions": normalized_regions,
    }
    if background is not None:
        normalized_project["background"] = background
    return normalized_project


class ProjectStore:
    """Home Assistant-native authoritative project storage."""

    def __init__(
        self, hass: HomeAssistant, registry: WidgetRegistry | None = None
    ) -> None:
        """Initialize the versioned Store."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY, atomic_writes=True
        )
        self._projects: dict[str, Project] = {}
        self._lock = asyncio.Lock()
        self._default_language = hass.config.language
        self._registry = registry or DEFAULT_REGISTRY

    def _resolve_language(self, project: Project) -> Project:
        """Pin legacy projects to the Home Assistant system language."""
        if project["language"] == "system":
            project["language"] = self._default_language
        return project

    async def async_load(self) -> None:
        """Load projects and discard malformed legacy entries safely."""
        data = await self._store.async_load() or {}
        raw_projects = data.get("projects", [])
        if not isinstance(raw_projects, list):
            return
        for raw in raw_projects:
            try:
                normalized = self._resolve_language(
                    validate_project(raw, self._registry)
                )
                project_id = _string(raw.get("id"), "id", 64)
            except ProjectValidationError:
                continue
            normalized.update(
                {
                    "id": project_id,
                    "createdAt": raw.get("createdAt", _now()),
                    "updatedAt": raw.get("updatedAt", _now()),
                }
            )
            self._projects[project_id] = normalized

    def list(self, *, ready_only: bool = False) -> list[Project]:
        """Return detached projects, sorted by name."""
        projects: Iterable[Project] = self._projects.values()
        if ready_only:
            projects = (item for item in projects if item["status"] == "ready")
        return sorted(
            (deepcopy(item) for item in projects),
            key=lambda item: item["name"].casefold(),
        )

    def get(self, project_id: str) -> Project | None:
        """Return a detached project by immutable ID."""
        project = self._projects.get(project_id)
        return deepcopy(project) if project is not None else None

    async def async_create(self, value: object) -> Project:
        """Create a project with server-owned identity and timestamps."""
        normalized = self._resolve_language(validate_project(value, self._registry))
        async with self._lock:
            if len(self._projects) >= MAX_PROJECTS:
                message = f"At most {MAX_PROJECTS} projects are allowed"
                raise _invalid(message)
            project_id = uuid4().hex
            now = _now()
            normalized.update({"id": project_id, "createdAt": now, "updatedAt": now})
            self._projects[project_id] = normalized
            await self._async_save()
        return deepcopy(normalized)

    async def async_update(self, project_id: str, value: object) -> Project:
        """Replace editable fields while preserving stable identity."""
        normalized = self._resolve_language(validate_project(value, self._registry))
        async with self._lock:
            existing = self._projects.get(project_id)
            if existing is None:
                raise KeyError(project_id)
            normalized.update(
                {
                    "id": project_id,
                    "createdAt": existing["createdAt"],
                    "updatedAt": _now(),
                }
            )
            self._projects[project_id] = normalized
            await self._async_save()
        return deepcopy(normalized)

    async def async_delete(self, project_id: str) -> None:
        """Delete a project."""
        async with self._lock:
            if self._projects.pop(project_id, None) is None:
                raise KeyError(project_id)
            await self._async_save()

    async def _async_save(self) -> None:
        await self._store.async_save({"projects": list(self._projects.values())})


def _now() -> str:
    return datetime.now(UTC).isoformat()
