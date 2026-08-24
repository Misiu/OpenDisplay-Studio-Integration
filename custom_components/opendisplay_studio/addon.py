"""Supported Home Assistant Core App management for the Renderer."""

from homeassistant.components.hassio import AddonManager
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.singleton import singleton

from .const import ADDON_NAME, ADDON_SLUG, DOMAIN, LOGGER

DATA_ADDON_MANAGER = f"{DOMAIN}_addon_manager"


@singleton(DATA_ADDON_MANAGER)
@callback
def get_addon_manager(hass: HomeAssistant) -> AddonManager:
    """Return the one Core AddonManager for the Renderer App."""
    return AddonManager(hass, LOGGER, ADDON_NAME, ADDON_SLUG)
