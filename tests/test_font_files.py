"""The panel shows text in a font by loading its file from the integration."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Any

import odl_renderer
import pytest

from custom_components.opendisplay_studio.http_fonts import FONT_URL, ICON_FONT_URL
from custom_components.opendisplay_studio.icons import (
    ICON_CODEPOINTS,
    ICON_FONT_FILE,
    SORTED_ICON_NAMES,
)

from .test_font_commands import FONT_FILE

if TYPE_CHECKING:
    from collections.abc import Callable, Coroutine

    from homeassistant.auth.models import User
    from homeassistant.core import HomeAssistant

    type Client = Any

ASSETS = Path(odl_renderer.__file__).parent / "assets"


@pytest.fixture
async def installed(served: Any, hass: HomeAssistant) -> None:
    """Install `Mono.ttf`, a copy of a bundled font."""
    await hass.async_add_executor_job(
        served.fonts.install, "Mono.ttf", FONT_FILE.read_bytes()
    )


async def test_an_administrator_gets_the_file_of_an_installed_font(
    installed: None,
    hass_client: Callable[..., Coroutine[Any, Any, Client]],
) -> None:
    client = await hass_client()

    response = await client.get(f"{FONT_URL}/Mono.ttf")

    assert response.status == 200
    assert response.content_type == "font/ttf"
    assert await response.read() == FONT_FILE.read_bytes()


async def test_a_bundled_font_is_given_too(
    served: Any, hass_client: Callable[..., Coroutine[Any, Any, Client]]
) -> None:
    client = await hass_client()

    response = await client.get(f"{FONT_URL}/ppb.ttf")

    assert response.status == 200
    assert await response.read() == (ASSETS / "ppb.ttf").read_bytes()


@pytest.mark.parametrize(
    "name", ["Missing.ttf", "..%2F..%2Fconfiguration.yaml", "notes.txt", "ppb"]
)
async def test_only_a_font_that_exists_is_given(
    served: Any,
    hass_client: Callable[..., Coroutine[Any, Any, Client]],
    name: str,
) -> None:
    client = await hass_client()

    response = await client.get(f"{FONT_URL}/{name}")

    # Home Assistant itself turns away a path that climbs out of the folder, with a 400.
    assert response.status in {400, 404}


async def test_someone_who_is_not_an_administrator_gets_no_font(
    installed: None,
    hass_client: Callable[..., Coroutine[Any, Any, Client]],
    hass_read_only_user: User,
    hass_read_only_access_token: str,
) -> None:
    client = await hass_client(hass_read_only_access_token)

    response = await client.get(f"{FONT_URL}/Mono.ttf")

    assert response.status == 401


async def test_a_request_without_a_login_gets_no_font(
    installed: None,
    hass_client_no_auth: Callable[..., Coroutine[Any, Any, Client]],
) -> None:
    client = await hass_client_no_auth()

    response = await client.get(f"{FONT_URL}/Mono.ttf")

    assert response.status == 401


async def test_an_administrator_gets_the_icon_font(
    served: Any, hass_client: Callable[..., Coroutine[Any, Any, Client]]
) -> None:
    client = await hass_client()

    response = await client.get(ICON_FONT_URL)

    assert response.status == 200
    assert await response.read() == ICON_FONT_FILE.read_bytes()


async def test_the_icon_list_comes_with_the_character_of_every_icon(
    call: Any,
) -> None:
    response = await call("list_icons")

    result = response["result"]
    assert result["icons"] == SORTED_ICON_NAMES
    assert result["glyphs"]["home"] == ICON_CODEPOINTS["home"]
    assert set(result["glyphs"]) == set(SORTED_ICON_NAMES)
