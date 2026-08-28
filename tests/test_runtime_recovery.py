"""Tests for Matter-style Renderer App runtime recovery."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from homeassistant.components.hassio import AddonState
from homeassistant.exceptions import ConfigEntryNotReady

from custom_components.opendisplay_studio import (
    _async_ensure_addon_running,
    _async_get_addon_connection,
)
from custom_components.opendisplay_studio.const import (
    ADDON_SLUG,
    CONF_ADDON_SLUG,
    CONF_AUTH_TOKEN,
)


@pytest.mark.parametrize(
    ("state", "scheduled_method"),
    [
        (AddonState.NOT_INSTALLED, "async_schedule_install_addon"),
        (AddonState.NOT_RUNNING, "async_schedule_start_addon"),
    ],
)
async def test_runtime_schedules_recovery(hass, state, scheduled_method) -> None:
    manager = SimpleNamespace(
        task_in_progress=Mock(return_value=False),
        async_get_addon_info=AsyncMock(return_value=SimpleNamespace(state=state)),
        async_schedule_install_addon=Mock(),
        async_schedule_start_addon=Mock(),
    )
    with (
        patch(
            "custom_components.opendisplay_studio.get_addon_manager",
            return_value=manager,
        ),
        pytest.raises(ConfigEntryNotReady),
    ):
        await _async_ensure_addon_running(hass)

    getattr(manager, scheduled_method).assert_called_once_with(catch_error=True)


@pytest.mark.parametrize("port", [8099, "8099"])
async def test_runtime_discovery_uses_transport_before_health_check(hass, port) -> None:
    """Allow stale identity metadata while an App update is settling."""
    manager = SimpleNamespace(
        async_get_addon_discovery_info=AsyncMock(
            return_value={
                "host": "renderer-host",
                "port": port,
                "auth_token": "secret",
                "instance_id": "renderer-instance",
                "api_version": 1,
            }
        )
    )
    with patch(
        "custom_components.opendisplay_studio.get_addon_manager",
        return_value=manager,
    ):
        connection = await _async_get_addon_connection(hass)

    assert connection == {
        "url": "http://renderer-host:8099",
        CONF_AUTH_TOKEN: "secret",
        CONF_ADDON_SLUG: ADDON_SLUG,
    }


@pytest.mark.parametrize(
    "discovery",
    [
        {"host": "", "port": 8099, "auth_token": "secret"},
        {"host": "renderer-host", "port": 0, "auth_token": "secret"},
        {"host": "renderer-host", "port": True, "auth_token": "secret"},
        {"host": "renderer-host", "port": 8099, "auth_token": ""},
    ],
)
async def test_runtime_discovery_rejects_invalid_transport(hass, discovery) -> None:
    """Reject discovery values that cannot authenticate or reach the App."""
    manager = SimpleNamespace(
        async_get_addon_discovery_info=AsyncMock(return_value=discovery)
    )
    with (
        patch(
            "custom_components.opendisplay_studio.get_addon_manager",
            return_value=manager,
        ),
        pytest.raises(ConfigEntryNotReady),
    ):
        await _async_get_addon_connection(hass)
