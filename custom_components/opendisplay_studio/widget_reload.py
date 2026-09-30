"""Load widget packages, and load them again without restarting Home Assistant."""

from __future__ import annotations

from functools import partial
from pathlib import Path
from typing import TYPE_CHECKING, Final

from .const import DOMAIN, LOGGER
from .widgets import BUILTIN_WIDGET_DIRECTORY, WidgetRegistry

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant, ServiceCall

SERVICE_RELOAD_WIDGETS: Final = "reload_widgets"


def installed_widgets_path(hass: HomeAssistant) -> Path:
    """Return the folder where an administrator drops widget packages."""
    return Path(hass.config.path(DOMAIN, "widgets"))


async def async_load_registry(hass: HomeAssistant) -> WidgetRegistry:
    """Read every package in the executor; a broken one is reported, not raised."""
    installed = installed_widgets_path(hass)
    await hass.async_add_executor_job(
        partial(installed.mkdir, parents=True, exist_ok=True)
    )
    registry = await hass.async_add_executor_job(
        WidgetRegistry.from_directories, BUILTIN_WIDGET_DIRECTORY, installed
    )
    for error in registry.errors:
        LOGGER.warning("Widget package %s was skipped: %s", error.folder, error.message)
    return registry


async def async_reload_widgets(hass: HomeAssistant) -> WidgetRegistry:
    """Build a new registry and swap it in for every user of the old one."""
    registry = await async_load_registry(hass)
    data = hass.data[DOMAIN]
    data.widgets = registry
    data.dashboards.registry = registry
    return registry


def async_register_reload_service(hass: HomeAssistant) -> None:
    """Offer `opendisplay_studio.reload_widgets` to automations and scripts."""

    async def reload_widgets(_call: ServiceCall) -> None:
        await async_reload_widgets(hass)

    hass.services.async_register(DOMAIN, SERVICE_RELOAD_WIDGETS, reload_widgets)
