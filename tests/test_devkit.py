"""The widget devkit: what the preview server and the render command produce."""

from __future__ import annotations

import io
from pathlib import Path

import pytest
from aiohttp.test_utils import TestClient, TestServer
from PIL import Image

from custom_components.opendisplay_studio.widgets import BUILTIN_WIDGET_DIRECTORY
from scripts.widget_devkit.__main__ import main
from scripts.widget_devkit.scenario import load_states
from scripts.widget_devkit.server import create_app

AGENDA = BUILTIN_WIDGET_DIRECTORY / "agenda"


@pytest.mark.usefixtures("socket_enabled")
async def test_the_server_draws_a_state_at_the_asked_size() -> None:
    state = load_states(AGENDA)["ten-events"]
    async with TestClient(TestServer(create_app(BUILTIN_WIDGET_DIRECTORY))) as client:
        response = await client.post(
            "/api/render",
            json={
                "widget": "agenda",
                "state": state,
                "width": 300,
                "height": 200,
                "palette": "bw",
                "options": {"showFrame": False},
            },
        )

        assert response.status == 200
        picture = Image.open(io.BytesIO(await response.read()))
    assert picture.size == (300, 200)


@pytest.mark.usefixtures("socket_enabled")
async def test_the_server_says_what_is_wrong_with_a_state() -> None:
    async with TestClient(TestServer(create_app(BUILTIN_WIDGET_DIRECTORY))) as client:
        response = await client.post(
            "/api/render",
            json={
                "widget": "agenda",
                "state": {"language": "en"},
                "width": 300,
                "height": 200,
                "palette": "bw",
                "options": {},
            },
        )

        assert response.status == 422
        assert "KeyError" in (await response.json())["error"]


@pytest.mark.usefixtures("socket_enabled")
async def test_the_server_lists_states_and_sizes_of_a_widget() -> None:
    async with TestClient(TestServer(create_app(BUILTIN_WIDGET_DIRECTORY))) as client:
        response = await client.get("/api/widgets/agenda")

        body = await response.json()
    assert {"empty", "one-event", "ten-events"} <= set(body["states"])
    assert {"width": 800, "height": 480, "name": "full"} in body["sizes"]


def test_render_writes_every_state_at_every_size(tmp_path: Path) -> None:
    main(["render", "--widget", "agenda", "--out", str(tmp_path)])

    written = {path.name for path in (tmp_path / "agenda").glob("*.png")}
    assert "ten-events-full.png" in written
    assert "empty-half-horizontal.png" in written
