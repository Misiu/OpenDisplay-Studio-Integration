"""The state of entities, with the words a display needs."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, override

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN

from custom_components.opendisplay_studio.sdk.formatting import entity_icon
from custom_components.opendisplay_studio.sdk.locale import state_word

from . import DataProvider

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def display_state(raw_state: str, language: str) -> str:
    """Return a state in the dashboard's language, or unchanged when unknown."""
    return state_word(raw_state, language) or raw_state


class EntityStateProvider(DataProvider):
    """Current state, name, unit and icon of an entity."""

    name = "entity_state"

    @override
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> dict[str, Any]:
        del params
        state = hass.states.get(source_id)
        if state is None:
            return self.placeholder(source_id)
        device_class = state.attributes.get("device_class")
        return {
            "id": source_id,
            "missing": False,
            "name": str(state.attributes.get("friendly_name", source_id)),
            "state": state.state,
            "display_state": display_state(state.state, language),
            "unit": str(state.attributes.get("unit_of_measurement", "")),
            "icon": entity_icon(source_id, device_class),
            "device_class": device_class,
            "available": state.state not in {STATE_UNAVAILABLE, STATE_UNKNOWN},
            "last_changed": state.last_changed.isoformat(),
        }

    @override
    def placeholder(self, source_id: str) -> dict[str, Any]:
        return {
            "id": source_id,
            "missing": True,
            "name": source_id,
            "state": STATE_UNAVAILABLE,
            "display_state": "—",
            "unit": "",
            "icon": entity_icon(source_id),
            "device_class": None,
            "available": False,
            "last_changed": "",
        }
