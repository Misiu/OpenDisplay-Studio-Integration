"""Register the bundled OpenDisplay Studio frontend panel."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    INTEGRATION_VERSION,
    NAME,
    PANEL_STATIC_URL,
    PANEL_URL_PATH,
    PANEL_WEB_COMPONENT,
)


async def async_register_panel(hass: HomeAssistant) -> None:
    """Serve the local module and add an admin-only sidebar panel."""
    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_STATIC_URL, str(frontend_dir), cache_headers=True)]
    )
    await panel_custom.async_register_panel(
        hass=hass,
        frontend_url_path=PANEL_URL_PATH,
        config_panel_domain=PANEL_URL_PATH,
        webcomponent_name=PANEL_WEB_COMPONENT,
        sidebar_title=NAME,
        sidebar_icon="mdi:monitor-dashboard",
        module_url=(
            f"{PANEL_STATIC_URL}/opendisplay-studio.js?v={INTEGRATION_VERSION}"
        ),
        require_admin=True,
    )
