"""Current-state provider for the Temperature widget."""

from __future__ import annotations

from typing import Any, cast

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant


def _placeholder(entity_id: str) -> dict[str, str]:
    return {
        "entity_id": entity_id,
        "name": entity_id or "Choose a temperature entity",
        "state": "—",
        "unit": "",
    }


class TemperatureDataProvider:
    """Deduplicate and normalize selected temperature entities."""

    name = "entity-state"

    def new_request(self) -> set[str]:
        return set()

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None:
        del config, requirement
        cast("set[str]", request).update(sources)

    async def async_resolve(
        self, hass: HomeAssistant, request: object, language: str
    ) -> dict[str, dict[str, str]]:
        del language
        values: dict[str, dict[str, str]] = {}
        for entity_id in sorted(cast("set[str]", request)):
            state = hass.states.get(entity_id)
            if state is None:
                values[entity_id] = _placeholder(entity_id)
                continue
            raw_state = state.state
            display_state = {
                STATE_UNAVAILABLE: "Unavailable",
                STATE_UNKNOWN: "Unknown",
            }.get(raw_state, raw_state)
            values[entity_id] = {
                "entity_id": entity_id,
                "name": str(state.attributes.get("friendly_name", entity_id)),
                "state": display_state,
                "unit": str(state.attributes.get("unit_of_measurement", "")),
            }
        return values

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]:
        del config, requirement
        values = cast("dict[str, dict[str, str]]", resolved)
        return [
            dict(values.get(source, _placeholder(source))) for source in sources
        ] or [_placeholder("")]


PROVIDER = TemperatureDataProvider()
