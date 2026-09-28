"""Persistent freeform project model for OpenDisplay Studio."""

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
from .palette import PALETTE_COLORS, SUPPORTED_COLORS
from .widgets import WidgetRegistry

type Project = dict[str, Any]

MAX_PROJECTS = 100
MAX_ITEMS = 256
MAX_NAME_LENGTH = 100
MAX_TEXT_LENGTH = 4096
LANGUAGE_PATTERN = re.compile(r"^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$")
PALETTES = frozenset(PALETTE_COLORS)
COLORS = SUPPORTED_COLORS | {"accent", "transparent"}


class ProjectValidationError(ValueError):
    """A project submitted by the frontend is invalid."""


def _integer(value: object, name: str, minimum: int, maximum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ProjectValidationError(f"{name} must be an integer")
    if not minimum <= value <= maximum:
        raise ProjectValidationError(f"{name} must be between {minimum} and {maximum}")
    return value


def _string(value: object, name: str, maximum: int = MAX_TEXT_LENGTH) -> str:
    if not isinstance(value, str):
        raise ProjectValidationError(f"{name} must be a string")
    result = value.strip()
    if not result or len(result) > maximum:
        raise ProjectValidationError(f"{name} must contain 1-{maximum} characters")
    return result


def _boolean(value: object, name: str) -> bool:
    if not isinstance(value, bool):
        raise ProjectValidationError(f"{name} must be a boolean")
    return value


def _color(value: object, name: str, *, allow_none: bool = False) -> str | None:
    if allow_none and (value is None or value == "transparent"):
        return None
    if not isinstance(value, str) or value not in COLORS - {"transparent"}:
        raise ProjectValidationError(f"{name} is not a supported palette color")
    return value


def _item_state(value: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": _string(value.get("id"), "item.id", 64),
        "locked": _boolean(value.get("locked", False), "item.locked"),
        "hidden": _boolean(value.get("hidden", False), "item.hidden"),
    }


def _validate_frame(value: object, width: int, height: int) -> dict[str, int]:
    if not isinstance(value, dict):
        raise ProjectValidationError("widget frame must be an object")
    x = _integer(value.get("x"), "frame.x", 0, width - 1)
    y = _integer(value.get("y"), "frame.y", 0, height - 1)
    frame_width = _integer(value.get("width"), "frame.width", 1, width)
    frame_height = _integer(value.get("height"), "frame.height", 1, height)
    if x + frame_width > width or y + frame_height > height:
        raise ProjectValidationError("widget frame exceeds the display")
    return {"x": x, "y": y, "width": frame_width, "height": frame_height}


def _validate_widget_item(
    value: dict[str, Any], registry: WidgetRegistry, width: int, height: int
) -> dict[str, Any]:
    widget = value.get("widget")
    if not isinstance(widget, dict):
        raise ProjectValidationError("widget item requires widget")
    widget_type = _string(widget.get("type"), "widget.type", 64)
    definition = registry.definition(widget_type)
    version = _string(
        widget.get("version", definition["version"]), "widget.version", 64
    )
    config = widget.get("config", {})
    if not isinstance(config, dict):
        raise ProjectValidationError("widget.config must be an object")
    layout = value.get("layout", {})
    if not isinstance(layout, dict):
        raise ProjectValidationError("widget layout must be an object")
    return {
        **_item_state(value),
        "kind": "widget",
        "widget": {"type": widget_type, "version": version, "config": deepcopy(config)},
        "frame": _validate_frame(value.get("frame"), width, height),
        "layout": {
            "padding": _integer(layout.get("padding", 0), "layout.padding", 0, 128)
        },
    }


def _validate_box_primitive(
    primitive: dict[str, Any], width: int, height: int, primitive_type: str
) -> dict[str, Any]:
    x_start = _integer(primitive.get("x_start"), "primitive.x_start", 0, width - 1)
    x_end = _integer(primitive.get("x_end"), "primitive.x_end", 0, width - 1)
    y_start = _integer(primitive.get("y_start"), "primitive.y_start", 0, height - 1)
    y_end = _integer(primitive.get("y_end"), "primitive.y_end", 0, height - 1)
    if primitive_type != "line" and (x_end <= x_start or y_end <= y_start):
        raise ProjectValidationError(
            f"{primitive_type} must have positive width and height"
        )
    if primitive_type == "line" and x_start == x_end and y_start == y_end:
        raise ProjectValidationError("line must have two distinct points")
    return {
        "type": primitive_type,
        "x_start": x_start,
        "y_start": y_start,
        "x_end": x_end,
        "y_end": y_end,
    }


def _validate_primitive_item(
    value: dict[str, Any], width: int, height: int
) -> dict[str, Any]:
    primitive = value.get("primitive")
    if not isinstance(primitive, dict):
        raise ProjectValidationError("primitive item requires primitive")
    primitive_type = primitive.get("type")
    result: dict[str, Any] = {**_item_state(value), "kind": "primitive"}
    normalized: dict[str, Any]
    if primitive_type == "text":
        normalized = {
            "type": "text",
            "value": _string(primitive.get("value"), "primitive.value"),
            "x": _integer(primitive.get("x"), "primitive.x", 0, width - 1),
            "y": _integer(primitive.get("y"), "primitive.y", 0, height - 1),
            "size": _integer(primitive.get("size", 24), "primitive.size", 6, 256),
            "color": _color(primitive.get("color", "black"), "primitive.color"),
        }
    elif primitive_type in {"rectangle", "ellipse"}:
        normalized = _validate_box_primitive(primitive, width, height, primitive_type)
        normalized.update(
            {
                "fill": _color(
                    primitive.get("fill"), "primitive.fill", allow_none=True
                ),
                "outline": _color(
                    primitive.get("outline", "black"), "primitive.outline"
                ),
                "width": _integer(primitive.get("width", 1), "primitive.width", 0, 32),
            }
        )
    elif primitive_type == "line":
        normalized = _validate_box_primitive(primitive, width, height, primitive_type)
        normalized.update(
            {
                "fill": _color(primitive.get("fill", "black"), "primitive.fill"),
                "width": _integer(primitive.get("width", 2), "primitive.width", 1, 32),
                "dashed": _boolean(primitive.get("dashed", False), "primitive.dashed"),
            }
        )
    elif primitive_type == "circle":
        normalized = {
            "type": "circle",
            "x": _integer(primitive.get("x"), "primitive.x", 0, width - 1),
            "y": _integer(primitive.get("y"), "primitive.y", 0, height - 1),
            "radius": _integer(
                primitive.get("radius", 32), "primitive.radius", 1, min(width, height)
            ),
            "fill": _color(primitive.get("fill"), "primitive.fill", allow_none=True),
            "outline": _color(primitive.get("outline", "black"), "primitive.outline"),
            "width": _integer(primitive.get("width", 2), "primitive.width", 0, 32),
        }
    elif primitive_type == "icon":
        normalized = {
            "type": "icon",
            "value": _string(primitive.get("value"), "primitive.value", 128),
            "x": _integer(primitive.get("x"), "primitive.x", 0, width - 1),
            "y": _integer(primitive.get("y"), "primitive.y", 0, height - 1),
            "size": _integer(primitive.get("size", 48), "primitive.size", 8, 256),
            "color": _color(primitive.get("color", "black"), "primitive.color"),
            "anchor": "lt",
        }
    elif primitive_type == "qrcode":
        normalized = {
            "type": "qrcode",
            "data": _string(primitive.get("data"), "primitive.data"),
            "x": _integer(primitive.get("x"), "primitive.x", 0, width - 1),
            "y": _integer(primitive.get("y"), "primitive.y", 0, height - 1),
            "boxsize": _integer(
                primitive.get("boxsize", 3), "primitive.boxsize", 1, 16
            ),
            "border": _integer(primitive.get("border", 1), "primitive.border", 0, 8),
            "color": _color(primitive.get("color", "black"), "primitive.color"),
            "bgcolor": _color(primitive.get("bgcolor", "white"), "primitive.bgcolor"),
        }
    elif primitive_type == "progress_bar":
        normalized = _validate_box_primitive(primitive, width, height, primitive_type)
        direction = primitive.get("direction", "right")
        if direction not in {"right", "left", "up", "down"}:
            raise ProjectValidationError("primitive.direction is invalid")
        normalized.update(
            {
                "progress": _integer(
                    primitive.get("progress", 50), "primitive.progress", 0, 100
                ),
                "direction": direction,
                "background": _color(
                    primitive.get("background", "white"), "primitive.background"
                ),
                "fill": _color(primitive.get("fill", "accent"), "primitive.fill"),
                "outline": _color(
                    primitive.get("outline", "black"), "primitive.outline"
                ),
                "width": _integer(primitive.get("width", 1), "primitive.width", 0, 32),
                "show_percentage": _boolean(
                    primitive.get("show_percentage", True), "primitive.show_percentage"
                ),
            }
        )
    else:
        raise ProjectValidationError(f"Unsupported primitive type: {primitive_type}")
    result["primitive"] = normalized
    return result


def validate_project(value: object, registry: WidgetRegistry) -> Project:
    """Normalize one complete v3 freeform project."""
    if not isinstance(value, dict):
        raise ProjectValidationError("project must be an object")
    if value.get("schemaVersion") != 3:
        raise ProjectValidationError("schemaVersion must be 3")
    display = value.get("display")
    if not isinstance(display, dict):
        raise ProjectValidationError("display must be an object")
    width = _integer(display.get("width"), "display.width", 64, 4096)
    height = _integer(display.get("height"), "display.height", 64, 4096)
    palette = display.get("palette")
    if palette not in PALETTES:
        raise ProjectValidationError("display.palette is invalid")
    padding = _integer(display.get("padding", 0), "display.padding", 0, 1024)
    if padding * 2 >= min(width, height):
        raise ProjectValidationError("display.padding leaves no working area")
    snap_size = _integer(display.get("snapSize", 5), "display.snapSize", 1, 256)
    raw_items = value.get("items", [])
    if not isinstance(raw_items, list) or len(raw_items) > MAX_ITEMS:
        raise ProjectValidationError(f"items must contain at most {MAX_ITEMS} items")
    items: list[dict[str, Any]] = []
    item_ids: set[str] = set()
    for raw_item in raw_items:
        if not isinstance(raw_item, dict):
            raise ProjectValidationError("every item must be an object")
        if raw_item.get("kind") == "widget":
            item = _validate_widget_item(raw_item, registry, width, height)
        elif raw_item.get("kind") == "primitive":
            item = _validate_primitive_item(raw_item, width, height)
        else:
            raise ProjectValidationError("item.kind must be widget or primitive")
        if item["id"] in item_ids:
            raise ProjectValidationError("item ids must be unique")
        item_ids.add(item["id"])
        items.append(item)
    language = value.get("language", "en")
    if not isinstance(language, str) or LANGUAGE_PATTERN.fullmatch(language) is None:
        raise ProjectValidationError("language is invalid")
    status = value.get("status", "draft")
    if status not in {"draft", "ready"}:
        raise ProjectValidationError("status must be draft or ready")
    normalized: Project = {
        "schemaVersion": 3,
        "name": _string(value.get("name"), "name", MAX_NAME_LENGTH),
        "status": status,
        "language": language,
        "display": {
            "profileId": display.get("profileId")
            if isinstance(display.get("profileId"), str)
            else None,
            "width": width,
            "height": height,
            "palette": palette,
            "background": _color(
                display.get("background", "white"), "display.background"
            ),
            "padding": padding,
            "snapSize": snap_size,
        },
        "items": items,
    }
    for key in ("id", "createdAt", "updatedAt"):
        if key in value:
            normalized[key] = value[key]
    return normalized


class ProjectStore:
    """Serialize project mutations and persist them through HA Store."""

    def __init__(self, hass: HomeAssistant, registry: WidgetRegistry) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._registry = registry
        self._projects: dict[str, Project] = {}
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        """Load only native v3 records; older experiments are unsupported."""
        data = await self._store.async_load() or {"projects": []}
        projects = data.get("projects", [])
        if not isinstance(projects, list):
            return
        for value in projects:
            try:
                project = validate_project(value, self._registry)
            except ProjectValidationError:
                continue
            project_id = project.get("id")
            if isinstance(project_id, str):
                self._projects[project_id] = project

    def list(self, *, ready_only: bool = False) -> list[Project]:
        values: Iterable[Project] = self._projects.values()
        if ready_only:
            values = (project for project in values if project["status"] == "ready")
        return deepcopy(sorted(values, key=lambda project: project["name"].casefold()))

    def get(self, project_id: str) -> Project | None:
        project = self._projects.get(project_id)
        return deepcopy(project) if project is not None else None

    async def async_create(self, value: object) -> Project:
        async with self._lock:
            if len(self._projects) >= MAX_PROJECTS:
                raise ProjectValidationError("project limit reached")
            project = validate_project(value, self._registry)
            project_id = str(uuid4())
            now = datetime.now(UTC).isoformat()
            project.update({"id": project_id, "createdAt": now, "updatedAt": now})
            self._projects[project_id] = project
            await self._async_save()
            return deepcopy(project)

    async def async_update(self, project_id: str, value: object) -> Project:
        async with self._lock:
            current = self._projects.get(project_id)
            if current is None:
                raise KeyError(project_id)
            project = validate_project(value, self._registry)
            project.update(
                {
                    "id": project_id,
                    "createdAt": current["createdAt"],
                    "updatedAt": datetime.now(UTC).isoformat(),
                }
            )
            self._projects[project_id] = project
            await self._async_save()
            return deepcopy(project)

    async def async_delete(self, project_id: str) -> None:
        async with self._lock:
            if project_id not in self._projects:
                raise KeyError(project_id)
            del self._projects[project_id]
            await self._async_save()

    async def _async_save(self) -> None:
        await self._store.async_save({"projects": list(self._projects.values())})
