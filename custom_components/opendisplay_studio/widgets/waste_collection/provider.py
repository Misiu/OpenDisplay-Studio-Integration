"""The next collection of a calendar: when its next event starts."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, override

from homeassistant.util import dt as dt_util

from custom_components.opendisplay_studio.data_providers import DataProvider

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


class NextCollectionProvider(DataProvider):
    """The start of the next event of a calendar, as the calendar entity reports it."""

    name = "next"

    @override
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> dict[str, Any]:
        del params, language
        state = hass.states.get(source_id)
        if state is None:
            return self.placeholder(source_id)
        raw = state.attributes.get("start_time")
        start = dt_util.parse_datetime(str(raw)) if raw else None
        return {
            "id": source_id,
            "missing": False,
            "name": str(state.attributes.get("friendly_name", source_id)),
            "start": dt_util.as_local(start) if start else None,
        }

    @override
    def placeholder(self, source_id: str) -> dict[str, Any]:
        return {"id": source_id, "missing": True, "name": source_id, "start": None}


PROVIDER = NextCollectionProvider()
