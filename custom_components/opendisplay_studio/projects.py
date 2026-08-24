"""Persistent screen project model for OpenDisplay Studio."""

from __future__ import annotations

import asyncio
from collections.abc import Iterable
from copy import deepcopy
from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .widgets import WIDGET_DEFINITIONS

type Project = dict[str, Any]

MAX_PROJECTS = 100
MAX_REGIONS = 256
MAX_NAME_LENGTH = 100
MAX_TEXT_LENGTH = 4_096
PALETTES = {"bw", "gray4", "gray16", "bwr", "bwy", "bwry", "spectra6"}
WIDGET_TYPES = {item["id"] for item in WIDGET_DEFINITIONS}


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


def _validate_widget(value: object) -> dict[str, Any] | None:
    if value is None:
        return None
    if not isinstance(value, dict):
        raise ProjectValidationError("widget must be an object")
    widget_type = _string(value.get("type"), "widget.type", 50)
    if widget_type not in WIDGET_TYPES:
        message = f"Unsupported widget type: {widget_type}"
        raise _invalid(message)
    config = value.get("config", {})
    if not isinstance(config, dict):
        raise ProjectValidationError("widget.config must be an object")
    normalized_config: dict[str, str | int | float | bool | list[str]] = {}
    for key, item in config.items():
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
    if widget_type == "entity-state":
        layout = normalized_config.get("layout", "large")
        normalized_config = {
            "entity": str(normalized_config.get("entity", "")),
            "title": str(normalized_config.get("title", ""))[:MAX_NAME_LENGTH],
            "layout": str(layout) if layout in {"large", "compact"} else "large",
            "showUnit": bool(normalized_config.get("showUnit", True)),
        }
    elif widget_type == "calendar":
        days = normalized_config.get("days", 7)
        if isinstance(days, bool) or not isinstance(days, int) or not 1 <= days <= 31:
            raise ProjectValidationError("calendar days must be between 1 and 31")
        normalized_config = {
            "calendar": str(normalized_config.get("calendar", "")),
            "title": str(normalized_config.get("title", "Upcoming"))[:MAX_NAME_LENGTH],
            "days": days,
            "showLocation": bool(normalized_config.get("showLocation", True)),
            "showDescription": bool(normalized_config.get("showDescription", False)),
            "time24h": bool(normalized_config.get("time24h", True)),
        }
    elif widget_type == "text":
        align = normalized_config.get("align", "left")
        normalized_config = {
            "title": str(normalized_config.get("title", ""))[:MAX_NAME_LENGTH],
            "text": str(normalized_config.get("text", "Text"))[:MAX_TEXT_LENGTH],
            "align": align if align in {"left", "center", "right"} else "left",
        }
    return {
        "type": widget_type,
        "version": _integer(value.get("version", 1), "widget.version", 1, 100),
        "config": normalized_config,
    }


def validate_project(value: object) -> Project:
    """Validate and normalize a complete project payload."""
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
        widget = _validate_widget(region.get("widget"))
        if widget is not None:
            normalized_region["widget"] = widget
        normalized_regions.append(normalized_region)

    if status == "ready":
        for region in normalized_regions:
            widget = region.get("widget")
            if widget is None:
                continue
            config = widget["config"]
            if widget["type"] == "entity-state" and not config["entity"]:
                raise ProjectValidationError(
                    "Ready Entity State widgets require an entity"
                )
            if widget["type"] == "calendar" and not str(config["calendar"]).startswith(
                "calendar."
            ):
                raise ProjectValidationError(
                    "Ready Calendar widgets require a calendar entity"
                )

    display_id = value.get("displayId", "custom")
    if not isinstance(display_id, str) or len(display_id) > 100:
        raise ProjectValidationError("displayId is invalid")
    return {
        "schemaVersion": 1,
        "name": name,
        "status": status,
        "displayId": display_id or "custom",
        "width": width,
        "height": height,
        "orientation": orientation,
        "palette": palette,
        "grid": {"columns": columns, "rows": rows},
        "regions": normalized_regions,
    }


class ProjectStore:
    """Home Assistant-native authoritative project storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the versioned Store."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY, atomic_writes=True
        )
        self._projects: dict[str, Project] = {}
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        """Load projects and discard malformed legacy entries safely."""
        data = await self._store.async_load() or {}
        raw_projects = data.get("projects", [])
        if not isinstance(raw_projects, list):
            return
        for raw in raw_projects:
            try:
                normalized = validate_project(raw)
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
        normalized = validate_project(value)
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
        normalized = validate_project(value)
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
