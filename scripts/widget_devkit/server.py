"""
The preview server: a page that draws a widget in every state at every size.

Every request loads the widget packages again from their files, so an edit to
`renderer.py`, `widget.yml`, `states.yml` or `preview.yml` shows up as soon as the page
refreshes. The page learns about edits from the `/events` stream, which reports
whenever one of those files changes.
"""

from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

from aiohttp import web

from scripts.widget_devkit.scenario import (
    PreviewSize,
    context_for,
    draw,
    load_preview,
    load_registry,
    load_states,
    png_bytes,
    with_options,
)

PAGE = Path(__file__).with_name("page.html")
WATCHED_SUFFIXES = {".py", ".yml", ".json"}
WATCH_INTERVAL = 0.5
ROOT_KEY = web.AppKey("widgets_root", Path)


def _snapshot(root: Path) -> dict[str, float]:
    """Return the modification time of every file that changes what is drawn."""
    return {
        str(path): path.stat().st_mtime
        for path in root.rglob("*")
        if path.is_file() and path.suffix in WATCHED_SUFFIXES
    }


def _folder(root: Path, widget_id: str) -> Path:
    return root / widget_id.replace("-", "_")


async def _index(_request: web.Request) -> web.FileResponse:
    return web.FileResponse(PAGE)


async def _widgets(request: web.Request) -> web.Response:
    registry = load_registry(request.app[ROOT_KEY])
    return web.json_response(
        {
            "widgets": [
                {"id": definition["id"], "name": definition["name"]}
                for definition in registry.definitions()
            ],
            "errors": [error.as_dict() for error in registry.errors],
        }
    )


async def _widget(request: web.Request) -> web.Response:
    root = request.app[ROOT_KEY]
    widget_id = request.match_info["widget_id"]
    registry = load_registry(root)
    if widget_id not in registry.widget_types:
        raise web.HTTPNotFound
    folder = _folder(root, widget_id)
    preview = load_preview(folder)
    body = {
        "definition": next(
            definition
            for definition in registry.definitions()
            if definition["id"] == widget_id
        ),
        "states": load_states(folder),
        "palette": preview.palette,
        "sizes": [_size_json(size) for size in preview.sizes],
    }
    return web.Response(
        text=json.dumps(body, default=str), content_type="application/json"
    )


def _size_json(size: PreviewSize) -> dict[str, Any]:
    """Return a size as the page needs it."""
    return {"name": size.name, "width": size.width, "height": size.height}


async def _render(request: web.Request) -> web.Response:
    root = request.app[ROOT_KEY]
    request_body = await request.json()
    widget_id = request_body["widget"]
    registry = load_registry(root)
    try:
        context = context_for(
            registry,
            widget_id,
            with_options(request_body["state"], request_body["options"]),
            (request_body["width"], request_body["height"]),
            request_body["palette"],
        )
        image, _ = await asyncio.to_thread(
            _draw_blocking, context, registry.renderer(widget_id)
        )
    except Exception as error:  # noqa: BLE001 - the page shows what the author got wrong
        return web.json_response(
            {"error": f"{type(error).__name__}: {error}"}, status=422
        )
    return web.Response(body=png_bytes(image), content_type="image/png")


def _draw_blocking(context: Any, renderer: Any) -> tuple[Any, list[dict[str, Any]]]:
    return asyncio.run(draw(context, renderer))


async def _events(request: web.Request) -> web.StreamResponse:
    response = web.StreamResponse(headers={"Content-Type": "text/event-stream"})
    await response.prepare(request)
    root = request.app[ROOT_KEY]
    seen = await asyncio.to_thread(_snapshot, root)
    while True:
        await asyncio.sleep(WATCH_INTERVAL)
        current = await asyncio.to_thread(_snapshot, root)
        if current != seen:
            seen = current
            await response.write(b"data: changed\n\n")


def create_app(widgets_root: Path) -> web.Application:
    """Return the preview application serving the widgets under `widgets_root`."""
    app = web.Application()
    app[ROOT_KEY] = widgets_root
    app.add_routes(
        [
            web.get("/", _index),
            web.get("/api/widgets", _widgets),
            web.get("/api/widgets/{widget_id}", _widget),
            web.post("/api/render", _render),
            web.get("/events", _events),
        ]
    )
    return app
