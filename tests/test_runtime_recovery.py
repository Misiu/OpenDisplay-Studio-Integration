"""Tests for Matter-style Renderer App runtime recovery."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

import pytest
from homeassistant.components.hassio import AddonState
from homeassistant.exceptions import ConfigEntryNotReady

from custom_components.opendisplay_studio import _async_ensure_addon_running


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
