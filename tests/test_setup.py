"""Home Assistant starts the integration: it sets up, serves its panel and fonts."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import pytest
from homeassistant.setup import async_setup_component

from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.fonts import BUNDLED_FONTS, FONT_FOLDER
from custom_components.opendisplay_studio.http_fonts import FONT_URL, ICON_FONT_URL

if TYPE_CHECKING:
    from collections.abc import Callable, Coroutine

    from homeassistant.core import HomeAssistant

    type Client = Any


@pytest.mark.usefixtures("enable_custom_integrations")
async def test_the_integration_sets_up_with_the_panel_and_the_font_folder(
    hass: HomeAssistant,
) -> None:
    assert await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "frontend", {})

    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    data = hass.data[DOMAIN]
    assert data.fonts.names()[: len(BUNDLED_FONTS)] == list(BUNDLED_FONTS)
    assert hass.config.path(*FONT_FOLDER) in data.fonts.directories
    assert "opendisplay-studio" in hass.data["frontend_panels"]


@pytest.mark.usefixtures("enable_custom_integrations")
async def test_after_setup_the_panel_gets_every_font_and_the_icon_font(
    hass: HomeAssistant,
    hass_client: Callable[..., Coroutine[Any, Any, Client]],
) -> None:
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()
    client = await hass_client()

    for name in BUNDLED_FONTS:
        response = await client.get(f"{FONT_URL}/{name}")
        assert response.status == 200, name
        assert len(await response.read()) > 10_000, name
    assert (await client.get(ICON_FONT_URL)).status == 200
