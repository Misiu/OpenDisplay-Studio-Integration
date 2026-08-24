"""Expose OpenDisplay Studio documents as dynamic image Media Sources."""

from __future__ import annotations

from typing import override

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
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant

from . import OpenDisplayStudioConfigEntry
from .const import DOMAIN, LOGGER
from .renderer import RendererError
from .screens import SCREENS


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
        if item.identifier not in SCREENS:
            raise Unresolvable("Unknown OpenDisplay Studio screen")
        entry = self._loaded_entry()
        _, builder = SCREENS[item.identifier]
        try:
            result = await entry.runtime_data.client.async_render(
                html=builder(),
                width=entry.runtime_data.width,
                height=entry.runtime_data.height,
            )
        except RendererError as err:
            raise Unresolvable(
                translation_domain=DOMAIN,
                translation_key="render_failed",
            ) from err

        LOGGER.info(
            "Rendered %s at %dx%d; timings=%s",
            item.identifier,
            entry.runtime_data.width,
            entry.runtime_data.height,
            result.timings,
        )
        token = self.hass.data[DOMAIN].cache.put(result.png)
        return PlayMedia(f"/api/opendisplay_studio/render/{token}.png", "image/png")

    @override
    async def async_browse_media(self, item: MediaSourceItem) -> BrowseMediaSource:
        """Return exactly the two POC documents."""
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
                for identifier, (title, _) in SCREENS.items()
            ],
        )

    def _loaded_entry(self) -> OpenDisplayStudioConfigEntry:
        """Return the loaded single config entry."""
        entry = next(
            (
                entry
                for entry in self.hass.config_entries.async_entries(DOMAIN)
                if entry.state is ConfigEntryState.LOADED
            ),
            None,
        )
        if entry is None:
            raise Unresolvable(
                translation_domain=DOMAIN,
                translation_key="config_entry_not_ready",
            )
        return entry
