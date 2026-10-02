"""Home Assistant WebSocket API for the Studio panel."""

from __future__ import annotations

from typing import Any, cast

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceNotFound

from .compiler import DashboardCompileError
from .const import DOMAIN, INTEGRATION_VERSION, LOGGER, RENDER_HTTP_PATH
from .dashboard_files import DashboardFileError, export_file
from .dashboard_import import prepare_import
from .dashboards import DashboardStore, DashboardValidationError, validate_dashboard
from .delivery import async_render_dashboard
from .devices import async_send_to_device, list_display_devices
from .fonts import available_fonts, font_directories, with_font_options
from .icons import SORTED_ICON_NAMES
from .palette import PALETTE_COLORS
from .primitives import DEFAULT_PRIMITIVES
from .rendering import OdlRenderError, OdlRenderService
from .widget_reload import async_reload_widgets
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/bootstrap",
        vol.Optional("language", default="en"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_bootstrap(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return authoritative dashboards, widgets, and primitive metadata."""
    fonts = await hass.async_add_executor_job(available_fonts, font_directories(hass))
    connection.send_result(
        msg["id"],
        {
            "version": INTEGRATION_VERSION,
            "dashboards": _store(hass).list(),
            "widgets": _widgets(hass).definitions(msg["language"]),
            "widgetErrors": [error.as_dict() for error in _widgets(hass).errors],
            "primitives": with_font_options(
                DEFAULT_PRIMITIVES.localized(msg["language"]), fonts
            ),
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
    """Compile and render the canvas, as designed, for the editor."""
    try:
        dashboard = validate_dashboard(msg["dashboard"], _widgets(hass))
        rendered = await async_render_dashboard(
            hass, dashboard, for_device=False, with_margin=True
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
    compiled = rendered.compiled
    picture = rendered.picture
    token = hass.data[DOMAIN].cache.put(picture.png)
    connection.send_result(
        msg["id"],
        {
            "imageUrl": RENDER_HTTP_PATH.replace("{token}", token),
            "margin": rendered.margin,
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
                "queue": picture.timings["queue"],
                "data": compiled.data_ms,
                "compile": compiled.compile_ms,
                "render": picture.timings["render"],
                "encode": picture.timings["encode"],
                "pipeline": rendered.pipeline_ms,
            },
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/send_to_device",
        vol.Required("dashboard"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_send_to_device(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Render the dashboard as the device shows it and upload it to the device."""
    try:
        dashboard = validate_dashboard(msg["dashboard"], _widgets(hass))
        device_id = dashboard["display"]["deviceId"]
        if device_id is None:
            connection.send_error(
                msg["id"], "no_device", "The dashboard is not made for a device"
            )
            return
        rendered = await async_render_dashboard(hass, dashboard, for_device=True)
        await async_send_to_device(hass, device_id, rendered.picture.png)
    except DashboardValidationError as err:
        _error(connection, msg, err)
        return
    except (DashboardCompileError, OdlRenderError) as err:
        connection.send_error(msg["id"], "render_failed", str(err))
        return
    except (HomeAssistantError, ServiceNotFound) as err:
        LOGGER.warning("Could not send the dashboard to the device: %s", err)
        connection.send_error(msg["id"], "send_failed", str(err))
        return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/reload_widgets",
        vol.Optional("language", default="en"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_reload_widgets(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Load the widget packages again and return the new catalog."""
    registry = await async_reload_widgets(hass)
    connection.send_result(
        msg["id"],
        {
            "widgets": registry.definitions(msg["language"]),
            "widgetErrors": [error.as_dict() for error in registry.errors],
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): "opendisplay_studio/list_devices"}
)
@websocket_api.require_admin
def websocket_list_devices(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the OpenDisplay devices a new dashboard can be sized for."""
    connection.send_result(msg["id"], {"devices": list_display_devices(hass)})


@websocket_api.websocket_command(
    {vol.Required("type"): "opendisplay_studio/list_icons"}
)
@websocket_api.require_admin
def websocket_list_icons(
    _hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the names of every icon the renderer can draw, for the icon picker."""
    connection.send_result(msg["id"], {"icons": SORTED_ICON_NAMES})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/export_dashboard",
        vol.Required("dashboard"): dict,
    }
)
@websocket_api.require_admin
def websocket_export_dashboard(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the file for the dashboard as the panel has it, saved or not."""
    try:
        dashboard = validate_dashboard(msg["dashboard"], _widgets(hass))
    except DashboardValidationError as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {"file": export_file(dashboard)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/prepare_import",
        vol.Required("file"): object,
        vol.Required("display"): vol.Schema(
            {
                vol.Required("width"): int,
                vol.Required("height"): int,
                vol.Required("palette"): vol.In(list(PALETTE_COLORS)),
            },
            extra=vol.ALLOW_EXTRA,
        ),
        vol.Optional("colorMap", default={}): {str: str},
    }
)
@websocket_api.require_admin
def websocket_prepare_import(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Check a dashboard file against the open dashboard and bring its colors over."""
    try:
        result = prepare_import(
            msg["file"],
            msg["display"],
            msg["colorMap"],
            _widgets(hass),
            DEFAULT_PRIMITIVES,
        )
    except DashboardFileError as err:
        connection.send_error(msg["id"], err.code, str(err))
        return
    except DashboardValidationError as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], result)


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, websocket_export_dashboard)
    websocket_api.async_register_command(hass, websocket_prepare_import)
    websocket_api.async_register_command(hass, websocket_list_icons)
    websocket_api.async_register_command(hass, websocket_list_devices)
    websocket_api.async_register_command(hass, websocket_send_to_device)
    websocket_api.async_register_command(hass, websocket_bootstrap)
    websocket_api.async_register_command(hass, websocket_reload_widgets)
    websocket_api.async_register_command(hass, websocket_create_dashboard)
    websocket_api.async_register_command(hass, websocket_update_dashboard)
    websocket_api.async_register_command(hass, websocket_delete_dashboard)
    websocket_api.async_register_command(hass, websocket_compose_preview)
