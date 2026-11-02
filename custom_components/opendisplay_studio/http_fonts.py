"""Give the panel the font files it shows text and icons in."""

from __future__ import annotations

from typing import Final

from aiohttp import web
from homeassistant.components.http import KEY_HASS_USER, HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .fonts import FontError
from .icons import ICON_FONT_FILE

FONT_URL: Final = "/api/opendisplay_studio/fonts"
ICON_FONT_URL: Final = "/api/opendisplay_studio/icon-font"
_CONTENT_TYPES: Final = {".ttf": "font/ttf", ".otf": "font/otf"}
# The address carries the version of the file, so a font may be kept for good.
_HEADERS: Final = {
    "Cache-Control": "private, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
}


def _require_admin(request: web.Request) -> None:
    if not request[KEY_HASS_USER].is_admin:
        raise web.HTTPUnauthorized


class FontFileView(HomeAssistantView):
    """Give the panel the file of a font, so it can show text in it."""

    url = FONT_URL + "/{name}"
    name = "api:opendisplay_studio:font"

    def __init__(self, hass: HomeAssistant) -> None:
        """Keep Home Assistant to find the fonts with."""
        self.hass = hass

    async def get(self, request: web.Request, name: str) -> web.Response:
        """Return the font `name` to an administrator; any other name is not found."""
        _require_admin(request)
        library = self.hass.data[DOMAIN].fonts
        try:
            path = await self.hass.async_add_executor_job(library.path_of, name)
        except FontError as err:
            raise web.HTTPNotFound from err
        body = await self.hass.async_add_executor_job(path.read_bytes)
        content_type = _CONTENT_TYPES.get(path.suffix.lower(), "font/ttf")
        return web.Response(body=body, content_type=content_type, headers=_HEADERS)


class IconFontView(HomeAssistantView):
    """Give the panel the icon font the renderer draws icons with."""

    url = ICON_FONT_URL
    name = "api:opendisplay_studio:icon_font"

    def __init__(self, hass: HomeAssistant) -> None:
        """Keep Home Assistant to read the file with."""
        self.hass = hass

    async def get(self, request: web.Request) -> web.Response:
        """Return the icon font to an administrator."""
        _require_admin(request)
        body = await self.hass.async_add_executor_job(ICON_FONT_FILE.read_bytes)
        return web.Response(body=body, content_type="font/ttf", headers=_HEADERS)
