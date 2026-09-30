"""Home Assistant WebSocket API for the Studio panel."""

from __future__ import annotations

from time import monotonic
from typing import Any, cast

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .compiler import DashboardCompileError, async_compile_dashboard
from .const import DOMAIN, INTEGRATION_VERSION, LOGGER, RENDER_HTTP_PATH
from .dashboards import DashboardStore, DashboardValidationError, validate_dashboard
from .palette import accent_color_for_palette
from .primitives import DEFAULT_PRIMITIVES
from .rendering import OdlRenderError, OdlRenderService
from .widgets import WidgetRegistry


def _store(hass: HomeAssistant) -> DashboardStore:
    return cast("DashboardStore", hass.data[DOMAIN].dashboards)


def _widgets(hass: HomeAssistant) -> WidgetRegistry:
    return cast("WidgetRegistry", hass.data[DOMAIN].widgets)


def _renderer(hass: HomeAssistant) -> OdlRenderService:
    return cast("OdlRenderService", hass.data[DOMAIN].renderer)


def _error(
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    err: Exception,
) -> None:
    code = "not_found" if isinstance(err, KeyError) else "invalid_dashboard"
    connection.send_error(msg["id"], code, str(err))


@websocket_api.websocket_command({vol.Required("type"): "opendisplay_studio/bootstrap"})
@websocket_api.require_admin
def websocket_bootstrap(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return authoritative dashboards, widgets, and primitive metadata."""
    connection.send_result(
        msg["id"],
        {
            "version": INTEGRATION_VERSION,
            "dashboards": _store(hass).list(),
            "widgets": _widgets(hass).definitions,
            "primitives": DEFAULT_PRIMITIVES.definitions,
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/create_dashboard",
        vol.Required("dashboard"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_create_dashboard(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        dashboard = await _store(hass).async_create(msg["dashboard"])
    except DashboardValidationError as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {"dashboard": dashboard})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/update_dashboard",
        vol.Required("dashboard_id"): str,
        vol.Required("dashboard"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_update_dashboard(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        dashboard = await _store(hass).async_update(
            msg["dashboard_id"], msg["dashboard"]
        )
    except (KeyError, DashboardValidationError) as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {"dashboard": dashboard})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/delete_dashboard",
        vol.Required("dashboard_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_delete_dashboard(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        await _store(hass).async_delete(msg["dashboard_id"])
    except KeyError as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/compose_preview",
        vol.Required("dashboard"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_compose_preview(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Compile and render the exact PNG used by Media Source."""
    pipeline_started = monotonic()
    try:
        dashboard = validate_dashboard(msg["dashboard"], _widgets(hass))
        compiled = await async_compile_dashboard(hass, dashboard, _widgets(hass))
        display = dashboard["display"]
        rendered = await _renderer(hass).async_render(
            width=display["width"],
            height=display["height"],
            elements=compiled.elements,
            background=display["background"],
            accent_color=accent_color_for_palette(display["palette"]),
        )
    except DashboardValidationError as err:
        _error(connection, msg, err)
        return
    except (DashboardCompileError, OdlRenderError) as err:
        LOGGER.warning("Live preview render failed: %s", err)
        connection.send_error(msg["id"], "preview_failed", str(err))
        return
    except Exception as err:  # noqa: BLE001
        LOGGER.exception("Unexpected live preview failure")
        connection.send_error(msg["id"], "preview_failed", str(err))
        return
    pipeline_ms = round((monotonic() - pipeline_started) * 1000, 2)
    token = hass.data[DOMAIN].cache.put(rendered.png)
    LOGGER.info(
        "Rendered preview dashboard=%s size=%dx%d queue=%.2f ms data=%.2f ms "
        "compile=%.2f ms render=%.2f ms encode=%.2f ms pipeline=%.2f ms bytes=%d",
        dashboard.get("id", "unsaved"),
        display["width"],
        display["height"],
        rendered.timings["queue"],
        compiled.data_ms,
        compiled.compile_ms,
        rendered.timings["render"],
        rendered.timings["encode"],
        pipeline_ms,
        len(rendered.png),
    )
    connection.send_result(
        msg["id"],
        {
            "imageUrl": RENDER_HTTP_PATH.replace("{token}", token),
            "yaml": compiled.yaml,
            "itemBounds": compiled.item_bounds,
            "warnings": compiled.warnings,
            "dependencies": {
                "entities": sorted(compiled.dependencies.entities),
                "domains": sorted(compiled.dependencies.domains),
                "allStates": compiled.dependencies.all_states,
                "usesTime": compiled.dependencies.uses_time,
            },
            "timings": {
                "queue": rendered.timings["queue"],
                "data": compiled.data_ms,
                "compile": compiled.compile_ms,
                "render": rendered.timings["render"],
                "encode": rendered.timings["encode"],
                "pipeline": pipeline_ms,
            },
        },
    )


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, websocket_bootstrap)
    websocket_api.async_register_command(hass, websocket_create_dashboard)
    websocket_api.async_register_command(hass, websocket_update_dashboard)
    websocket_api.async_register_command(hass, websocket_delete_dashboard)
    websocket_api.async_register_command(hass, websocket_compose_preview)
