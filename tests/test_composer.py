"""Tests for render-time data aggregation and one-page composition."""

from unittest.mock import AsyncMock, Mock, patch

import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.opendisplay_studio.composer import (
    ProjectComposeError,
    _region_shape,
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
    weather = definition("weather")
    assert weather["fields"][0]["selector"]["entity"]["filter"]["domain"] == ("weather")
    assert weather["dataRequirements"][0]["provider"] == "weather_forecast"


def test_entity_tile_shape_uses_physical_region_ratio() -> None:
    project = {"width": 800, "height": 480, "grid": {"columns": 3, "rows": 2}}
    assert (
        _region_shape(
            project,
            {"columnSpan": 2, "rowSpan": 1},
            gap=8,
        )
        == "wide"
    )
    assert (
        _region_shape(
            project,
            {"columnSpan": 1, "rowSpan": 2},
            gap=8,
        )
        == "tall"
    )


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
            "sensor.office": {
                "state": "22.8",
                "unit": "°C",
                "name": "Office",
                "iconPath": "M0 0H24V24H0Z",
            }
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
    assert result.html.startswith(
        '<main class="screen screen--1bit screen--md studio-screen"'
    )
    assert result.html.count('<svg class="studio-entity__icon"') == 2
    assert "studio-entity--square" in result.html
    assert result.html.count(">Office</span>") == 2
    assert "--studio-width:800px;--studio-height:480px" in result.html
    assert "--screen-w:800px;--screen-h:480px" in result.html
    assert "border:1px solid" not in result.html
    assert 'data-region-width="388.000"' in result.html


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


async def test_weather_widget_renders_normalized_home_assistant_data(hass) -> None:
    project = {
        "palette": "bw",
        "width": 190,
        "height": 228,
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "weather",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "weather",
                    "version": 2,
                    "config": {"weather": "weather.home"},
                },
            }
        ],
    }
    weather = {
        "weather.home": {
            "entity_id": "weather.home",
            "name": "Home",
            "condition": "rainy",
            "condition_label": "Rain",
            "icon": "https://trmnl.com/images/plugins/weather/wi-rain.svg",
            "temperature": 12,
            "temperature_unit": "°C",
            "apparent_temperature": 9,
            "humidity": 88,
            "updated_at": "08:15",
            "forecast": [],
        }
    }

    with patch(
        "custom_components.opendisplay_studio.composer.WeatherForecastProvider.async_get_many",
        AsyncMock(return_value=weather),
    ) as get_many:
        result = await async_compose_project(hass, project)

    get_many.assert_awaited_once_with({"weather.home"})
    assert "od-weather" in result.html
    assert "12°" in result.html
    assert "08:15" in result.html
    assert "--studio-gap:0px" in result.html
    assert 'data-region-width="190.000"' in result.html
    assert 'data-region-height="228.000"' in result.html
