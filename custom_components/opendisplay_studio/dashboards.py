"""Persistent freeform dashboard model for OpenDisplay Studio."""

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

from .const import SCHEMA_VERSION, STORAGE_KEY, STORAGE_VERSION
from .palette import PALETTE_COLORS
from .primitives import DEFAULT_PRIMITIVES, PrimitiveRegistry
from .validation import (
    DashboardValidationError,
    boolean,
    color,
    integer,
    string,
)
from .widgets import WidgetRegistry

type Dashboard = dict[str, Any]

MAX_DASHBOARDS = 100
MAX_ITEMS = 256
MAX_NAME_LENGTH = 100
LANGUAGE_PATTERN = re.compile(r"^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$")
PALETTES = frozenset(PALETTE_COLORS)


def _item_state(value: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": string(value.get("id"), "item.id", 64),
        "locked": boolean(value.get("locked", False), "item.locked"),
        "hidden": boolean(value.get("hidden", False), "item.hidden"),
    }


def _validate_frame(value: object, width: int, height: int) -> dict[str, int]:
    if not isinstance(value, dict):
        raise DashboardValidationError("widget frame must be an object")
    x = integer(value.get("x"), "frame.x", 0, width - 1)
    y = integer(value.get("y"), "frame.y", 0, height - 1)
    frame_width = integer(value.get("width"), "frame.width", 1, width)
    frame_height = integer(value.get("height"), "frame.height", 1, height)
    if x + frame_width > width or y + frame_height > height:
        raise DashboardValidationError("widget frame exceeds the display")
    return {"x": x, "y": y, "width": frame_width, "height": frame_height}


def _validate_widget_item(
    value: dict[str, Any], registry: WidgetRegistry, width: int, height: int
) -> dict[str, Any]:
    widget = value.get("widget")
    if not isinstance(widget, dict):
        raise DashboardValidationError("widget item requires widget")
    widget_type = string(widget.get("type"), "widget.type", 64)
    definition = registry.definition(widget_type)
    version = string(widget.get("version", definition["version"]), "widget.version", 64)
    config = widget.get("config", {})
    if not isinstance(config, dict):
        raise DashboardValidationError("widget.config must be an object")
    layout = value.get("layout", {})
    if not isinstance(layout, dict):
        raise DashboardValidationError("widget layout must be an object")
    return {
        **_item_state(value),
        "kind": "widget",
        "widget": {"type": widget_type, "version": version, "config": deepcopy(config)},
        "frame": _validate_frame(value.get("frame"), width, height),
        "layout": {
            "padding": integer(layout.get("padding", 0), "layout.padding", 0, 128)
        },
    }


def _validate_primitive_item(
    value: dict[str, Any],
    primitives: PrimitiveRegistry,
    width: int,
    height: int,
) -> dict[str, Any]:
    primitive = value.get("primitive")
    if not isinstance(primitive, dict):
        raise DashboardValidationError("primitive item requires primitive")
    return {
        **_item_state(value),
        "kind": "primitive",
        "primitive": primitives.normalize(primitive, width, height),
    }


