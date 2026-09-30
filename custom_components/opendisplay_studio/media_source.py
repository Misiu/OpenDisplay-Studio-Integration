"""Expose Ready OpenDisplay Studio dashboards as dynamic image Media Sources."""

from __future__ import annotations

from time import monotonic
from typing import override

from homeassistant.components.media_player import BrowseError, MediaClass, MediaType
from homeassistant.components.media_source import (
    BrowseMediaSource,
    MediaSource,
    MediaSourceItem,
    PlayMedia,
    Unresolvable,
)
from homeassistant.core import HomeAssistant

from .compiler import DashboardCompileError, async_compile_dashboard
from .const import DOMAIN, LOGGER
from .palette import accent_color_for_palette
from .rendering import OdlRenderError


async def async_get_media_source(hass: HomeAssistant) -> OpenDisplayStudioMediaSource:
    return OpenDisplayStudioMediaSource(hass)


class OpenDisplayStudioMediaSource(MediaSource):
    """Render one authoritative PNG for every Ready dashboard."""

    name = "OpenDisplay Studio"

    def __init__(self, hass: HomeAssistant) -> None:
        super().__init__(DOMAIN)
        self.hass = hass

    @override
    async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
        dashboard = self.hass.data[DOMAIN].dashboards.get(item.identifier)
        if dashboard is None or dashboard["status"] != "ready":
            raise Unresolvable("Unknown or Draft OpenDisplay Studio dashboard")
        started = monotonic()
        try:
            compiled = await async_compile_dashboard(
                self.hass, dashboard, self.hass.data[DOMAIN].widgets
            )
            display = dashboard["display"]
            rendered = await self.hass.data[DOMAIN].renderer.async_render(
                width=display["width"],
                height=display["height"],
                elements=compiled.elements,
                background=display["background"],
                accent_color=accent_color_for_palette(display["palette"]),
            )
        except (DashboardCompileError, OdlRenderError) as err:
            LOGGER.error("Could not render %s: %s", item.identifier, err)
            raise Unresolvable(
                translation_domain=DOMAIN, translation_key="render_failed"
            ) from err
        pipeline_ms = round((monotonic() - started) * 1000, 2)
        LOGGER.info(
            "Rendered Media Source dashboard=%s size=%dx%d queue=%.2f ms data=%.2f ms "
            "compile=%.2f ms render=%.2f ms encode=%.2f ms pipeline=%.2f ms",
            item.identifier,
            display["width"],
            display["height"],
            rendered.timings["queue"],
            compiled.data_ms,
            compiled.compile_ms,
            rendered.timings["render"],
            rendered.timings["encode"],
            pipeline_ms,
        )
        token = self.hass.data[DOMAIN].cache.put(rendered.png)
        return PlayMedia(f"/api/opendisplay_studio/render/{token}.png", "image/png")

    @override
    async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
        if item.identifier:
            raise BrowseError("Unknown OpenDisplay Studio directory")
        return BrowseMediaSource(
            domain=DOMAIN,
            identifier=None,
            media_class=MediaClass.APP,
            media_content_type=MediaType.APP,
            title=self.name,
            can_play=False,
            can_expand=True,
            children_media_class=MediaClass.IMAGE,
            children=[
                BrowseMediaSource(
                    domain=DOMAIN,
                    identifier=dashboard["id"],
                    media_class=MediaClass.IMAGE,
                    media_content_type="image/png",
                    title=dashboard["name"],
                    can_play=True,
                    can_expand=False,
                )
                for dashboard in self.hass.data[DOMAIN].dashboards.list(ready_only=True)
            ],
        )
