"""Tests for Supervisor and external Renderer config-flow routing."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from homeassistant.components.hassio import AddonError, AddonState
from homeassistant.config_entries import SOURCE_USER
from homeassistant.data_entry_flow import FlowResultType

from custom_components.opendisplay_studio.const import DOMAIN


async def test_container_uses_external_renderer_flow(hass, aioclient_mock) -> None:
    aioclient_mock.get(
        "http://renderer:8099/health",
        json={
            "status": "ok",
            "version": "0.2.0",
            "apiVersion": 1,
            "trmnlFrameworkVersion": "3.2.0",
        },
    )
    with patch(
        "custom_components.opendisplay_studio.config_flow.is_hassio",
        return_value=False,
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": SOURCE_USER}
        )
        assert result["type"] is FlowResultType.FORM
        assert result["step_id"] == "external"

        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            user_input={"url": "http://renderer:8099", "auth_token": "secret"},
        )

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"]["use_addon"] is False
    assert result["data"]["api_version"] == 1


async def test_supervisor_requires_repository_when_app_is_unknown(hass) -> None:
    manager = SimpleNamespace(
        async_get_addon_info=AsyncMock(side_effect=AddonError("not in store"))
    )
    with (
        patch(
            "custom_components.opendisplay_studio.config_flow.is_hassio",
            return_value=True,
        ),
        patch(
            "custom_components.opendisplay_studio.config_flow.get_addon_manager",
            return_value=manager,
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": SOURCE_USER}
        )

    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "repository_required"


async def test_supervisor_offers_install_for_known_missing_app(hass) -> None:
    manager = SimpleNamespace(
        async_get_addon_info=AsyncMock(
            return_value=SimpleNamespace(state=AddonState.NOT_INSTALLED)
        )
    )
    with (
        patch(
            "custom_components.opendisplay_studio.config_flow.is_hassio",
            return_value=True,
        ),
        patch(
            "custom_components.opendisplay_studio.config_flow.get_addon_manager",
            return_value=manager,
        ),
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": SOURCE_USER}
        )

    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "install_renderer"
