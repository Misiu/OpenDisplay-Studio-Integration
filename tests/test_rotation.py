"""A dashboard is designed on its canvas and sent turned to the display's own size."""

from __future__ import annotations

from io import BytesIO
from types import SimpleNamespace
from typing import TYPE_CHECKING, Any, cast

import pytest
from homeassistant.components.media_source import MediaSourceItem, Unresolvable
from homeassistant.core import ServiceCall
from PIL import Image

from custom_components.opendisplay_studio.cache import RenderCache
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.delivery import async_render_dashboard
from custom_components.opendisplay_studio.devices import async_send_to_device
from custom_components.opendisplay_studio.media_source import (
    OpenDisplayStudioMediaSource,
)
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.validation import DashboardValidationError
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import dashboard as dashboard_with

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

SQUARE = {
    "id": "square",
    "kind": "primitive",
    "primitive": {
        "type": "rectangle",
        "x_start": 0,
        "y_start": 0,
        "x_end": 39,
        "y_end": 39,
        "fill": "black",
    },
}


def design(**display: Any) -> dict[str, Any]:
    """A portrait 480x800 canvas with a black square in its top-left corner."""
    value = dashboard_with([SQUARE])
    value["display"] = {**value["display"], "width": 480, "height": 800, **display}
    return validate_dashboard(value, DEFAULT_REGISTRY)


def use_services(hass: HomeAssistant) -> None:
    hass.data[DOMAIN] = SimpleNamespace(
        widgets=DEFAULT_REGISTRY,
        renderer=OdlRenderService(cast("Any", None), concurrency=1),
        cache=RenderCache(ttl_seconds=60, max_items=8),
    )


def black_corner(png: bytes) -> tuple[tuple[int, int], str]:
    """Return the size of the picture and which corner holds the black square."""
    with Image.open(BytesIO(png)) as image:
        corners = {
            "top-left": (2, 2),
            "top-right": (image.width - 3, 2),
            "bottom-left": (2, image.height - 3),
            "bottom-right": (image.width - 3, image.height - 3),
        }
        black = [
            name
            for name, point in corners.items()
            if image.convert("RGB").getpixel(point) == (0, 0, 0)
        ]
        assert len(black) == 1
        return image.size, black[0]


class TestValidation:
    @pytest.mark.parametrize("rotation", [0, 90, 180, 270])
    def test_the_four_quarter_turns_are_accepted(self, rotation: int) -> None:
        assert design(rotation=rotation)["display"]["rotation"] == rotation

    @pytest.mark.parametrize("rotation", [45, -90, 360, "90", True, None])
    def test_other_turns_are_rejected(self, rotation: Any) -> None:
        with pytest.raises(DashboardValidationError, match="rotation"):
            design(rotation=rotation)

    def test_a_dashboard_is_not_turned_and_has_no_device_unless_told(self) -> None:
        display = design()["display"]

        assert display["rotation"] == 0
        assert display["deviceId"] is None

    def test_a_dashboard_remembers_the_device_it_is_made_for(self) -> None:
        assert design(deviceId="abc123")["display"]["deviceId"] == "abc123"

    def test_a_device_id_is_text(self) -> None:
        with pytest.raises(DashboardValidationError, match="deviceId"):
            design(deviceId=5)


class TestTurningThePicture:
    @pytest.mark.parametrize(
        ("rotation", "size", "corner"),
        [
            (0, (480, 800), "top-left"),
            (90, (800, 480), "top-right"),
            (180, (480, 800), "bottom-right"),
            (270, (800, 480), "bottom-left"),
        ],
    )
    async def test_the_picture_for_a_device_is_turned_clockwise(
        self,
        hass: HomeAssistant,
        rotation: int,
        size: tuple[int, int],
        corner: str,
    ) -> None:
        use_services(hass)

        rendered = await async_render_dashboard(
            hass, design(rotation=rotation), for_device=True
        )

        assert black_corner(rendered.picture.png) == (size, corner)

    async def test_the_editor_picture_shows_what_hangs_out_of_the_display(
        self, hass: HomeAssistant
    ) -> None:
        use_services(hass)
        hanging = design()
        hanging["items"][0]["primitive"]["x_start"] = -30
        hanging["items"][0]["primitive"]["x_end"] = 9

        rendered = await async_render_dashboard(
            hass, hanging, for_device=False, with_margin=True
        )

        margin = rendered.margin
        assert margin == 192
        with Image.open(BytesIO(rendered.picture.png)) as picture:
            assert picture.size == (480 + 2 * margin, 800 + 2 * margin)
            pixels = picture.convert("RGB")
            # The square starts 30 px left of the display: black there, white beyond it.
            assert pixels.getpixel((margin - 20, margin + 5)) == (0, 0, 0)
            assert pixels.getpixel((margin - 40, margin + 5)) == (255, 255, 255)
            # The empty margin lets the backdrop through; the display is opaque.
            assert picture.getpixel((margin - 40, margin + 5))[3] == 0
            assert picture.getpixel((margin - 20, margin + 5))[3] == 255
            assert picture.getpixel((margin + 100, margin + 100))[3] == 255

    async def test_the_media_picture_has_no_margin(self, hass: HomeAssistant) -> None:
        use_services(hass)

        rendered = await async_render_dashboard(hass, design(), for_device=False)

        assert rendered.margin == 0
        with Image.open(BytesIO(rendered.picture.png)) as picture:
            assert picture.size == (480, 800)

    async def test_the_editor_always_shows_the_canvas_as_designed(
        self, hass: HomeAssistant
    ) -> None:
        use_services(hass)

        rendered = await async_render_dashboard(
            hass, design(rotation=90), for_device=False
        )

        assert black_corner(rendered.picture.png) == ((480, 800), "top-left")


class TestSending:
    async def test_the_turned_picture_is_handed_to_the_upload_service(
        self, hass: HomeAssistant
    ) -> None:
        use_services(hass)
        calls: list[ServiceCall] = []

        async def upload(call: ServiceCall) -> None:
            calls.append(call)

        hass.services.async_register("opendisplay", "upload_image", upload)

        await async_send_to_device(hass, "device-1", b"png-bytes")

        [call] = calls
        assert call.data["device_id"] == "device-1"
        assert call.data["rotation"] == 0
        identifier = call.data["image"]["media_content_id"]
        assert identifier.startswith("media-source://opendisplay_studio/sent-")

    async def test_the_media_source_serves_a_picture_that_was_sent(
        self, hass: HomeAssistant
    ) -> None:
        use_services(hass)
        token = hass.data[DOMAIN].cache.put(b"png-bytes")
        source = OpenDisplayStudioMediaSource(hass)

        media = await source.async_resolve_media(
            MediaSourceItem(hass, DOMAIN, f"sent-{token}", None)
        )

        assert media.url == f"/api/opendisplay_studio/render/{token}.png"
        assert media.mime_type == "image/png"

    async def test_a_picture_that_is_gone_cannot_be_resolved(
        self, hass: HomeAssistant
    ) -> None:
        use_services(hass)
        source = OpenDisplayStudioMediaSource(hass)

        with pytest.raises(Unresolvable):
            await source.async_resolve_media(
                MediaSourceItem(hass, DOMAIN, "sent-unknown", None)
            )
