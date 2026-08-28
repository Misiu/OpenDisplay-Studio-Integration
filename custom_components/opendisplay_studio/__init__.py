"""OpenDisplay Studio integration."""

from __future__ import annotations

from dataclasses import dataclass
from functools import partial
from pathlib import Path

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
    CONF_ADDON_SLUG,
    CONF_API_VERSION,
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
from .panel import async_register_panel
from .projects import ProjectStore
from .renderer import (
    RendererClient,
    RendererError,
    RendererHealth,
)
from .websocket import async_register_commands
from .widgets import BUILTIN_WIDGET_DIRECTORY, WidgetRegistry


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
    projects: ProjectStore
    widgets: WidgetRegistry
    renderer: RendererClient | None = None
    renderer_health: RendererHealth | None = None


type OpenDisplayStudioConfigEntry = ConfigEntry[OpenDisplayStudioRuntimeData]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    """Set up storage, panel APIs, and the temporary render endpoint."""
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
        widgets=widgets,
    )
    hass.http.register_view(RenderedImageView(hass))
    async_register_commands(hass)
    await async_register_panel(hass)
    return True


async def async_setup_entry(
    hass: HomeAssistant, entry: OpenDisplayStudioConfigEntry
) -> bool:
    """Set up and health-check the configured Renderer."""
    renderer_url = entry.data[CONF_URL]
    renderer_token = entry.data.get(CONF_AUTH_TOKEN, "")
    if entry.data.get(CONF_USE_ADDON):
        await _async_ensure_addon_running(hass)
        connection = await _async_get_addon_connection(hass)
        renderer_url = connection[CONF_URL]
        renderer_token = connection[CONF_AUTH_TOKEN]
        if any(entry.data.get(key) != value for key, value in connection.items()):
            hass.config_entries.async_update_entry(
                entry, data={**entry.data, **connection}
            )

    client = RendererClient(
        async_get_clientsession(hass),
        renderer_url,
        renderer_token,
    )
    try:
        health = await client.async_health()
    except RendererError as err:
        message = f"Renderer health check failed: {err}"
        raise ConfigEntryNotReady(message) from err
    if entry.data.get(CONF_API_VERSION) != health["apiVersion"]:
        hass.config_entries.async_update_entry(
            entry,
            data={**entry.data, CONF_API_VERSION: health["apiVersion"]},
        )
    entry.runtime_data = OpenDisplayStudioRuntimeData(
        client=client,
        health=health,
        width=entry.data.get("width", DEFAULT_WIDTH),
        height=entry.data.get("height", DEFAULT_HEIGHT),
    )
    domain_data: OpenDisplayStudioData = hass.data[DOMAIN]
    domain_data.renderer = client
    domain_data.renderer_health = health
    LOGGER.info(
        "Renderer available version=%s apiVersion=%d trmnlFrameworkVersion=%s",
        health["version"],
        health["apiVersion"],
        health["trmnlFrameworkVersion"],
    )
    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: OpenDisplayStudioConfigEntry
) -> bool:
    """Unload the stateless Renderer client."""
    domain_data: OpenDisplayStudioData = hass.data[DOMAIN]
    if domain_data.renderer is entry.runtime_data.client:
        domain_data.renderer = None
        domain_data.renderer_health = None
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


async def _async_get_addon_connection(hass: HomeAssistant) -> dict[str, str]:
    """
    Resolve the transport fields from Supervisor discovery.

    Renderer identity and API compatibility are verified by the authenticated
    health endpoint. Discovery metadata can briefly be stale while Supervisor
    processes an App update, so it must not prevent that authoritative check.
    """
    try:
        discovery = await get_addon_manager(hass).async_get_addon_discovery_info()
    except AddonError as err:
        raise ConfigEntryNotReady("Renderer App discovery is unavailable") from err
    host = discovery.get("host")
    raw_port = discovery.get("port")
    token = discovery.get(CONF_AUTH_TOKEN)
    port = (
        int(raw_port)
        if isinstance(raw_port, str) and raw_port.isdecimal()
        else raw_port
    )
    if (
        not isinstance(host, str)
        or not host
        or not isinstance(port, int)
        or isinstance(port, bool)
        or not 1 <= port <= 65535
        or not isinstance(token, str)
        or not token
    ):
        LOGGER.warning(
            "Renderer App discovery transport is invalid: keys=%s "
            "host_type=%s port=%r port_type=%s auth_token_present=%s "
            "instance_id_present=%s api_version=%r",
            sorted(str(key) for key in discovery),
            type(host).__name__,
            raw_port,
            type(raw_port).__name__,
            isinstance(token, str) and bool(token),
            isinstance(discovery.get("instance_id"), str)
            and bool(discovery.get("instance_id")),
            discovery.get("api_version"),
        )
        raise ConfigEntryNotReady("Renderer App discovery is invalid")
    LOGGER.debug(
        "Renderer App discovery transport resolved: host=%s port=%d "
        "instance_id_present=%s discovery_api_version=%r",
        host,
        port,
        isinstance(discovery.get("instance_id"), str)
        and bool(discovery.get("instance_id")),
        discovery.get("api_version"),
    )
    return {
        CONF_URL: f"http://{host}:{port}",
        CONF_AUTH_TOKEN: token,
        CONF_ADDON_SLUG: ADDON_SLUG,
    }
