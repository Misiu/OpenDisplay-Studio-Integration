"""Upcoming events of a calendar, with times in Home Assistant's time zone."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import TYPE_CHECKING, Any, override

from homeassistant.util import dt as dt_util

from . import DataProvider, response_items

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

DEFAULT_DAYS = 14


def _moment(value: str) -> tuple[datetime, bool]:
    """Return a start or end as an aware datetime, and whether it was a plain date."""
    parsed = dt_util.parse_datetime(value)
    if parsed is not None:
        return dt_util.as_local(parsed), False
    day = date.fromisoformat(value)
    return datetime.combine(day, time.min, tzinfo=dt_util.get_default_time_zone()), True


def normalize_event(raw: dict[str, Any], source_id: str) -> dict[str, Any]:
    """Return one calendar event in the shape widgets read."""
    start, all_day = _moment(str(raw["start"]))
    end, _ = _moment(str(raw["end"]))
    return {
        "summary": str(raw.get("summary", "")),
        "start": start,
        "end": end,
        "all_day": all_day,
        "location": str(raw.get("location") or ""),
        "description": str(raw.get("description") or ""),
        "source": source_id,
    }


class CalendarEventsProvider(DataProvider):
    """Events from today's midnight to `days` days ahead."""

    name = "calendar_events"

    @override
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> dict[str, Any]:
        del language
        days = int(params.get("days", DEFAULT_DAYS))
        start = dt_util.start_of_local_day()
        response = await hass.services.async_call(
            "calendar",
            "get_events",
            {
                "entity_id": source_id,
                "start_date_time": start,
                "end_date_time": start + timedelta(days=days),
            },
            blocking=True,
            return_response=True,
        )
        events = [
            normalize_event(raw, source_id)
            for raw in response_items(response, source_id, "events")
        ]
        return {"id": source_id, "missing": False, "events": events}

    @override
    def placeholder(self, source_id: str) -> dict[str, Any]:
        return {"id": source_id, "missing": True, "events": []}
