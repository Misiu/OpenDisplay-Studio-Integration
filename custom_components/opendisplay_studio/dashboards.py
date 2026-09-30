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
from .items import validate_items
from .palette import PALETTE_COLORS
from .primitives import DEFAULT_PRIMITIVES, PrimitiveRegistry
from .validation import (
    DashboardValidationError,
    color,
    integer,
    string,
)
from .widgets import WidgetRegistry

type Dashboard = dict[str, Any]

MAX_DASHBOARDS = 100
MAX_NAME_LENGTH = 100
LANGUAGE_PATTERN = re.compile(r"^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$")
PALETTES = frozenset(PALETTE_COLORS)


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
    items = validate_items(value.get("items", []), registry, primitives, width, height)
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
        self.registry = registry
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
                dashboard = validate_dashboard(value, self.registry)
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
            dashboard = validate_dashboard(value, self.registry)
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
            dashboard = validate_dashboard(value, self.registry)
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
