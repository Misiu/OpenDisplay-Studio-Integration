"""Config flow for OpenDisplay Studio."""

from __future__ import annotations

import asyncio
from typing import Any, override

import voluptuous as vol
from homeassistant.components.hassio import AddonError, AddonState
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_URL
from homeassistant.data_entry_flow import AbortFlow
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.hassio import is_hassio
from homeassistant.helpers.service_info.hassio import HassioServiceInfo

from .addon import get_addon_manager
from .const import (
    ADDON_SLUG,
    API_VERSION,
    APP_REPOSITORY_URL,
    CONF_ADDON_SLUG,
    CONF_API_VERSION,
    CONF_AUTH_TOKEN,
    CONF_INSTANCE_ID,
    CONF_INTEGRATION_CREATED_ADDON,
    CONF_USE_ADDON,
    DEFAULT_HEIGHT,
    DEFAULT_RENDERER_URL,
    DEFAULT_WIDTH,
    DOMAIN,
    LOGGER,
    NAME,
)
from .renderer import RendererClient, RendererError

EXTERNAL_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_URL, default=DEFAULT_RENDERER_URL): cv.url,
        vol.Optional(CONF_AUTH_TOKEN, default=""): cv.string,
    }
)
READY_RETRIES = 60
READY_RETRY_SECONDS = 2


class RendererStartError(Exception):
    """Renderer failed to become healthy during config flow."""


