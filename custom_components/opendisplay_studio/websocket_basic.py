"""The WebSocket command that gives the panel the geometry of a basic layout."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .basic_layout import grid_cells, region_frame, validate_layout, working_area
from .validation import DashboardValidationError


@websocket_api.websocket_command(
    {
        vol.Required("type"): "opendisplay_studio/layout_frames",
        vol.Required("width"): vol.All(int, vol.Range(min=64, max=4096)),
        vol.Required("height"): vol.All(int, vol.Range(min=64, max=4096)),
        vol.Required("padding"): vol.All(int, vol.Range(min=0, max=1024)),
        vol.Required("layout"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def websocket_layout_frames(
    _hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """
    Return where the cells and the regions of a layout are on the display.

    The panel draws the layout from these boxes and never lays a grid out itself, so
    what it shows is what the renderer will draw.
    """
    try:
        layout = validate_layout(msg["layout"])
    except DashboardValidationError as err:
        connection.send_error(msg["id"], "invalid_layout", str(err))
        return
    area = working_area(msg["width"], msg["height"], msg["padding"])
    columns = layout["columns"]
    cells = grid_cells(area, columns, layout["rows"], layout["gap"])
    connection.send_result(
        msg["id"],
        {
            "cells": [
                {"x": cell.x, "y": cell.y, "width": cell.width, "height": cell.height}
                for cell in cells
            ],
            "regions": [
                {"id": region["id"], **region_frame(cells, columns, region)}
                for region in layout["regions"]
            ],
        },
    )


def async_register_basic_commands(hass: HomeAssistant) -> None:
    """Register the commands of the basic editor."""
    websocket_api.async_register_command(hass, websocket_layout_frames)
