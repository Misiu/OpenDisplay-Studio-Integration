"""Tests for the dynamic Media Source render pipeline."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from homeassistant.components.media_source import MediaSourceItem

from custom_components.opendisplay_studio import OpenDisplayStudioData
from custom_components.opendisplay_studio.cache import RenderCache
from custom_components.opendisplay_studio.composer import ComposedProject
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.media_source import (
    OpenDisplayStudioMediaSource,
)
from custom_components.opendisplay_studio.renderer import RenderResult

PNG = b"\x89PNG\r\n\x1a\n" + b"dynamic"

PROJECT = {
    "id": "kitchen-id",
    "name": "Kitchen",
    "status": "ready",
    "width": 800,
    "height": 480,
}


async def test_resolve_renders_and_publishes_temporary_png(hass) -> None:
    client = SimpleNamespace(
        async_render=AsyncMock(
            return_value=RenderResult(
                png=PNG,
                timings={"total": 49.1},
            )
        )
    )
    entry = SimpleNamespace(
        runtime_data=SimpleNamespace(
            client=client,
            width=800,
            height=480,
        )
    )
    projects = SimpleNamespace(
        get=lambda _project_id: PROJECT, list=lambda **_: [PROJECT]
    )
    hass.data[DOMAIN] = OpenDisplayStudioData(
        cache=RenderCache(ttl_seconds=300, max_items=32), projects=projects
    )
    source = OpenDisplayStudioMediaSource(hass)

    with (
        patch.object(source, "_loaded_entry", return_value=entry),
        patch(
            "custom_components.opendisplay_studio.media_source.async_compose_project",
            AsyncMock(
                return_value=ComposedProject("<main>fresh</main>", 1.0, 2.0, 3.0)
            ),
        ),
    ):
        media = await source.async_resolve_media(
            MediaSourceItem(hass, DOMAIN, "kitchen-id", None)
        )

    assert media.mime_type == "image/png"
    token = media.url.rsplit("/", 1)[-1].removesuffix(".png")
    assert hass.data[DOMAIN].cache.get(token) == PNG
    call = client.async_render.await_args.kwargs
    assert call["width"] == 800
    assert call["height"] == 480
    assert call["html"] == "<main>fresh</main>"


async def test_browse_exposes_ready_projects_only(hass) -> None:
    hass.data[DOMAIN] = SimpleNamespace(
        projects=SimpleNamespace(list=lambda **_: [PROJECT])
    )
    source = OpenDisplayStudioMediaSource(hass)
    media = await source.async_browse_media(MediaSourceItem(hass, DOMAIN, "", None))

    assert [child.title for child in media.children] == ["Kitchen"]
    assert [child.identifier for child in media.children] == ["kitchen-id"]
    assert all(child.can_play for child in media.children)
