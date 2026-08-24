"""Resolve explicitly requested Home Assistant data for widgets."""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta

from homeassistant.components.calendar import DATA_COMPONENT, CalendarEntity
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

ICON_PATHS = {
    "calendar": "M7 11H9V13H7V11M21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5M5 7H19V5H5V7M19 19V9H5V19H19M15 13V11H17V13H15M11 13V11H13V13H11M7 15H9V17H7V15M15 17V15H17V17H15M11 17V15H13V17H11Z",
    "default": "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",
    "heat": "M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z",
    "humidity": "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
    "illuminance": "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",
    "light": "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
    "power": "M7,2H17L13.5,9H17L10,22V14H7V2M9,4V12H12V14.66L14,11H10.24L13.76,4H9Z",
    "pressure": "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z",
    "switch": "M17 6H7C3.69 6 1 8.69 1 12S3.69 18 7 18H17C20.31 18 23 15.31 23 12S20.31 6 17 6M17 16H7C4.79 16 3 14.21 3 12S4.79 8 7 8H17C19.21 8 21 9.79 21 12S19.21 16 17 16M17 9C15.34 9 14 10.34 14 12S15.34 15 17 15 20 13.66 20 12 18.66 9 17 9Z",
    "temperature": "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
}

MDI_ICON_KEYS = {
    "mdi:flash-outline": "power",
    "mdi:gauge": "pressure",
    "mdi:lightbulb-outline": "light",
    "mdi:radiator": "heat",
    "mdi:thermometer": "temperature",
    "mdi:toggle-switch-outline": "switch",
    "mdi:water-percent": "humidity",
}


def _entity_icon_path(entity_id: str, attributes: dict[str, object]) -> str:
    """Choose a deterministic local icon without external image requests."""
    configured = attributes.get("icon")
    if isinstance(configured, str) and configured in MDI_ICON_KEYS:
        return ICON_PATHS[MDI_ICON_KEYS[configured]]
    device_class = str(attributes.get("device_class", ""))
    key = {
        "current": "power",
        "energy": "power",
        "humidity": "humidity",
        "illuminance": "illuminance",
        "power": "power",
        "pressure": "pressure",
        "temperature": "temperature",
        "voltage": "power",
    }.get(device_class)
    if key is None:
        key = {
            "calendar": "calendar",
            "climate": "heat",
            "light": "light",
            "switch": "switch",
        }.get(entity_id.partition(".")[0], "default")
    return ICON_PATHS[key]


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
                    "iconPath": ICON_PATHS["default"],
                }
                continue
            result[entity_id] = {
                "state": state.state,
                "unit": str(state.attributes.get("unit_of_measurement", "")),
                "name": str(state.attributes.get("friendly_name", entity_id)),
                "iconPath": _entity_icon_path(entity_id, state.attributes),
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
