"""Tests for render-time data aggregation and one-page composition."""

from unittest.mock import AsyncMock, Mock, patch

import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.opendisplay_studio.composer import (
    ProjectComposeError,
    _requirement_sources,
    async_compose_project,
)
from custom_components.opendisplay_studio.widgets import definition


def test_requirement_contract_supports_many_and_optional_sources() -> None:
    requirement = {
        "key": "rows",
        "provider": "entity_state",
        "configKey": "entities",
        "cardinality": "many",
        "optional": False,
    }
    assert _requirement_sources(
        {"entities": ["sensor.office", "sensor.kitchen"]}, requirement
    ) == ["sensor.office", "sensor.kitchen"]
    assert definition("text")["dataRequirements"] == []
    assert definition("entity-state")["dataRequirements"][0]["optional"] is False


async def test_entity_requirements_are_deduplicated(hass) -> None:
    widget = {
        "type": "entity-state",
        "version": 1,
        "config": {"entity": "sensor.office", "showUnit": True},
    }
    project = {
        "palette": "bw",
        "grid": {"columns": 2, "rows": 1},
        "regions": [
            {
                "id": "a",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": widget,
            },
            {
                "id": "b",
                "row": 1,
                "column": 2,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": widget,
            },
        ],
    }
    get_many = Mock(
        return_value={
            "sensor.office": {"state": "22.8", "unit": "°C", "name": "Office"}
        }
    )
    with (
        patch(
            "custom_components.opendisplay_studio.composer.EntityStateProvider.get_many",
            get_many,
        ),
        patch(
            "custom_components.opendisplay_studio.composer.CalendarProvider.async_get_many",
            AsyncMock(return_value={}),
        ),
    ):
        result = await async_compose_project(hass, project)

    get_many.assert_called_once_with({"sensor.office"})
    assert result.html.count("22.8") == 2
    assert result.html.startswith('<main class="screen screen--1bit">')


async def test_provider_error_is_exposed_as_compose_error(hass) -> None:
    project = {
        "palette": "bw",
        "grid": {"columns": 1, "rows": 1},
        "regions": [],
    }
    with (
        patch(
            "custom_components.opendisplay_studio.composer.CalendarProvider.async_get_many",
            AsyncMock(side_effect=HomeAssistantError("calendar unavailable")),
        ),
        pytest.raises(ProjectComposeError),
    ):
        await async_compose_project(hass, project)
