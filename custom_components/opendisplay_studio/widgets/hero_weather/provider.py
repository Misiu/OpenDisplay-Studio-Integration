"""Home Assistant provider owned by the Hero Weather widget package."""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any, cast

from homeassistant.components.weather import DOMAIN as WEATHER_DOMAIN
from homeassistant.components.weather import SERVICE_GET_FORECASTS
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.translation import async_get_translations

LOGGER = logging.getLogger("custom_components.opendisplay_studio")
TRANSLATIONS_DIRECTORY = Path(__file__).with_name("translations")


def _load_labels(language: str) -> dict[str, str]:
    """Load package-owned labels with English fallback."""
    labels = json.loads(
        (TRANSLATIONS_DIRECTORY / "en.json").read_text(encoding="utf-8")
    )
    for candidate in dict.fromkeys((language.partition("-")[0], language)):
        path = TRANSLATIONS_DIRECTORY / f"{candidate}.json"
        if candidate != "en" and path.is_file():
            localized = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(localized, dict):
                labels.update(localized)
    return {str(key): str(value) for key, value in labels.items()}


@dataclass(frozen=True, slots=True)
class HeroWeatherLocalizer:
    """Widget labels and Home Assistant weather condition translations."""

    labels: dict[str, str]
    conditions: dict[str, str]

    @classmethod
    async def async_create(
        cls, hass: HomeAssistant, language: str
    ) -> HeroWeatherLocalizer:
        """Resolve localized weather state names and package copy."""
        weather, labels = await asyncio.gather(
            async_get_translations(
                hass, language, "entity_component", integrations={WEATHER_DOMAIN}
            ),
            hass.async_add_executor_job(_load_labels, language),
        )
        prefix = "component.weather.entity_component._.state."
        conditions = {
            key.removeprefix(prefix): value
            for key, value in weather.items()
            if key.startswith(prefix)
        }
        return cls(labels=labels, conditions=conditions)

    def condition(self, value: str) -> str:
        """Translate one Home Assistant weather state."""
        if value in self.conditions:
            return self.conditions[value]
        return (
            value.replace("-", " ").capitalize()
            if value and value not in {"unknown", "unavailable"}
            else self.labels["unavailable"]
        )


@dataclass(frozen=True, slots=True)
class HeroWeatherResult:
    """Resolved entities and translations for one compose pass."""

    values: dict[str, dict[str, Any]]
    localizer: HeroWeatherLocalizer


def _placeholder(entity_id: str, localizer: HeroWeatherLocalizer) -> dict[str, Any]:
    """Return a complete deterministic no-data contract."""
    return {
        "entity_id": entity_id,
        "temperature": "—",
        "temperature_unit": "",
        "condition": localizer.labels["unavailable"],
        "high": None,
        "low": None,
    }


class HeroWeatherDataProvider:
    """Resolve current conditions and today's daily forecast."""

    name = "hero_weather"

    def new_request(self) -> set[str]:
        """Create an empty deduplicated entity request."""
        return set()

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None:
        """Add selected weather entity IDs."""
        del config, requirement
        cast("set[str]", request).update(sources)

    async def async_resolve(
        self, hass: HomeAssistant, request: object, language: str
    ) -> HeroWeatherResult:
        """Fetch daily forecasts once for all Hero Weather instances."""
        localizer = await HeroWeatherLocalizer.async_create(hass, language)
        entity_ids = sorted(cast("set[str]", request))
        if not entity_ids:
            return HeroWeatherResult({}, localizer)
        try:
            response = await hass.services.async_call(
                WEATHER_DOMAIN,
                SERVICE_GET_FORECASTS,
                {"type": "daily"},
                blocking=True,
                target={"entity_id": entity_ids},
                return_response=True,
            )
        except HomeAssistantError as err:
            LOGGER.warning(
                "Daily forecast is unavailable for Hero Weather; rendering "
                "current conditions only: %s",
                err,
            )
            response = {}
        forecast_response = response if isinstance(response, dict) else {}
        values: dict[str, dict[str, Any]] = {}
        for entity_id in entity_ids:
            state = hass.states.get(entity_id)
            attributes = state.attributes if state is not None else {}
            condition = state.state if state is not None else "unavailable"
            response_item = forecast_response.get(entity_id, {})
            forecasts = (
                response_item.get("forecast", [])
                if isinstance(response_item, dict)
                else []
            )
            today = forecasts[0] if isinstance(forecasts, list) and forecasts else {}
            if not isinstance(today, dict):
                today = {}
            values[entity_id] = {
                "entity_id": entity_id,
                "temperature": attributes.get("temperature", "—"),
                "temperature_unit": str(attributes.get("temperature_unit", "")),
                "condition": localizer.condition(condition),
                "high": today.get("temperature"),
                "low": today.get("templow"),
            }
        return HeroWeatherResult(values, localizer)

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]:
        """Map aggregate values to a single widget requirement."""
        del config
        result = cast("HeroWeatherResult", resolved)
        values = [
            dict(result.values.get(source, _placeholder(source, result.localizer)))
            for source in sources
        ]
        if not values and requirement.get("cardinality") != "many":
            values = [_placeholder("", result.localizer)]
        return values


PROVIDER = HeroWeatherDataProvider()