def validate_dashboard(
    value: object,
    registry: WidgetRegistry,
    primitives: PrimitiveRegistry = DEFAULT_PRIMITIVES,
) -> Dashboard:
    """Normalize one complete freeform dashboard."""
    if not isinstance(value, dict):
        raise DashboardValidationError("dashboard must be an object")
    if value.get("schemaVersion") != SCHEMA_VERSION:
        raise DashboardValidationError(f"schemaVersion must be {SCHEMA_VERSION}")
    display = value.get("display")
    if not isinstance(display, dict):
        raise DashboardValidationError("display must be an object")
    width = integer(display.get("width"), "display.width", 64, 4096)
    height = integer(display.get("height"), "display.height", 64, 4096)
    palette = display.get("palette")
    if palette not in PALETTES:
        raise DashboardValidationError("display.palette is invalid")
    padding = integer(display.get("padding", 0), "display.padding", 0, 1024)
    if padding * 2 >= min(width, height):
        raise DashboardValidationError("display.padding leaves no working area")
    snap_size = integer(display.get("snapSize", 5), "display.snapSize", 1, 256)
    raw_items = value.get("items", [])
    if not isinstance(raw_items, list) or len(raw_items) > MAX_ITEMS:
        raise DashboardValidationError(f"items must contain at most {MAX_ITEMS} items")
    items: list[dict[str, Any]] = []
    item_ids: set[str] = set()
    for raw_item in raw_items:
        if not isinstance(raw_item, dict):
            raise DashboardValidationError("every item must be an object")
        if raw_item.get("kind") == "widget":
            item = _validate_widget_item(raw_item, registry, width, height)
        elif raw_item.get("kind") == "primitive":
            item = _validate_primitive_item(raw_item, primitives, width, height)
        else:
            raise DashboardValidationError("item.kind must be widget or primitive")
        if item["id"] in item_ids:
            raise DashboardValidationError("item ids must be unique")
        item_ids.add(item["id"])
        items.append(item)
    language = value.get("language", "en")
    if not isinstance(language, str) or LANGUAGE_PATTERN.fullmatch(language) is None:
        raise DashboardValidationError("language is invalid")
    status = value.get("status", "draft")
    if status not in {"draft", "ready"}:
        raise DashboardValidationError("status must be draft or ready")
    normalized: Dashboard = {
        "schemaVersion": SCHEMA_VERSION,
        "name": string(value.get("name"), "name", MAX_NAME_LENGTH),
        "status": status,
        "language": language,
        "display": {
            "profileId": display.get("profileId")
            if isinstance(display.get("profileId"), str)
            else None,
            "width": width,
            "height": height,
            "palette": palette,
            "background": color(
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


class DashboardStore:
    """Serialize dashboard mutations and persist them through HA Store."""

    def __init__(self, hass: HomeAssistant, registry: WidgetRegistry) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._registry = registry
        self._dashboards: dict[str, Dashboard] = {}
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        """Load stored dashboards; records that fail validation are skipped."""
        data = await self._store.async_load() or {"dashboards": []}
        dashboards = data.get("dashboards", [])
        if not isinstance(dashboards, list):
            return
        for value in dashboards:
            try:
                dashboard = validate_dashboard(value, self._registry)
            except DashboardValidationError:
                continue
            dashboard_id = dashboard.get("id")
            if isinstance(dashboard_id, str):
                self._dashboards[dashboard_id] = dashboard

    def list(self, *, ready_only: bool = False) -> list[Dashboard]:
        values: Iterable[Dashboard] = self._dashboards.values()
        if ready_only:
            values = (
                dashboard for dashboard in values if dashboard["status"] == "ready"
            )
        return deepcopy(
            sorted(values, key=lambda dashboard: dashboard["name"].casefold())
        )

    def get(self, dashboard_id: str) -> Dashboard | None:
        dashboard = self._dashboards.get(dashboard_id)
        return deepcopy(dashboard) if dashboard is not None else None

    async def async_create(self, value: object) -> Dashboard:
        async with self._lock:
            if len(self._dashboards) >= MAX_DASHBOARDS:
                raise DashboardValidationError("dashboard limit reached")
            dashboard = validate_dashboard(value, self._registry)
            dashboard_id = str(uuid4())
            now = datetime.now(UTC).isoformat()
            dashboard.update({"id": dashboard_id, "createdAt": now, "updatedAt": now})
            self._dashboards[dashboard_id] = dashboard
            await self._async_save()
            return deepcopy(dashboard)

    async def async_update(self, dashboard_id: str, value: object) -> Dashboard:
        async with self._lock:
            current = self._dashboards.get(dashboard_id)
            if current is None:
                raise KeyError(dashboard_id)
            dashboard = validate_dashboard(value, self._registry)
            dashboard.update(
                {
                    "id": dashboard_id,
                    "createdAt": current["createdAt"],
                    "updatedAt": datetime.now(UTC).isoformat(),
                }
            )
            self._dashboards[dashboard_id] = dashboard
            await self._async_save()
            return deepcopy(dashboard)

    async def async_delete(self, dashboard_id: str) -> None:
        async with self._lock:
            if dashboard_id not in self._dashboards:
                raise KeyError(dashboard_id)
            del self._dashboards[dashboard_id]
            await self._async_save()

    async def _async_save(self) -> None:
        await self._store.async_save({"dashboards": list(self._dashboards.values())})
