"""What a display receives is what the editor shows: the same pixels, only turned."""

from __future__ import annotations

from io import BytesIO
from types import SimpleNamespace
from typing import TYPE_CHECKING, Any

import pytest
from PIL import Image, ImageChops

from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.delivery import (
    async_render_dashboard,
    preview_margin,
)
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import dashboard as dashboard_with

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

RENDERER = OdlRenderService(None, concurrency=1)  # type: ignore[arg-type]
WIDTH = 360
HEIGHT = 184


def text_item(**fields: Any) -> dict[str, Any]:
    primitive = {
        "type": "text",
        "value": "It should work",
        "x": 100,
        "y": 90,
        "size": 23,
        "color": "black",
        "anchor": "lm",
        "font": "ppb.ttf",
        **fields,
    }
    return {
        "id": "label",
        "kind": "primitive",
        "name": "text_1",
        "locked": False,
        "hidden": False,
        "primitive": primitive,
    }


def rectangle_item(**fields: Any) -> dict[str, Any]:
    primitive = {
        "type": "rectangle",
        "x_start": 0,
        "y_start": 0,
        "x_end": 59,
        "y_end": 183,
        "fill": "red",
        "outline": "red",
        "width": 2,
        **fields,
    }
    return {
        "id": "band",
        "kind": "primitive",
        "name": "rectangle_1",
        "locked": False,
        "hidden": False,
        "primitive": primitive,
    }


def dashboard(items: list[dict[str, Any]], rotation: int = 0) -> dict[str, Any]:
    value = dashboard_with(items)
    value["display"] = {
        **value["display"],
        "width": WIDTH,
        "height": HEIGHT,
        "palette": "bwry",
        "rotation": rotation,
    }
    return validate_dashboard(value, DEFAULT_REGISTRY)


def picture(png: bytes) -> Image.Image:
    return Image.open(BytesIO(png)).convert("RGB")


async def shown_in_the_editor(
    hass: HomeAssistant, value: dict[str, Any]
) -> Image.Image:
    """The display as the editor draws it: the picture with its margin cut off."""
    rendered = await async_render_dashboard(
        hass, value, for_device=False, with_margin=True
    )
    margin = preview_margin(value["display"])
    with_margin = picture(rendered.picture.png)
    return with_margin.crop((margin, margin, margin + WIDTH, margin + HEIGHT))


async def received_by_the_display(
    hass: HomeAssistant, value: dict[str, Any]
) -> Image.Image:
    """What the Media Source gives, turned back so it can be set beside the editor's."""
    rendered = await async_render_dashboard(hass, value, for_device=True)
    delivered = picture(rendered.picture.png)
    # The picture was turned clockwise by the dashboard's rotation.
    return delivered.rotate(value["display"]["rotation"], expand=True)


def same_picture(left: Image.Image, right: Image.Image) -> bool:
    """Whether two pictures of one size are the same pixel for pixel."""
    assert left.size == right.size
    return ImageChops.difference(left, right).getbbox() is None


def agenda_item() -> dict[str, Any]:
    return {
        "id": "agenda",
        "kind": "widget",
        "name": "agenda_1",
        "locked": False,
        "hidden": False,
        "widget": {
            "type": "agenda",
            "version": "1.0.0",
            "sources": {"calendars": [{"id": "calendar.family"}]},
            "options": {"maxEvents": 5, "days": 14, "showFrame": False},
        },
        "frame": {"x": 60, "y": 0, "width": 300, "height": 184},
        "layout": {"padding": 0},
    }


CASES = {
    "a text that hangs out to the left, turned upright": [
        rectangle_item(),
        text_item(x=-50, y=92, rotation=-90, color="white"),
    ],
    "a text that hangs out at the top": [text_item(x=100, y=-8, anchor="lm")],
    "a text that hangs out to the right": [text_item(x=300, y=90)],
    "a text that hangs out at the bottom": [text_item(x=20, y=190)],
    "a turned text partly outside": [text_item(x=-30, y=40, rotation=45)],
    "a rectangle that reaches beyond the display": [
        rectangle_item(x_start=-40, y_start=-20, x_end=80, y_end=210)
    ],
    "a text well inside": [text_item()],
    "a band, a text turned upright and a widget": [
        rectangle_item(),
        text_item(x=-50, y=92, size=23, rotation=-90, color="white", align="center"),
        agenda_item(),
    ],
}


@pytest.mark.parametrize("rotation", [0, 90, 180, 270])
@pytest.mark.parametrize("name", list(CASES))
async def test_the_display_receives_what_the_editor_shows(
    hass: HomeAssistant, name: str, rotation: int
) -> None:
    hass.data[DOMAIN] = SimpleNamespace(widgets=DEFAULT_REGISTRY, renderer=RENDERER)
    value = dashboard(CASES[name], rotation)

    editor = await shown_in_the_editor(hass, value)
    display = await received_by_the_display(hass, value)

    assert same_picture(editor, display)