class OpenDisplayStudioConfigFlow(ConfigFlow, domain=DOMAIN):
    """Configure the Renderer dependency and dynamic Media Source."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize flow state."""
        self.install_task: asyncio.Task[None] | None = None
        self.start_task: asyncio.Task[None] | None = None
        self.integration_created_addon = False
        self.connection: dict[str, Any] | None = None

    @override
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Route Supervisor installations away from implementation details."""
        if self._async_current_entries(include_ignore=False):
            return self.async_abort(reason="single_instance_allowed")
        if is_hassio(self.hass):
            return await self.async_step_on_supervisor()
        return await self.async_step_external(user_input)

    async def async_step_external(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Configure an externally hosted Renderer without Supervisor."""
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                client = RendererClient(
                    async_get_clientsession(self.hass),
                    user_input[CONF_URL],
                    user_input.get(CONF_AUTH_TOKEN, ""),
                )
                health = await client.async_health()
            except ValueError:
                errors["base"] = "invalid_url"
            except RendererError:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(user_input[CONF_URL])
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=NAME,
                    data={
                        **user_input,
                        CONF_USE_ADDON: False,
                        CONF_INTEGRATION_CREATED_ADDON: False,
                        CONF_API_VERSION: health["apiVersion"],
                        "width": DEFAULT_WIDTH,
                        "height": DEFAULT_HEIGHT,
                    },
                )
        return self.async_show_form(
            step_id="external", data_schema=EXTERNAL_SCHEMA, errors=errors
        )

    async def async_step_on_supervisor(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Inspect the known Renderer App through Core AddonManager."""
        try:
            addon_info = await get_addon_manager(self.hass).async_get_addon_info()
        except AddonError as err:
            LOGGER.info("Renderer App is not in the Supervisor store: %s", err)
            return await self.async_step_repository_required()

        if addon_info.state is AddonState.NOT_INSTALLED:
            return await self.async_step_install_renderer()
        return await self.async_step_start_addon()

    async def async_step_repository_required(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Require one-time manual repository registration, then retry."""
        if user_input is not None:
            return await self.async_step_on_supervisor()
        self._set_confirm_only()
        return self.async_show_form(
            step_id="repository_required",
            description_placeholders={"repository_url": APP_REPOSITORY_URL},
        )

    async def async_step_install_renderer(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask the only meaningful Supervisor-side installation decision."""
        if user_input is not None:
            return await self.async_step_install_addon()
        self._set_confirm_only()
        return self.async_show_form(step_id="install_renderer")

    async def async_step_install_addon(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Install with Core's task scheduler and config-flow progress UI."""
        if not self.install_task:
            self.install_task = self.hass.async_create_task(self._async_install_addon())
        if not self.install_task.done():
            return self.async_show_progress(
                step_id="install_addon",
                progress_action="install_addon",
                progress_task=self.install_task,
            )
        try:
            await self.install_task
        except AddonError as err:
            LOGGER.error("Renderer App installation failed: %s", err)
            return self.async_show_progress_done(next_step_id="install_failed")
        finally:
            self.install_task = None
        self.integration_created_addon = True
        return self.async_show_progress_done(next_step_id="start_addon")

    async def _async_install_addon(self) -> None:
        """Await the AddonManager-scheduled installation task."""
        await get_addon_manager(self.hass).async_schedule_install_addon()

    async def async_step_install_failed(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Abort after an App installation failure."""
        return self.async_abort(reason="addon_install_failed")

    async def async_step_start_addon(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Start, discover, and health-check with progress UI."""
        if not self.start_task:
            self.start_task = self.hass.async_create_task(
                self._async_start_addon_and_wait()
            )
        if not self.start_task.done():
            return self.async_show_progress(
                step_id="start_addon",
                progress_action="start_addon",
                progress_task=self.start_task,
            )
        try:
            await self.start_task
        except (AddonError, RendererStartError) as err:
            LOGGER.error("Renderer App startup failed: %s", err)
            return self.async_show_progress_done(next_step_id="start_failed")
        finally:
            self.start_task = None
        return self.async_show_progress_done(next_step_id="finish_addon_setup")

    async def _async_start_addon_and_wait(self) -> None:
        """Start if needed, then wait for discovery plus healthy API v1."""
        manager = get_addon_manager(self.hass)
        addon_info = await manager.async_get_addon_info()
        if addon_info.state is not AddonState.RUNNING:
            await manager.async_schedule_start_addon()

        for _ in range(READY_RETRIES):
            try:
                discovery = await manager.async_get_addon_discovery_info()
                connection = self._validated_discovery(discovery)
                client = RendererClient(
                    async_get_clientsession(self.hass),
                    connection[CONF_URL],
                    connection[CONF_AUTH_TOKEN],
                )
                await client.async_health()
            except AddonError, RendererError, ValueError:
                await asyncio.sleep(READY_RETRY_SECONDS)
            else:
                self.connection = connection
                return
        raise RendererStartError("Renderer did not become healthy within 120 seconds")

    async def async_step_start_failed(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Abort after App startup or health failure."""
        return self.async_abort(reason="addon_start_failed")

    async def async_step_finish_addon_setup(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Create the managed config entry after readiness is proven."""
        if self.connection is None:
            raise AbortFlow("addon_discovery_failed")
        await self.async_set_unique_id(self.connection[CONF_INSTANCE_ID])
        self._abort_if_unique_id_configured()
        return self.async_create_entry(
            title=NAME,
            data={
                **self.connection,
                CONF_USE_ADDON: True,
                CONF_INTEGRATION_CREATED_ADDON: self.integration_created_addon,
                CONF_ADDON_SLUG: ADDON_SLUG,
                "width": DEFAULT_WIDTH,
                "height": DEFAULT_HEIGHT,
            },
        )

    @override
    async def async_step_hassio(
        self, discovery_info: HassioServiceInfo
    ) -> ConfigFlowResult:
        """Handle discovery from a Renderer installed independently."""
        if discovery_info.slug != ADDON_SLUG:
            return self.async_abort(reason="invalid_discovery")
        try:
            self.connection = self._validated_discovery(discovery_info.config)
            client = RendererClient(
                async_get_clientsession(self.hass),
                self.connection[CONF_URL],
                self.connection[CONF_AUTH_TOKEN],
            )
            await client.async_health()
        except RendererError, ValueError:
            return self.async_abort(reason="cannot_connect")
        await self.async_set_unique_id(self.connection[CONF_INSTANCE_ID])
        self._abort_if_unique_id_configured(
            updates=self.connection, reload_on_update=True
        )
        self._set_confirm_only()
        return self.async_show_form(step_id="hassio_confirm")

    async def async_step_hassio_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm an independently installed Renderer."""
        if user_input is None:
            self._set_confirm_only()
            return self.async_show_form(step_id="hassio_confirm")
        assert self.connection is not None
        return self.async_create_entry(
            title=NAME,
            data={
                **self.connection,
                CONF_USE_ADDON: True,
                CONF_INTEGRATION_CREATED_ADDON: False,
                CONF_ADDON_SLUG: ADDON_SLUG,
                "width": DEFAULT_WIDTH,
                "height": DEFAULT_HEIGHT,
            },
        )

    @staticmethod
    def _validated_discovery(config: dict[str, Any]) -> dict[str, Any]:
        """Validate discovery and build the internal App URL."""
        host = config.get("host")
        port = config.get("port")
        token = config.get(CONF_AUTH_TOKEN)
        instance_id = config.get(CONF_INSTANCE_ID)
        api_version = config.get(CONF_API_VERSION)
        if (
            not isinstance(host, str)
            or not host
            or not isinstance(port, int)
            or isinstance(port, bool)
            or not 1 <= port <= 65535
            or not isinstance(token, str)
            or not token
            or not isinstance(instance_id, str)
            or not instance_id
            or api_version != API_VERSION
        ):
            raise ValueError("Invalid Renderer discovery")
        return {
            CONF_URL: f"http://{host}:{port}",
            CONF_AUTH_TOKEN: token,
            CONF_INSTANCE_ID: instance_id,
            CONF_API_VERSION: api_version,
        }
