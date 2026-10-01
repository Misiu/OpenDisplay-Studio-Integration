"""Images of `dlimg` elements come from places Home Assistant is willing to serve."""

from __future__ import annotations

from io import BytesIO
from types import SimpleNamespace
from typing import TYPE_CHECKING, Any
from unittest.mock import AsyncMock, patch

import pytest
from PIL import Image

from custom_components.opendisplay_studio.images import async_load_images

from .test_measure import ink_box, render

if TYPE_CHECKING:
    from pathlib import Path

    from homeassistant.core import HomeAssistant


def png(color: str = "black") -> bytes:
    output = BytesIO()
    Image.new("RGB", (10, 10), color).save(output, format="PNG")
    return output.getvalue()


def image_element(url: str) -> dict[str, Any]:
    return {
        "type": "dlimg",
        "url": url,
        "x": 20,
        "y": 30,
        "xsize": 50,
        "ysize": 40,
        "resize_method": "stretch",
        "rotate": 0,
    }


async def load(hass: HomeAssistant, url: str) -> tuple[list[dict[str, Any]], list[str]]:
    warnings: list[str] = []
    loaded = await async_load_images(hass, [image_element(url)], warnings)
    return loaded, warnings


async def test_a_media_file_is_drawn_where_the_image_is_placed(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    (tmp_path / "logo.png").write_bytes(png())
    hass.config.media_dirs = {"local": str(tmp_path)}
    hass.config.allowlist_external_dirs = {str(tmp_path)}

    loaded, warnings = await load(hass, "/media/local/logo.png")

    assert warnings == []
    assert ink_box(await render(loaded)) == (20, 30, 70, 70)


async def test_a_camera_entity_is_drawn_from_its_current_picture(
    hass: HomeAssistant,
) -> None:
    picture = SimpleNamespace(content=png())
    with patch(
        "homeassistant.components.camera.async_get_image",
        AsyncMock(return_value=picture),
    ):
        loaded, warnings = await load(hass, "camera.door")

    assert warnings == []
    assert ink_box(await render(loaded)) == (20, 30, 70, 70)


@pytest.mark.parametrize(
    "url",
    [
        "/media/local/../secret.png",
        "/etc/passwd",
        "/config/secrets.yaml",
        "logo.png",
        "/media/other/logo.png",
        "/local/missing.png",
    ],
)
async def test_sources_outside_the_served_folders_are_reported_not_drawn(
    hass: HomeAssistant, tmp_path: Path, url: str
) -> None:
    (tmp_path / "secret.png").write_bytes(png())
    hass.config.media_dirs = {"local": str(tmp_path / "media")}
    (tmp_path / "media").mkdir()

    loaded, warnings = await load(hass, url)

    assert loaded == []
    assert len(warnings) == 1
    assert url in warnings[0]


async def test_web_addresses_are_left_for_the_renderer_to_fetch(
    hass: HomeAssistant,
) -> None:
    loaded, warnings = await load(hass, "https://example.org/cover.png")

    assert warnings == []
    assert loaded[0]["url"] == "https://example.org/cover.png"


async def test_other_elements_pass_through_untouched(hass: HomeAssistant) -> None:
    text = {"type": "text", "value": "a", "x": 1, "y": 2}

    assert await async_load_images(hass, [text], []) == [text]
