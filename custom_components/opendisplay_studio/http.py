"""Temporary token-protected HTTP endpoint for rendered PNGs."""

from __future__ import annotations

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN, RENDER_HTTP_PATH


class RenderedImageView(HomeAssistantView):
    """Serve generated media to clients that cannot authenticate to HA."""

    url = RENDER_HTTP_PATH
    name = "api:opendisplay_studio:render"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize view."""
        self.hass = hass

    async def get(self, _request: web.Request, token: str) -> web.Response:
        """Return a live cached PNG selected by an unguessable token."""
        cache = self.hass.data[DOMAIN].cache
        if (png := cache.get(token)) is None:
            raise web.HTTPNotFound
        return web.Response(
            body=png,
            content_type="image/png",
            headers={
                "Cache-Control": "no-store, max-age=0",
                "X-Content-Type-Options": "nosniff",
            },
        )
