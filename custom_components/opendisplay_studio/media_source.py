"""Expose Ready OpenDisplay Studio dashboards as dynamic image Media Sources."""

from __future__ import annotations

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

from .compiler import DashboardCompileError
from .const import DOMAIN, LOGGER, RENDER_HTTP_PATH, SENT_PREFIX
from .delivery import async_render_dashboard
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
        data = self.hass.data[DOMAIN]
        if item.identifier.startswith(SENT_PREFIX):
            return self._resolve_sent(item.identifier.removeprefix(SENT_PREFIX))
        dashboard = data.dashboards.get(item.identifier)
        if dashboard is None or dashboard["status"] != "ready":
            raise Unresolvable("Unknown or Draft OpenDisplay Studio dashboard")
        try:
            rendered = await async_render_dashboard(
                self.hass, dashboard, for_device=True
            )
        except (DashboardCompileError, OdlRenderError) as err:
            LOGGER.error("Could not render %s: %s", item.identifier, err)
            raise Unresolvable(
                translation_domain=DOMAIN, translation_key="render_failed"
            ) from err
        token = data.cache.put(rendered.picture.png)
        return PlayMedia(RENDER_HTTP_PATH.replace("{token}", token), "image/png")

    def _resolve_sent(self, token: str) -> PlayMedia:
        """Resolve a picture an administrator is sending to a device from the editor."""
        if self.hass.data[DOMAIN].cache.get(token) is None:
            raise Unresolvable("The picture is no longer available")
        return PlayMedia(RENDER_HTTP_PATH.replace("{token}", token), "image/png")

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
