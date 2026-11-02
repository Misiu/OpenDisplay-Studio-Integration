"""WebSocket commands that list, install and remove the fonts of the Studio."""

from __future__ import annotations

import binascii
from base64 import b64decode
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .font_usage import dashboards_using
from .fonts import FontError
from .measure import use_font_directories


def _data(hass: HomeAssistant) -> Any:
    return hass.data[DOMAIN]


async def async_describe_fonts(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Return every font with its picture and the dashboards that use it."""
    data = _data(hass)
    infos = await hass.async_add_executor_job(data.fonts.infos)
    dashboards = data.dashboards.list()
    return [
        {
            **info.as_dict(),
            "usedBy": dashboards_using(dashboards, info.name),
        }
        for info in infos
    ]


async def _async_send_fonts(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg_id: int
) -> None:
    use_font_directories(_data(hass).fonts.directories)
    connection.send_result(msg_id, {"fonts": await async_describe_fonts(hass)})


@websocket_api.websocket_command(
    {vol.Required("type"): "opendisplay_studio/list_fonts"}
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_list_fonts(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send every font with its picture and the dashboards that use it."""
    await _async_send_fonts(hass, connection, msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/install_font",
        vol.Required("filename"): str,
        # The bytes of the font file, in base64.
        vol.Required("data"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_install_font(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Check a font file sent in base64 and install it."""
    try:
        content = b64decode(msg["data"], validate=True)
    except binascii.Error:
        connection.send_error(msg["id"], "invalid_font", "The font is not valid base64")
        return
    try:
        await hass.async_add_executor_job(
            _data(hass).fonts.install, msg["filename"], content
        )
    except FontError as err:
        connection.send_error(msg["id"], err.code, str(err))
        return
    await _async_send_fonts(hass, connection, msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/delete_font",
        vol.Required("name"): str,
        # Without `force` a font that dashboards still use is kept.
        vol.Optional("force", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_delete_font(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remove a font; one that dashboards use needs `force`."""
    using = dashboards_using(_data(hass).dashboards.list(), msg["name"])
    if using and not msg["force"]:
        message = f"{msg['name']} is used by {len(using)} dashboard(s)"
        connection.send_error(msg["id"], "font_in_use", message)
        return
    try:
        await hass.async_add_executor_job(_data(hass).fonts.remove, msg["name"])
    except FontError as err:
        connection.send_error(msg["id"], err.code, str(err))
        return
    await _async_send_fonts(hass, connection, msg["id"])


def async_register_font_commands(hass: HomeAssistant) -> None:
    """Register the commands that manage fonts."""
    websocket_api.async_register_command(hass, websocket_list_fonts)
    websocket_api.async_register_command(hass, websocket_install_font)
    websocket_api.async_register_command(hass, websocket_delete_font)
