"""The debug grid starts at the display's top-left corner, not at its editor margin."""

from __future__ import annotations

from io import BytesIO
from typing import TYPE_CHECKING, Any

from PIL import Image

from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.delivery import async_render_dashboard
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import dashboard as dashboard_with
from .test_rotation import use_services

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

BLACK = (0, 0, 0, 255)
GRID = {"id": "grid", "kind": "primitive", "primitive": {"type": "debug_grid"}}


def grid_dashboard(**primitive: Any) -> dict[str, Any]:
    """A 480x800 canvas with only a debug grid on it."""
    item = {**GRID, "primitive": {**GRID["primitive"], **primitive}}
    value = dashboard_with([item])
    value["display"] = {**value["display"], "width": 480, "height": 800}
    return validate_dashboard(value, DEFAULT_REGISTRY)


async def edited_picture(
    hass: HomeAssistant, dashboard: dict[str, Any]
) -> tuple[Image.Image, int]:
    """Render the editor's picture, which has a margin around the display."""
    use_services(hass)
    rendered = await async_render_dashboard(
        hass, dashboard, for_device=False, with_margin=True
    )
    return Image.open(BytesIO(rendered.picture.png)).convert("RGBA"), rendered.margin


class TestDebugGridInTheEditor:
    async def test_the_grid_starts_at_the_corner_of_the_display(
        self, hass: HomeAssistant
    ) -> None:
        picture, margin = await edited_picture(
            hass, grid_dashboard(dashed=False, show_labels=False)
        )

        assert picture.getpixel((margin, margin + 100)) == BLACK
        assert picture.getpixel((margin + 100, margin)) == BLACK

    async def test_nothing_is_drawn_in_the_margin(self, hass: HomeAssistant) -> None:
        picture, margin = await edited_picture(
            hass, grid_dashboard(dashed=False, show_labels=False)
        )

        assert picture.getpixel((margin - 20, margin + 100))[3] == 0
        assert picture.getpixel((margin + 100, margin - 20))[3] == 0
        assert picture.getpixel((margin - 1, margin + 100))[3] == 0

    async def test_lines_are_one_spacing_apart_from_the_corner(
        self, hass: HomeAssistant
    ) -> None:
        picture, margin = await edited_picture(
            hass, grid_dashboard(spacing=50, dashed=False, show_labels=False)
        )

        for offset in (0, 50, 100, 150):
            assert picture.getpixel((margin + offset, margin + 300)) == BLACK
        assert picture.getpixel((margin + 25, margin + 325))[:3] == (255, 255, 255)

    async def test_the_labels_are_the_coordinates_of_the_display(
        self, hass: HomeAssistant
    ) -> None:
        picture, margin = await edited_picture(
            hass, grid_dashboard(spacing=100, label_step=100)
        )

        label_area = picture.crop((margin + 102, margin + 2, margin + 140, margin + 16))
        assert BLACK in set(label_area.getdata())
        margin_area = picture.crop((margin - 40, margin - 20, margin - 2, margin - 2))
        assert {pixel[3] for pixel in margin_area.getdata()} == {0}
