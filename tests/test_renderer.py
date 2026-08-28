"""Tests for the Renderer HTTP client."""

import pytest
from aiohttp import ClientSession, web

from custom_components.opendisplay_studio.renderer import (
    RendererClient,
    RendererIncompatibleError,
)

PNG = b"\x89PNG\r\n\x1a\n" + b"poc"


async def test_health_and_raw_png_with_timings(aiohttp_server, socket_enabled) -> None:
    app = web.Application()

    async def health(_request):
        return web.json_response(
            {
                "status": "ok",
                "version": "0.6.0",
                "apiVersion": 2,
                "trmnlFrameworkVersion": "3.2.0",
            }
        )

    async def render(request):
        assert request.headers["Authorization"] == "Bearer secret"
        assert await request.json() == {
            "html": "<div>test</div>",
            "width": 800,
            "height": 480,
            "allowedAssetOrigins": ["https://cdn.example.com"],
        }
        return web.Response(
            body=PNG,
            content_type="image/png",
            headers={
                "X-ODX-Queue-Time": "0.4",
                "X-ODX-DOM-Time": "2.8",
                "X-ODX-Layout-Time": "14.7",
                "X-ODX-Screenshot-Time": "71.2",
                "X-ODX-Render-Time": "89.1",
            },
        )

    app.router.add_get("/health", health)
    app.router.add_post("/render", render)
    server = await aiohttp_server(app)
    async with ClientSession() as session:
        client = RendererClient(session, str(server.make_url("/")), "secret")
        assert await client.async_health() == {
            "status": "ok",
            "version": "0.6.0",
            "apiVersion": 2,
            "trmnlFrameworkVersion": "3.2.0",
        }
        result = await client.async_render(
            html="<div>test</div>",
            width=800,
            height=480,
            allowed_asset_origins=("https://cdn.example.com",),
        )
    assert result.png == PNG
    assert result.timings == {
        "queue": 0.4,
        "dom": 2.8,
        "layout": 14.7,
        "screenshot": 71.2,
        "total": 89.1,
    }


async def test_health_rejects_incompatible_api(aiohttp_server, socket_enabled) -> None:
    app = web.Application()

    async def incompatible_health(_request):
        return web.json_response(
            {
                "status": "ok",
                "version": "9.0.0",
                "apiVersion": 9,
                "trmnlFrameworkVersion": "3.2.0",
            }
        )

    app.router.add_get("/health", incompatible_health)
    server = await aiohttp_server(app)
    async with ClientSession() as session:
        client = RendererClient(session, str(server.make_url("/")))
        with pytest.raises(RendererIncompatibleError):
            await client.async_health()


@pytest.mark.parametrize(
    ("version", "framework_version"),
    [
        ("0.4.9", "3.2.0"),
        ("0.5.0-dev", "3.2.0"),
        ("0.5.1", "3.2.0"),
        ("0.5.0", "3.1.0"),
    ],
)
async def test_health_rejects_incompatible_renderer_or_framework(
    aiohttp_server,
    socket_enabled,
    version: str,
    framework_version: str,
) -> None:
    app = web.Application()

    async def incompatible_health(_request):
        return web.json_response(
            {
                "status": "ok",
                "version": version,
                "apiVersion": 2,
                "trmnlFrameworkVersion": framework_version,
            }
        )

    app.router.add_get("/health", incompatible_health)
    server = await aiohttp_server(app)
    async with ClientSession() as session:
        client = RendererClient(session, str(server.make_url("/")))
        with pytest.raises(RendererIncompatibleError):
            await client.async_health()
