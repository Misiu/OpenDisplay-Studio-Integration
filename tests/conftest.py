"""Fixtures shared by the tests that need the integration set up."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Any

import pytest
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.setup import async_setup_component

from custom_components.opendisplay_studio import OpenDisplayStudioData
from custom_components.opendisplay_studio.cache import RenderCache
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.dashboards import DashboardStore
from custom_components.opendisplay_studio.fonts import (
    BUNDLED_FONTS,
    FONT_FOLDER,
    FontLibrary,
)
from custom_components.opendisplay_studio.http_fonts import (
    FontFileView,
    IconFontView,
)
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.websocket import async_register_commands
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

if TYPE_CHECKING:
    from collections.abc import Callable, Coroutine

    from homeassistant.core import HomeAssistant

    type Client = Any


def remove_installed_fonts(library: FontLibrary) -> None:
    for name in library.names():
        if name not in BUNDLED_FONTS:
            library.remove(name)


@pytest.fixture
async def studio(hass: HomeAssistant) -> OpenDisplayStudioData:
    """The integration's data with no installed fonts and no dashboards."""
    library = FontLibrary(Path(hass.config.path(*FONT_FOLDER)))
    await hass.async_add_executor_job(remove_installed_fonts, library)
    renderer = OdlRenderService(
        async_get_clientsession(hass), font_dirs=library.directories
    )
    data = OpenDisplayStudioData(
        cache=RenderCache(ttl_seconds=1, max_items=1),
        dashboards=DashboardStore(hass, DEFAULT_REGISTRY),
        fonts=library,
        renderer=renderer,
        widgets=DEFAULT_REGISTRY,
    )
    await data.dashboards.async_load()
    hass.data[DOMAIN] = data
    async_register_commands(hass)
    return data


@pytest.fixture
async def call(
    studio: OpenDisplayStudioData,
    hass_ws_client: Callable[..., Coroutine[Any, Any, Client]],
) -> Callable[..., Coroutine[Any, Any, dict[str, Any]]]:
    client = await hass_ws_client()

    async def send(command: str, **fields: Any) -> dict[str, Any]:
        await client.send_json_auto_id(
            {"type": f"opendisplay_studio/{command}", **fields}
        )
        response: dict[str, Any] = await client.receive_json()
        return response

    return send


@pytest.fixture
async def served(
    studio: OpenDisplayStudioData, hass: HomeAssistant
) -> OpenDisplayStudioData:
    """The integration with its pages served, for tests that ask for one."""
    await async_setup_component(hass, "http", {})
    hass.http.register_view(FontFileView(hass))
    hass.http.register_view(IconFontView(hass))
    return studio
