"""Home Assistant data provider owned by the Calendar widget."""

from __future__ import annotations

import asyncio
from datetime import date, datetime, timedelta
from typing import Any, cast

from homeassistant.components.calendar import DATA_COMPONENT, CalendarEntity
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


async def _async_get_events(
    hass: HomeAssistant, entity_id: str, days: int
) -> tuple[str, list[dict[str, str | bool | int]]]:
    """Fetch and normalize events from one calendar entity."""
    component = hass.data.get(DATA_COMPONENT)
    entity = component.get_entity(entity_id) if component is not None else None
    if not isinstance(entity, CalendarEntity):
        return entity_id, []
    start = dt_util.now()
    events = await entity.async_get_events(hass, start, start + timedelta(days=days))
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
        event_date = (
            event_start.date() if isinstance(event_start, datetime) else event_start
        )
        normalized.append(
            {
                "summary": event.summary or "Untitled event",
                "start": start_value,
                "time": time_value,
                "date": date_value,
                "location": event.location or "",
                "description": event.description or "",
                "allDay": all_day,
                "dayOffset": max(0, (event_date - start.date()).days),
            }
        )
    return entity_id, normalized


def _calendar_value(
    events: list[dict[str, str | bool | int]],
    *,
    days: int,
    time_24h: bool,
) -> dict[str, list[dict[str, str | bool | int]]]:
    """Apply this widget's display range and time format."""
    visible_events = [
        dict(event) for event in events if int(event.get("dayOffset", 0)) < days
    ]
    if not time_24h:
        for event in visible_events:
            time_value = str(event["time"])
            if time_value != "All day":
                hours, minutes = (int(part) for part in time_value.split(":"))
                suffix = "AM" if hours < 12 else "PM"
                event["time"] = f"{hours % 12 or 12}:{minutes:02d} {suffix}"
    return {"events": visible_events}


class CalendarDataProvider:
    """Collect and resolve requirements for the Calendar widget package."""

    name = "calendar"

    def new_request(self) -> dict[str, int]:
        """Create an empty calendar range mapping."""
        return {}

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None:
        """Add selected calendars and their maximum requested ranges."""
        requests = cast("dict[str, int]", request)
        range_key = str(requirement.get("rangeConfigKey", "days"))
        days = max(1, min(31, int(config.get(range_key, 7))))
        for entity_id in sources:
            requests[entity_id] = max(requests.get(entity_id, 0), days)

    async def async_resolve(
        self, hass: HomeAssistant, request: object, language: str
    ) -> object:
        """Resolve events for every aggregate calendar request."""
        del language
        requests = cast("dict[str, int]", request)
        pairs = await asyncio.gather(
            *(
                _async_get_events(hass, entity_id, days)
                for entity_id, days in requests.items()
            )
        )
        return dict(pairs)

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]:
        """Map normalized calendar events back to one widget."""
        calendars = cast("dict[str, list[dict[str, str | bool | int]]]", resolved)
        range_key = str(requirement.get("rangeConfigKey", "days"))
        return [
            _calendar_value(
                calendars.get(source, []),
                days=int(config.get(range_key, 7)),
                time_24h=bool(config.get("time24h", True)),
            )
            for source in sources
        ]


PROVIDER = CalendarDataProvider()
