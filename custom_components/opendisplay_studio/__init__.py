"""OpenDisplay Studio integration."""

from __future__ import annotations

from dataclasses import dataclass
from functools import partial
from pathlib import Path

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
from .http import RenderedImageView
from .panel import async_register_panel
from .projects import ProjectStore
from .rendering import OdlRenderService
from .websocket import async_register_commands
from .widgets import BUILTIN_WIDGET_DIRECTORY, WidgetRegistry


@dataclass(slots=True)
class OpenDisplayStudioData:
    """Domain-wide state shared by preview and Media Source rendering."""

    cache: RenderCache
    projects: ProjectStore
    renderer: OdlRenderService
    widgets: WidgetRegistry


type OpenDisplayStudioConfigEntry = ConfigEntry[None]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    """Set up storage, the ODL renderer, panel APIs, and PNG endpoint."""
    installed_widgets = Path(hass.config.path(DOMAIN, "widgets"))
    await hass.async_add_executor_job(
        partial(installed_widgets.mkdir, parents=True, exist_ok=True)
    )
    widgets = await hass.async_add_executor_job(
        WidgetRegistry.from_directories,
        [BUILTIN_WIDGET_DIRECTORY, installed_widgets],
    )
    projects = ProjectStore(hass, widgets)
    await projects.async_load()
    hass.data[DOMAIN] = OpenDisplayStudioData(
        cache=RenderCache(
            ttl_seconds=RENDER_CACHE_TTL_SECONDS,
            max_items=RENDER_CACHE_MAX_ITEMS,
        ),
        projects=projects,
        renderer=OdlRenderService(
            async_get_clientsession(hass), concurrency=RENDER_CONCURRENCY
        ),
        widgets=widgets,
    )
    hass.http.register_view(RenderedImageView(hass))
    async_register_commands(hass)
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
