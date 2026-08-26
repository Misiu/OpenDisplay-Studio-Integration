"""Tests for normalized Home Assistant widget providers."""

from unittest.mock import AsyncMock, patch

from homeassistant.exceptions import HomeAssistantError

from custom_components.opendisplay_studio.data_providers import (
    EntityStateProvider,
    WeatherForecastProvider,
)


def test_entity_provider_returns_normalized_current_state(hass) -> None:
    hass.states.async_set(
        "sensor.office_temperature",
        "22.8",
        {
            "friendly_name": "Office",
            "unit_of_measurement": "°C",
            "device_class": "temperature",
        },
    )

    result = EntityStateProvider(hass).get_many({"sensor.office_temperature"})

    assert result == {
        "sensor.office_temperature": {
            "state": "22.8",
            "unit": "°C",
            "name": "Office",
            "iconPath": (
                "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 "
                "13 5V8H11V5A1 1 0 0 1 12 4Z"
            ),
        }
    }


async def test_weather_provider_combines_entity_state_and_daily_forecast(hass) -> None:
    hass.states.async_set(
        "weather.home",
        "partlycloudy",
        {
            "friendly_name": "Home",
            "temperature": 18.4,
            "temperature_unit": "°C",
            "apparent_temperature": 17.2,
            "humidity": 72,
        },
    )
    service_response = {
        "weather.home": {
            "forecast": [
                {
                    "datetime": "2026-08-26T12:00:00+02:00",
                    "condition": "rainy",
                    "temperature": 20,
                    "templow": 13,
                    "uv_index": 3,
                    "precipitation_probability": 70,
                }
            ]
        }
    }

    with patch.object(
        type(hass.services),
        "async_call",
        AsyncMock(return_value=service_response),
    ) as async_call:
        result = await WeatherForecastProvider(hass).async_get_many({"weather.home"})

    async_call.assert_awaited_once_with(
        "weather",
        "get_forecasts",
        {"type": "daily"},
        blocking=True,
        target={"entity_id": ["weather.home"]},
        return_response=True,
    )
    current = result["weather.home"]
    assert current["entity_id"] == "weather.home"
    assert current["name"] == "Home"
    assert current["condition"] == "partlycloudy"
    assert current["condition_label"] == "Partly cloudy"
    assert current["temperature"] == 18.4
    assert current["temperature_unit"] == "°C"
    assert current["apparent_temperature"] == 17.2
    assert current["humidity"] == 72
    assert current["updated_at"]
    forecast = current["forecast"][0]
    assert forecast["datetime"] == "2026-08-26T12:00:00+02:00"
    assert forecast["condition"] == "rainy"
    assert forecast["condition_label"] == "Rain"
    assert forecast["icon"] == ("https://trmnl.com/images/plugins/weather/wi-rain.svg")
    assert forecast["temperature"] == 20
    assert forecast["templow"] == 13
    assert forecast["uv_index"] == 3
    assert forecast["uv_label"] == "Moderate"
    assert forecast["precipitation_probability"] == 70


async def test_weather_provider_uses_explicit_nulls_for_optional_values(hass) -> None:
    hass.states.async_set(
        "weather.home",
        "cloudy",
        {
            "friendly_name": "Home",
            "temperature": 16,
            "temperature_unit": "°C",
        },
    )
    service_response = {
        "weather.home": {
            "forecast": [
                {
                    "datetime": "2026-08-27T12:00:00+02:00",
                    "condition": "cloudy",
                    "temperature": 19,
                }
            ]
        }
    }

    with patch.object(
        type(hass.services),
        "async_call",
        AsyncMock(return_value=service_response),
    ):
        result = await WeatherForecastProvider(hass).async_get_many({"weather.home"})

    current = result["weather.home"]
    assert current["apparent_temperature"] is None
    assert current["humidity"] is None
    assert current["forecast"][0]["templow"] is None
    assert current["forecast"][0]["uv_index"] is None
    assert current["forecast"][0]["uv_label"] is None
    assert current["forecast"][0]["precipitation_probability"] is None


async def test_weather_provider_keeps_current_conditions_when_forecast_fails(
    hass,
) -> None:
    """A forecast service failure must not blank the entire display."""
    hass.states.async_set(
        "weather.home",
        "rainy",
        {
            "friendly_name": "Home",
            "temperature": 12,
            "temperature_unit": "°C",
            "humidity": 88,
        },
    )

    with patch.object(
        type(hass.services),
        "async_call",
        AsyncMock(side_effect=HomeAssistantError("forecast unavailable")),
    ):
        result = await WeatherForecastProvider(hass).async_get_many({"weather.home"})

    current = result["weather.home"]
    assert current["condition"] == "rainy"
    assert current["temperature"] == 12
    assert current["humidity"] == 88
    assert current["forecast"] == []
