"""The events of a calendar over the range the chosen view needs."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from typing import TYPE_CHECKING, Any, override

from homeassistant.util import dt as dt_util

from custom_components.opendisplay_studio.data_providers import (
    DataProvider,
    response_items,
)
from custom_components.opendisplay_studio.data_providers.calendar_events import (
    normalize_event,
)
from custom_components.opendisplay_studio.widgets.calendar.events import (
    MAX_WEEKS,
    WEEK_LENGTH,
    week_floor,
)

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

DEFAULT_LOOKAHEAD = 14


def fetch_range(params: dict[str, Any], now: datetime) -> tuple[datetime, int]:
    """
    Return where the range starts and how many days it has.

    A list starts today and looks `lookahead` days ahead. The weeks view starts on
    the first day of the week of today (rolling) or of the first of the month, and
    always asks for six weeks, so a grid can use as many rows as fit.
    """
    zone = dt_util.get_default_time_zone()
    today = now.date()
    if params.get("view") != "weeks":
        days = int(params.get("lookahead", DEFAULT_LOOKAHEAD))
        return datetime.combine(today, time.min, tzinfo=zone), days
    anchor = today if params.get("monthMode") == "rolling" else today.replace(day=1)
    first = week_floor(anchor, str(params.get("firstDay", "monday")))
    return datetime.combine(first, time.min, tzinfo=zone), MAX_WEEKS * WEEK_LENGTH


class CalendarProvider(DataProvider):
    """Events of one calendar from the start of the range of a view."""

    name = "events"

    @override
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> dict[str, Any]:
        del language
        start, days = fetch_range(params, dt_util.now())
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
        state = hass.states.get(source_id)
        return {
            "id": source_id,
            "missing": False,
            "name": str(state.attributes.get("friendly_name", "")) if state else "",
            "range_start": start.date().isoformat(),
            "events": [
                normalize_event(raw, source_id)
                for raw in response_items(response, source_id, "events")
            ],
        }

    @override
    def placeholder(self, source_id: str) -> dict[str, Any]:
        return {
            "id": source_id,
            "missing": True,
            "name": "",
            "range_start": "",
            "events": [],
        }


PROVIDER = CalendarProvider()
