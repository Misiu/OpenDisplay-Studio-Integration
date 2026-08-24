"""OpenDisplay Studio integration."""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.components.hassio import AddonError, AddonManager, AddonState
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_URL
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .addon import get_addon_manager
from .cache import RenderCache
from .const import (
    ADDON_SLUG,
    API_VERSION,
    CONF_ADDON_SLUG,
    CONF_AUTH_TOKEN,
    CONF_INTEGRATION_CREATED_ADDON,
    CONF_USE_ADDON,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    DOMAIN,
    LOGGER,
    RENDER_CACHE_MAX_ITEMS,
    RENDER_CACHE_TTL_SECONDS,
)
from .http import RenderedImageView
from .renderer import (
    RendererClient,
    RendererError,
    RendererHealth,
)


@dataclass(slots=True)
class OpenDisplayStudioRuntimeData:
    """Objects owned by a loaded config entry."""

    client: RendererClient
    health: RendererHealth
    width: int
    height: int


@dataclass(slots=True)
class OpenDisplayStudioData:
    """Domain-wide state."""

    cache: RenderCache


type OpenDisplayStudioConfigEntry = ConfigEntry[OpenDisplayStudioRuntimeData]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    """Set up the temporary render endpoint once."""
    hass.data[DOMAIN] = OpenDisplayStudioData(
        cache=RenderCache(
            ttl_seconds=RENDER_CACHE_TTL_SECONDS,
            max_items=RENDER_CACHE_MAX_ITEMS,
        )
    )
    hass.http.register_view(RenderedImageView(hass))
    return True


async def async_setup_entry(
    hass: HomeAssistant, entry: OpenDisplayStudioConfigEntry
) -> bool:
    """Set up and health-check the configured Renderer."""
    if entry.data.get(CONF_USE_ADDON):
        await _async_ensure_addon_running(hass)
        connection = await _async_get_addon_connection(hass)
        if any(entry.data.get(key) != value for key, value in connection.items()):
            hass.config_entries.async_update_entry(
                entry, data={**entry.data, **connection}
            )

    client = RendererClient(
        async_get_clientsession(hass),
        entry.data[CONF_URL],
        entry.data.get(CONF_AUTH_TOKEN, ""),
    )
    try:
        health = await client.async_health()
    except RendererError as err:
        raise ConfigEntryNotReady("Renderer health check failed") from err
    entry.runtime_data = OpenDisplayStudioRuntimeData(
        client=client,
        health=health,
        width=entry.data.get("width", DEFAULT_WIDTH),
        height=entry.data.get("height", DEFAULT_HEIGHT),
    )
    LOGGER.info(
        "Renderer available version=%s apiVersion=%d trmnlFrameworkVersion=%s",
        health["version"],
        health["apiVersion"],
        health["trmnlFrameworkVersion"],
    )
    return True


async def async_unload_entry(
    _hass: HomeAssistant, _entry: OpenDisplayStudioConfigEntry
) -> bool:
    """Unload the stateless Renderer client."""
    return True


async def async_remove_entry(
    hass: HomeAssistant, entry: OpenDisplayStudioConfigEntry
) -> None:
    """Remove only a Renderer App installed by this integration."""
    if not entry.data.get(CONF_INTEGRATION_CREATED_ADDON):
        return
    addon_manager = get_addon_manager(hass)
    try:
        await addon_manager.async_stop_addon()
        await addon_manager.async_create_backup()
        await addon_manager.async_uninstall_addon()
    except AddonError as err:
        LOGGER.error("Unable to remove integration-created Renderer App: %s", err)


async def _async_ensure_addon_running(hass: HomeAssistant) -> None:
    """Follow Matter's runtime recovery pattern for the Renderer App."""
    addon_manager: AddonManager = get_addon_manager(hass)
    if addon_manager.task_in_progress():
        raise ConfigEntryNotReady("Renderer App operation is still in progress")
    try:
        addon_info = await addon_manager.async_get_addon_info()
    except AddonError as err:
        raise ConfigEntryNotReady("Renderer App is unavailable") from err

    if addon_info.state is AddonState.NOT_INSTALLED:
        addon_manager.async_schedule_install_addon(catch_error=True)
        raise ConfigEntryNotReady("Renderer App installation scheduled")
    if addon_info.state is AddonState.NOT_RUNNING:
        addon_manager.async_schedule_start_addon(catch_error=True)
        raise ConfigEntryNotReady("Renderer App start scheduled")


async def _async_get_addon_connection(hass: HomeAssistant) -> dict[str, object]:
    """Resolve internal hostname and token from supported Supervisor discovery."""
    try:
        discovery = await get_addon_manager(hass).async_get_addon_discovery_info()
    except AddonError as err:
        raise ConfigEntryNotReady("Renderer App discovery is unavailable") from err
    host = discovery.get("host")
    port = discovery.get("port")
    token = discovery.get(CONF_AUTH_TOKEN)
    instance_id = discovery.get("instance_id")
    api_version = discovery.get("api_version")
    if (
        not isinstance(host, str)
        or not host
        or not isinstance(port, int)
        or isinstance(port, bool)
        or not 1 <= port <= 65535
        or not isinstance(token, str)
        or not token
        or not isinstance(instance_id, str)
        or api_version != API_VERSION
    ):
        raise ConfigEntryNotReady("Renderer App discovery is invalid")
    return {
        CONF_URL: f"http://{host}:{port}",
        CONF_AUTH_TOKEN: token,
        "instance_id": instance_id,
        "api_version": api_version,
        CONF_ADDON_SLUG: ADDON_SLUG,
    }
