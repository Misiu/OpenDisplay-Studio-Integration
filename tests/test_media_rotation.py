"""The Media Source picture is turned for the display, or kept as designed."""

from __future__ import annotations

from io import BytesIO
from types import SimpleNamespace
from typing import TYPE_CHECKING, Any, cast

import pytest
from homeassistant.components.media_source import MediaSourceItem
from homeassistant.core import ServiceCall
from PIL import Image

from custom_components.opendisplay_studio.cache import RenderCache
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.media_source import (
    OpenDisplayStudioMediaSource,
)
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.validation import DashboardValidationError
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import dashboard as dashboard_with
from .test_rotation import SQUARE, black_corner

if TYPE_CHECKING:
    from collections.abc import Callable, Coroutine

    from homeassistant.core import HomeAssistant

    type Call = Callable[..., Coroutine[Any, Any, dict[str, Any]]]


def design(**display: Any) -> dict[str, Any]:
    """A portrait 480x800 canvas, turned a quarter, with a black square top-left."""
    value = dashboard_with([SQUARE])
    value["display"] = {
        **value["display"],
        "width": 480,
        "height": 800,
        "rotation": 90,
        **display,
    }
    value["status"] = "ready"
    value["id"] = "hall"
    return validate_dashboard(value, DEFAULT_REGISTRY)


def use_media_source(hass: HomeAssistant, dashboard: dict[str, Any]) -> RenderCache:
    cache = RenderCache(ttl_seconds=60, max_items=8)
    store = SimpleNamespace(get=lambda _identifier: dashboard)
    hass.data[DOMAIN] = SimpleNamespace(
        widgets=DEFAULT_REGISTRY,
        renderer=OdlRenderService(cast("Any", None), concurrency=1),
        cache=cache,
        dashboards=store,
    )
    return cache


async def media_picture(hass: HomeAssistant, dashboard: dict[str, Any]) -> bytes:
    cache = use_media_source(hass, dashboard)
    source = OpenDisplayStudioMediaSource(hass)

    media = await source.async_resolve_media(
        MediaSourceItem(hass, DOMAIN, dashboard["id"], None)
    )

    token = media.url.rsplit("/", 1)[-1].removesuffix(".png")
    png = cache.get(token)
    assert png is not None
    return png


class TestTheSetting:
    def test_a_dashboard_is_turned_for_its_display_unless_told_otherwise(self) -> None:
        assert design()["display"]["mediaAsDesigned"] is False

    def test_a_dashboard_can_ask_for_the_picture_as_designed(self) -> None:
        assert design(mediaAsDesigned=True)["display"]["mediaAsDesigned"] is True

    def test_a_dashboard_stored_without_the_setting_is_turned(self) -> None:
        value = dashboard_with([SQUARE])

        assert "mediaAsDesigned" not in value["display"]
        validated = validate_dashboard(value, DEFAULT_REGISTRY)
        assert validated["display"]["mediaAsDesigned"] is False

    @pytest.mark.parametrize("value", ["yes", 1, None])
    def test_only_a_boolean_is_accepted(self, value: Any) -> None:
        with pytest.raises(DashboardValidationError, match="mediaAsDesigned"):
            design(mediaAsDesigned=value)


class TestTheMediaSource:
    async def test_the_picture_is_turned_for_the_display_by_default(
        self, hass: HomeAssistant
    ) -> None:
        png = await media_picture(hass, design())

        assert black_corner(png) == ((800, 480), "top-right")

    async def test_the_picture_keeps_the_orientation_of_the_designer_when_asked(
        self, hass: HomeAssistant
    ) -> None:
        png = await media_picture(hass, design(mediaAsDesigned=True))

        assert black_corner(png) == ((480, 800), "top-left")

    @pytest.mark.parametrize("rotation", [0, 90, 180, 270])
    async def test_as_designed_is_the_same_picture_whatever_the_rotation(
        self, hass: HomeAssistant, rotation: int
    ) -> None:
        png = await media_picture(hass, design(mediaAsDesigned=True, rotation=rotation))

        assert Image.open(BytesIO(png)).size == (480, 800)
        assert black_corner(png)[1] == "top-left"


class TestSendingFromTheDesigner:
    """A picture sent to a device is turned for it, whatever the Media Source gives."""

    @pytest.mark.parametrize(
        "setting", [{"mediaAsDesigned": False}, {"mediaAsDesigned": True}]
    )
    async def test_the_device_gets_the_turned_picture_and_no_further_turn(
        self,
        hass: HomeAssistant,
        call: Call,
        studio: Any,
        setting: dict[str, bool],
    ) -> None:
        calls: list[ServiceCall] = []

        async def upload(service_call: ServiceCall) -> None:
            calls.append(service_call)

        hass.services.async_register("opendisplay", "upload_image", upload)
        dashboard = design(deviceId="device-1", **setting)

        response = await call("send_to_device", dashboard=dashboard)

        assert response["success"]
        [sent] = calls
        assert sent.data["rotation"] == 0
        identifier = sent.data["image"]["media_content_id"]
        token = identifier.rsplit("sent-", 1)[-1]
        png = studio.cache.get(token)
        assert png is not None
        assert black_corner(png) == ((800, 480), "top-right")
