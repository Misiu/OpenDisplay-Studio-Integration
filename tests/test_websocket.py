"""Tests for the live designer WebSocket boundary."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

from custom_components.opendisplay_studio.cache import RenderCache
from custom_components.opendisplay_studio.composer import ComposedProject
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.renderer import (
    RendererResponseError,
    RenderResult,
)
from custom_components.opendisplay_studio.websocket import (
    async_register_commands,
    websocket_compose_preview,
)

PNG = b"\x89PNG\r\n\x1a\n" + b"preview"

PROJECT = {
    "id": "preview-id",
    "width": 800,
    "height": 480,
}


async def test_preview_uses_renderer_and_returns_cached_png(hass) -> None:
    """The designer must show the exact Renderer output, not browser HTML."""
    cache = RenderCache(ttl_seconds=300, max_items=32)
    hass.data[DOMAIN] = SimpleNamespace(cache=cache)
    connection = Mock()
    client = SimpleNamespace(
        async_render=AsyncMock(
            return_value=RenderResult(
                png=PNG,
                timings={"total": 41.5},
            )
        )
    )

    with (
        patch(
            "custom_components.opendisplay_studio.websocket.validate_project",
            return_value=PROJECT,
        ),
        patch(
            "custom_components.opendisplay_studio.websocket.async_compose_project",
            AsyncMock(
                return_value=ComposedProject("<main>same-html</main>", 1.0, 2.0, 3.0)
            ),
        ),
        patch(
            "custom_components.opendisplay_studio.websocket._renderer_client",
            return_value=client,
        ),
    ):
        await websocket_compose_preview.__wrapped__.__wrapped__(
            hass,
            connection,
            {"id": 7, "project": {}},
        )

    client.async_render.assert_awaited_once_with(
        html="<main>same-html</main>",
        width=800,
        height=480,
    )
    connection.send_error.assert_not_called()
    result = connection.send_result.call_args.args[1]
    assert "html" not in result
    assert result["imageUrl"].startswith("/api/opendisplay_studio/render/")
    token = result["imageUrl"].rsplit("/", 1)[-1].removesuffix(".png")
    assert cache.get(token) == PNG
    assert result["timings"] == {
        "data": 1.0,
        "liquid": 2.0,
        "compose": 3.0,
        "renderer": 41.5,
        "pipeline": 44.5,
    }


async def test_preview_exposes_renderer_failure(hass) -> None:
    """A missing asset or Renderer error must be visible instead of silently wrong."""
    hass.data[DOMAIN] = SimpleNamespace(
        cache=RenderCache(ttl_seconds=300, max_items=32)
    )
    connection = Mock()
    client = SimpleNamespace(
        async_render=AsyncMock(side_effect=RendererResponseError("asset failed"))
    )

    with (
        patch(
            "custom_components.opendisplay_studio.websocket.validate_project",
            return_value=PROJECT,
        ),
        patch(
            "custom_components.opendisplay_studio.websocket.async_compose_project",
            AsyncMock(
                return_value=ComposedProject("<main>same-html</main>", 1.0, 2.0, 3.0)
            ),
        ),
        patch(
            "custom_components.opendisplay_studio.websocket._renderer_client",
            return_value=client,
        ),
    ):
        await websocket_compose_preview.__wrapped__.__wrapped__(
            hass,
            connection,
            {"id": 8, "project": {}},
        )

    connection.send_result.assert_not_called()
    connection.send_error.assert_called_once_with(
        8,
        "preview_failed",
        "asset failed",
    )


async def test_preview_command_round_trip_uses_renderer(hass, hass_ws_client) -> None:
    """Exercise the registered command through Home Assistant's WebSocket server."""
    cache = RenderCache(ttl_seconds=300, max_items=32)
    hass.data[DOMAIN] = SimpleNamespace(cache=cache)
    client = SimpleNamespace(
        async_render=AsyncMock(
            return_value=RenderResult(png=PNG, timings={"total": 41.5})
        )
    )
    websocket = await hass_ws_client(hass)
    async_register_commands(hass)

    with (
        patch(
            "custom_components.opendisplay_studio.websocket.validate_project",
            return_value=PROJECT,
        ),
        patch(
            "custom_components.opendisplay_studio.websocket.async_compose_project",
            AsyncMock(
                return_value=ComposedProject("<main>same-html</main>", 1.0, 2.0, 3.0)
            ),
        ),
        patch(
            "custom_components.opendisplay_studio.websocket._renderer_client",
            return_value=client,
        ),
    ):
        await websocket.send_json_auto_id(
            {"type": "opendisplay_studio/compose_preview", "project": {}}
        )
        response = await websocket.receive_json()

    assert response["success"] is True
    assert response["result"]["imageUrl"].startswith("/api/opendisplay_studio/render/")
    assert response["result"]["timings"]["pipeline"] == 44.5
