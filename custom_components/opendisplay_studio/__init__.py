"""OpenDisplay Studio integration."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .cache import RenderCache
from .const import (
    DOMAIN,
    RENDER_CACHE_MAX_ITEMS,
    RENDER_CACHE_TTL_SECONDS,
    RENDER_CONCURRENCY,
)
from .dashboards import DashboardStore
from .fonts import font_directories
from .http import RenderedImageView
from .measure import use_font_directories
from .panel import async_register_panel
from .rendering import OdlRenderService
from .websocket import async_register_commands
from .widget_reload import async_load_registry, async_register_reload_service
from .widgets import WidgetRegistry


@dataclass(slots=True)
class OpenDisplayStudioData:
    """Domain-wide state shared by preview and Media Source rendering."""

    cache: RenderCache
    dashboards: DashboardStore
    renderer: OdlRenderService
    widgets: WidgetRegistry


type OpenDisplayStudioConfigEntry = ConfigEntry[None]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    """Set up storage, the ODL renderer, panel APIs, and PNG endpoint."""
    widgets = await async_load_registry(hass)
    dashboards = DashboardStore(hass, widgets)
    await dashboards.async_load()
    fonts = font_directories(hass)
    use_font_directories(fonts)
    hass.data[DOMAIN] = OpenDisplayStudioData(
        cache=RenderCache(
            ttl_seconds=RENDER_CACHE_TTL_SECONDS,
            max_items=RENDER_CACHE_MAX_ITEMS,
        ),
        dashboards=dashboards,
        renderer=OdlRenderService(
            async_get_clientsession(hass),
            concurrency=RENDER_CONCURRENCY,
            font_dirs=fonts,
        ),
        widgets=widgets,
    )
    hass.http.register_view(RenderedImageView(hass))
    async_register_commands(hass)
    async_register_reload_service(hass)
    await async_register_panel(hass)
    return True


async def async_setup_entry(
    _hass: HomeAssistant, _entry: OpenDisplayStudioConfigEntry
) -> bool:
    """Set up the local integration config entry."""
    return True


async def async_unload_entry(
    _hass: HomeAssistant, _entry: OpenDisplayStudioConfigEntry
) -> bool:
    """Unload the stateless config entry."""
    return True
