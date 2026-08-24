"""Resolve explicitly requested Home Assistant data for widgets."""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta

from homeassistant.components.calendar import DATA_COMPONENT, CalendarEntity
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


class EntityStateProvider:
    """Normalize current state-machine values."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the provider."""
        self._hass = hass

    def get_many(self, entity_ids: set[str]) -> dict[str, dict[str, str]]:
        """Resolve each unique entity once."""
        result: dict[str, dict[str, str]] = {}
        for entity_id in entity_ids:
            state = self._hass.states.get(entity_id)
            if state is None:
                result[entity_id] = {
                    "state": "Unavailable",
                    "unit": "",
                    "name": entity_id,
                }
                continue
            result[entity_id] = {
                "state": state.state,
                "unit": str(state.attributes.get("unit_of_measurement", "")),
                "name": str(state.attributes.get("friendly_name", entity_id)),
            }
        return result


class CalendarProvider:
    """Fetch and normalize events from requested calendar entities."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the provider."""
        self._hass = hass

    async def async_get_many(
        self, requests: dict[str, int]
    ) -> dict[str, list[dict[str, str | bool | int]]]:
        """Resolve each calendar once using its maximum requested horizon."""
        pairs = await asyncio.gather(
            *(self._async_get(entity_id, days) for entity_id, days in requests.items())
        )
        return dict(pairs)

    async def _async_get(
        self, entity_id: str, days: int
    ) -> tuple[str, list[dict[str, str | bool | int]]]:
        component = self._hass.data.get(DATA_COMPONENT)
        entity = component.get_entity(entity_id) if component is not None else None
        if not isinstance(entity, CalendarEntity):
            return entity_id, []
        start = dt_util.now()
        events = await entity.async_get_events(
            self._hass, start, start + timedelta(days=days)
        )
        normalized: list[dict[str, str | bool | int]] = []
        for event in events:
            event_start = event.start
            all_day = isinstance(event_start, date) and not isinstance(
                event_start, datetime
            )
            if isinstance(event_start, datetime):
                local_start = dt_util.as_local(event_start)
                start_value = local_start.isoformat()
                time_value = local_start.strftime("%H:%M")
                date_value = local_start.strftime("%a %d %b")
            else:
                start_value = event_start.isoformat()
                time_value = "All day"
                date_value = event_start.strftime("%a %d %b")
            normalized.append(
                {
                    "summary": event.summary or "Untitled event",
                    "start": start_value,
                    "time": time_value,
                    "date": date_value,
                    "location": event.location or "",
                    "description": event.description or "",
                    "allDay": all_day,
                    "dayOffset": max(
                        0,
                        (
                            (
                                event_start.date()
                                if isinstance(event_start, datetime)
                                else event_start
                            )
                            - start.date()
                        ).days,
                    ),
                }
            )
        return entity_id, normalized
