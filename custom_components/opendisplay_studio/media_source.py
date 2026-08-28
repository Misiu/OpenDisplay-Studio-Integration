"""Expose OpenDisplay Studio documents as dynamic image Media Sources."""

from __future__ import annotations

from typing import cast, override

from homeassistant.components.media_player import (
    BrowseError,
    MediaClass,
    MediaType,
)
from homeassistant.components.media_source import (
    BrowseMediaSource,
    MediaSource,
    MediaSourceItem,
    PlayMedia,
    Unresolvable,
)
from homeassistant.core import HomeAssistant

from .composer import ProjectComposeError, async_compose_project
from .const import DOMAIN, LOGGER
from .renderer import RendererClient, RendererError


async def async_get_media_source(hass: HomeAssistant) -> OpenDisplayStudioMediaSource:
    """Set up the OpenDisplay Studio Media Source."""
    return OpenDisplayStudioMediaSource(hass)


class OpenDisplayStudioMediaSource(MediaSource):
    """Provide dynamic screen images."""

    name = "OpenDisplay Studio"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the source."""
        super().__init__(DOMAIN)
        self.hass = hass

    @override
    async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
        """Render the selected document and expose its temporary PNG URL."""
        project = self.hass.data[DOMAIN].projects.get(item.identifier)
        if project is None or project["status"] != "ready":
            raise Unresolvable("Unknown or Draft OpenDisplay Studio project")
        client = self._renderer_client()
        try:
            built = await async_compose_project(self.hass, project)
            result = await client.async_render(
                html=built.html,
                width=project["width"],
                height=project["height"],
                allowed_asset_origins=built.allowed_asset_origins,
            )
        except (ProjectComposeError, RendererError) as err:
            LOGGER.error("Could not render %s: %s", item.identifier, err)
            raise Unresolvable(
                translation_domain=DOMAIN,
                translation_key="render_failed",
            ) from err

        LOGGER.info(
            "Rendered project=%s at %dx%d; data=%.2f ms liquid=%.2f ms "
            "compose=%.2f ms renderer=%s pipeline=%.2f ms",
            item.identifier,
            project["width"],
            project["height"],
            built.data_ms,
            built.liquid_ms,
            built.compose_ms,
            result.timings,
            built.compose_ms + result.timings.get("total", 0.0),
        )
        token = self.hass.data[DOMAIN].cache.put(result.png)
        return PlayMedia(f"/api/opendisplay_studio/render/{token}.png", "image/png")

    @override
    async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
        """Return Ready projects only."""
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
                    identifier=identifier,
                    media_class=MediaClass.IMAGE,
                    media_content_type="image/png",
                    title=title,
                    can_play=True,
                    can_expand=False,
                )
                for project in self.hass.data[DOMAIN].projects.list(ready_only=True)
                for identifier, title in ((project["id"], project["name"]),)
            ],
        )

    def _renderer_client(self) -> RendererClient:
        """Return the same domain Renderer used by the designer preview."""
        client = getattr(self.hass.data[DOMAIN], "renderer", None)
        if client is None:
            raise Unresolvable(
                translation_domain=DOMAIN,
                translation_key="config_entry_not_ready",
            )
        return cast("RendererClient", client)
