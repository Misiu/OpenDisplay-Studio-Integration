"""Current conditions and the forecast of a weather entity."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, override

from homeassistant.util import dt as dt_util

from . import DataProvider, response_items

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def _forecast_item(raw: dict[str, Any]) -> dict[str, Any]:
    moment = dt_util.parse_datetime(str(raw.get("datetime", "")))
    return {
        "datetime": dt_util.as_local(moment) if moment else None,
        "condition": raw.get("condition"),
        "temperature": raw.get("temperature"),
        "templow": raw.get("templow"),
        "precipitation": raw.get("precipitation"),
    }


class WeatherForecastProvider(DataProvider):
    """A weather entity's current conditions plus its daily or hourly forecast."""

    name = "weather_forecast"

    @override
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> dict[str, Any]:
        del language
        state = hass.states.get(source_id)
        if state is None:
            return self.placeholder(source_id)
        attributes = state.attributes
        response = await hass.services.async_call(
            "weather",
            "get_forecasts",
            {"entity_id": source_id, "type": params.get("type", "daily")},
            blocking=True,
            return_response=True,
        )
        return {
            "id": source_id,
            "missing": False,
            "name": str(attributes.get("friendly_name", source_id)),
            "condition": state.state,
            "temperature": attributes.get("temperature"),
            "apparent_temperature": attributes.get("apparent_temperature"),
            "humidity": attributes.get("humidity"),
            "wind_speed": attributes.get("wind_speed"),
            "temperature_unit": str(attributes.get("temperature_unit", "°C")),
            "wind_speed_unit": str(attributes.get("wind_speed_unit", "")),
            "forecast": [
                _forecast_item(item)
                for item in response_items(response, source_id, "forecast")
            ],
        }

    @override
    def placeholder(self, source_id: str) -> dict[str, Any]:
        return {
            "id": source_id,
            "missing": True,
            "name": source_id,
            "condition": "unknown",
            "temperature": None,
            "apparent_temperature": None,
            "humidity": None,
            "wind_speed": None,
            "temperature_unit": "°C",
            "wind_speed_unit": "",
            "forecast": [],
        }
