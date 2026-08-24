"""Home Assistant WebSocket API for the Studio panel."""

from __future__ import annotations

from typing import Any, cast

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .projects import ProjectStore, ProjectValidationError
from .widgets import WIDGET_DEFINITIONS


def _store(hass: HomeAssistant) -> ProjectStore:
    return cast("ProjectStore", hass.data[DOMAIN].projects)


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
        {"projects": _store(hass).list(), "widgets": WIDGET_DEFINITIONS},
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


def async_register_commands(hass: HomeAssistant) -> None:
    """Register panel commands once during domain setup."""
    websocket_api.async_register_command(hass, websocket_bootstrap)
    websocket_api.async_register_command(hass, websocket_create_project)
    websocket_api.async_register_command(hass, websocket_update_project)
    websocket_api.async_register_command(hass, websocket_delete_project)
