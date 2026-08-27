"""Tests for render-time data aggregation and one-page composition."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.opendisplay_studio.composer import (
    ProjectComposeError,
    _region_shape,
    _requirement_sources,
    async_compose_project,
)
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY, definition
from custom_components.opendisplay_studio.widgets.weather.provider import (
    WeatherLocalizer,
)


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
        "version": "0.5.0",
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
    resolve = AsyncMock(
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
        patch.object(
            DEFAULT_REGISTRY.provider("entity-state", "entity_state"),
            "async_resolve",
            resolve,
        ),
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, {"sensor.office"}, hass.config.language)
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
        "regions": [
            {
                "id": "entity",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "entity-state",
                    "version": "0.5.0",
                    "config": {"entity": "sensor.office"},
                },
            }
        ],
    }
    with (
        patch.object(
            DEFAULT_REGISTRY.provider("entity-state", "entity_state"),
            "async_resolve",
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
                    "version": "0.5.0",
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
        }
    }

    resolve = AsyncMock(
        return_value=SimpleNamespace(
            values=weather, localizer=WeatherLocalizer.english()
        )
    )
    with patch.object(
        DEFAULT_REGISTRY.provider("weather", "weather_forecast"),
        "async_resolve",
        resolve,
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, {"weather.home"}, hass.config.language)
    assert "od-weather" in result.html
    assert "12°" in result.html
    assert "08:15" in result.html
    assert "--studio-gap:0px" in result.html
    assert 'data-region-width="190.000"' in result.html
    assert 'data-region-height="228.000"' in result.html


async def test_weather_widget_renders_placeholder_before_entity_selection(hass) -> None:
    """A newly added Weather widget must render before its selector is configured."""
    project = {
        "palette": "bw",
        "width": 400,
        "height": 300,
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
                    "version": "0.5.0",
                    "config": {"weather": "", "showForecast": False},
                },
            }
        ],
    }

    resolve = AsyncMock(
        return_value=SimpleNamespace(
            values={}, localizer=WeatherLocalizer.english()
        )
    )
    with patch.object(
        DEFAULT_REGISTRY.provider("weather", "weather_forecast"),
        "async_resolve",
        resolve,
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, set(), hass.config.language)
    assert "Choose a weather entity" in result.html
    assert "—°" in result.html


async def test_weather_widget_uses_project_language_for_every_render_surface(
    hass,
) -> None:
    project = {
        "language": "pl",
        "palette": "bw",
        "width": 400,
        "height": 300,
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
                    "version": "0.5.0",
                    "config": {"weather": "weather.home"},
                },
            }
        ],
    }
    labels = {
        **WeatherLocalizer.english().labels,
        "weather": "Pogoda",
        "temperature": "Temperatura",
        "apparent_temperature": "Odczuwalna temperatura",
        "humidity": "Wilgotność",
        "right_now": "Teraz",
        "uv_moderate": "Umiarkowane",
    }
    localizer = WeatherLocalizer(
        language="pl",
        labels=labels,
        condition_labels={"sunny": "słonecznie"},
    )
    weather = {
        "weather.home": {
            "entity_id": "weather.home",
            "name": "OpenWeatherMap",
            "condition": "sunny",
            "condition_label": "słonecznie",
            "icon": "https://trmnl.com/images/plugins/weather/wi-day-sunny.svg",
            "temperature": 11,
            "temperature_unit": "°C",
            "apparent_temperature": 10,
            "humidity": 93,
            "updated_at": "06:02",
            "forecast": [],
        }
    }
    resolve = AsyncMock(
        return_value=SimpleNamespace(values=weather, localizer=localizer)
    )
    with patch.object(
        DEFAULT_REGISTRY.provider("weather", "weather_forecast"),
        "async_resolve",
        resolve,
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, {"weather.home"}, "pl")
    assert "słonecznie" in result.html
    assert "Temperatura" in result.html
    assert "Odczuwalna temperatura" in result.html
    assert "Wilgotność" in result.html
    assert "Teraz" in result.html
