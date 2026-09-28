"""Config flow for OpenDisplay Studio."""

from __future__ import annotations

from typing import Any, override

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN, NAME


class OpenDisplayStudioConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the single local OpenDisplay Studio config entry."""

    VERSION = 2

    @override
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Create the integration without an external renderer dependency."""
        if self._async_current_entries(include_ignore=False):
            return self.async_abort(reason="single_instance_allowed")
        if user_input is None:
            self._set_confirm_only()
            return self.async_show_form(step_id="user")
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title=NAME, data={})
