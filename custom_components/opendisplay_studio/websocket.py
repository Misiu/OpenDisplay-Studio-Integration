"""Home Assistant WebSocket API for the Studio panel."""

from __future__ import annotations

from typing import Any, cast

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .composer import ProjectComposeError, async_compose_project
from .const import DOMAIN, LOGGER, MIN_RENDERER_VERSION, RENDER_HTTP_PATH
from .liquid_renderer import TemplateRenderError
from .projects import (
    ProjectStore,
    ProjectValidationError,
    validate_project,
)
from .renderer import RendererClient, RendererError
from .widgets import DEFAULT_REGISTRY, WidgetRegistry


def _store(hass: HomeAssistant) -> ProjectStore:
    return cast("ProjectStore", hass.data[DOMAIN].projects)


def _renderer_client(hass: HomeAssistant) -> RendererClient:
    """Return the domain Renderer shared by preview and Media Source."""
    client = getattr(hass.data[DOMAIN], "renderer", None)
    if client is None:
        message = (
            "Renderer App is not connected. Update and start Renderer App "
            f"{MIN_RENDERER_VERSION}, then reload the OpenDisplay Studio integration"
        )
        raise ProjectComposeError(message)
    return cast("RendererClient", client)


def _widgets(hass: HomeAssistant) -> WidgetRegistry:
    """Return the discovered package registry used by every render surface."""
    return cast(
        "WidgetRegistry",
        getattr(hass.data[DOMAIN], "widgets", DEFAULT_REGISTRY),
    )


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
    """Return authoritative projects and widget metadata."""
    connection.send_result(
        msg["id"],
        {"projects": _store(hass).list(), "widgets": _widgets(hass).definitions},
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
    """Create a screen project."""
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
    """Update a screen project without changing its ID."""
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
    """Delete a project and therefore its Media Source item."""
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
    """Render the same live PNG used by Media Source."""
    try:
        project = validate_project(msg["project"], _widgets(hass))
        composed = await async_compose_project(hass, project)
        rendered = await _renderer_client(hass).async_render(
            html=composed.html,
            width=project["width"],
            height=project["height"],
        )
    except ProjectValidationError as err:
        _error(connection, msg, err)
        return
    except (ProjectComposeError, RendererError, TemplateRenderError) as err:
        LOGGER.warning("Live preview render failed: %s", err)
        connection.send_error(msg["id"], "preview_failed", str(err))
        return
    except Exception as err:  # noqa: BLE001 - WebSocket boundary must return diagnostics
        LOGGER.exception("Unexpected live preview failure")
        connection.send_error(
            msg["id"],
            "preview_failed",
            f"Unexpected preview failure: {err}",
        )
        return
    token = hass.data[DOMAIN].cache.put(rendered.png)
    image_url = RENDER_HTTP_PATH.replace("{token}", token)
    renderer_ms = rendered.timings.get("total", 0.0)
    LOGGER.debug(
        "Rendered live preview project=%s size=%dx%d data=%.2f ms liquid=%.2f ms "
        "compose=%.2f ms renderer=%s pipeline=%.2f ms bytes=%d",
        project.get("id", "unsaved-preview"),
        project["width"],
        project["height"],
        composed.data_ms,
        composed.liquid_ms,
        composed.compose_ms,
        rendered.timings,
        composed.compose_ms + renderer_ms,
        len(rendered.png),
    )
    connection.send_result(
        msg["id"],
        {
            "imageUrl": image_url,
            "timings": {
                "data": composed.data_ms,
                "liquid": composed.liquid_ms,
                "compose": composed.compose_ms,
                "renderer": renderer_ms,
                "pipeline": composed.compose_ms + renderer_ms,
            },
        },
    )


def async_register_commands(hass: HomeAssistant) -> None:
    """Register panel commands once during domain setup."""
    websocket_api.async_register_command(hass, websocket_bootstrap)
    websocket_api.async_register_command(hass, websocket_create_project)
    websocket_api.async_register_command(hass, websocket_update_project)
    websocket_api.async_register_command(hass, websocket_delete_project)
    websocket_api.async_register_command(hass, websocket_compose_preview)
