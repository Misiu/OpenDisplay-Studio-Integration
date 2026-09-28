"""Register the bundled OpenDisplay Studio frontend panel."""

from __future__ import annotations

from hashlib import sha256
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
    bundle_path = frontend_dir / "opendisplay-studio.js"
    frontend_revision = await hass.async_add_executor_job(
        _frontend_revision, bundle_path
    )
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
            f"{PANEL_STATIC_URL}/opendisplay-studio.js"
            f"?v={INTEGRATION_VERSION}-{frontend_revision}"
        ),
        require_admin=True,
    )


def _frontend_revision(bundle_path: Path) -> str:
    """Return a short content revision for immutable browser caching."""
    return sha256(bundle_path.read_bytes()).hexdigest()[:12]
