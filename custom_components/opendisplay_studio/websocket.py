"""Home Assistant WebSocket API for the Studio panel."""

from __future__ import annotations

from time import monotonic
from typing import Any, cast

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .compiler import ProjectCompileError, async_compile_project
from .const import DOMAIN, INTEGRATION_VERSION, LOGGER, RENDER_HTTP_PATH
from .palette import accent_color_for_palette
from .projects import ProjectStore, ProjectValidationError, validate_project
from .rendering import OdlRenderError, OdlRenderService
from .widgets import WidgetRegistry


def _store(hass: HomeAssistant) -> ProjectStore:
    return cast("ProjectStore", hass.data[DOMAIN].projects)


def _widgets(hass: HomeAssistant) -> WidgetRegistry:
    return cast("WidgetRegistry", hass.data[DOMAIN].widgets)


def _renderer(hass: HomeAssistant) -> OdlRenderService:
    return cast("OdlRenderService", hass.data[DOMAIN].renderer)


def _error(
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    err: Exception,
) -> None:
    code = "not_found" if isinstance(err, KeyError) else "invalid_project"
    connection.send_error(msg["id"], code, str(err))


@websocket_api.websocket_command({vol.Required("type"): "opendisplay_studio/bootstrap"})
@websocket_api.require_admin
def websocket_bootstrap(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return authoritative projects, widgets, and primitive metadata."""
    connection.send_result(
        msg["id"],
        {
            "version": INTEGRATION_VERSION,
            "projects": _store(hass).list(),
            "widgets": _widgets(hass).definitions,
            "primitives": [
                {
                    "id": "text",
                    "name": "Text",
                    "description": "Pixel-positioned text",
                    "icon": "mdi:format-text",
                },
                {
                    "id": "rectangle",
                    "name": "Rectangle",
                    "description": "Filled or outlined rectangle",
                    "icon": "mdi:rectangle-outline",
                },
                {
                    "id": "line",
                    "name": "Line",
                    "description": "Solid or dashed line between two points",
                    "icon": "mdi:vector-line",
                },
                {
                    "id": "circle",
                    "name": "Circle",
                    "description": "Filled or outlined circle",
                    "icon": "mdi:circle-outline",
                },
                {
                    "id": "ellipse",
                    "name": "Ellipse",
                    "description": "Filled or outlined ellipse",
                    "icon": "mdi:ellipse-outline",
                },
                {
                    "id": "icon",
                    "name": "Icon",
                    "description": "Material Design icon from the bundled ODL font",
                    "icon": "mdi:star-outline",
                },
                {
                    "id": "qrcode",
                    "name": "QR code",
                    "description": "Locally generated QR code",
                    "icon": "mdi:qrcode",
                },
                {
                    "id": "progress_bar",
                    "name": "Progress bar",
                    "description": "Directional progress indicator",
                    "icon": "mdi:progress-helper",
                },
            ],
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/create_project",
        vol.Required("project"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_create_project(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        project = await _store(hass).async_create(msg["project"])
    except ProjectValidationError as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {"project": project})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/update_project",
        vol.Required("project_id"): str,
        vol.Required("project"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_update_project(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        project = await _store(hass).async_update(msg["project_id"], msg["project"])
    except (KeyError, ProjectValidationError) as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {"project": project})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/delete_project",
        vol.Required("project_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_delete_project(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        await _store(hass).async_delete(msg["project_id"])
    except KeyError as err:
        _error(connection, msg, err)
        return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/compose_preview",
        vol.Required("project"): dict,
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
        project = validate_project(msg["project"], _widgets(hass))
        compiled = await async_compile_project(hass, project, _widgets(hass))
        display = project["display"]
        rendered = await _renderer(hass).async_render(
            width=display["width"],
            height=display["height"],
            elements=compiled.elements,
            background=display["background"],
            accent_color=accent_color_for_palette(display["palette"]),
        )
    except ProjectValidationError as err:
        _error(connection, msg, err)
        return
    except (ProjectCompileError, OdlRenderError) as err:
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
        "Rendered preview project=%s size=%dx%d queue=%.2f ms data=%.2f ms "
        "compile=%.2f ms render=%.2f ms encode=%.2f ms pipeline=%.2f ms bytes=%d",
        project.get("id", "unsaved"),
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
    websocket_api.async_register_command(hass, websocket_create_project)
    websocket_api.async_register_command(hass, websocket_update_project)
    websocket_api.async_register_command(hass, websocket_delete_project)
    websocket_api.async_register_command(hass, websocket_compose_preview)
