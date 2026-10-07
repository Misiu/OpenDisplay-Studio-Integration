"""An entity's current state and its numeric history, for widgets that draw a chart."""

from __future__ import annotations

from datetime import datetime
from math import ceil
from typing import TYPE_CHECKING, Any, Final, override

from custom_components.opendisplay_studio.history import async_fetch_records

from .entity_state import EntityStateProvider

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

DEFAULT_HOURS: Final = 24
MAX_POINTS: Final = 240
SECONDS_PER_HOUR: Final = 3600


def normalize_points(
    records: list[dict[str, str]], limit: int = MAX_POINTS
) -> list[dict[str, Any]]:
    """
    Return the numeric states as points, averaged down to at most `limit`.

    Non-numeric states (unavailable, unknown) are left out. A long history is cut
    into equal groups of neighbours, each becoming one point at the group's middle.
    """
    numeric: list[tuple[datetime, float]] = []
    for record in records:
        try:
            numeric.append(
                (datetime.fromisoformat(record["last_changed"]), float(record["state"]))
            )
        except ValueError:
            continue
    group = ceil(len(numeric) / limit) if numeric else 1
    points: list[dict[str, Any]] = []
    for start in range(0, len(numeric), group):
        chunk = numeric[start : start + group]
        middle = chunk[len(chunk) // 2][0]
        mean = sum(value for _, value in chunk) / len(chunk)
        points.append({"datetime": middle, "value": mean})
    return points


class EntityHistoryProvider(EntityStateProvider):
    """The state of an entity, plus its numeric history over `hours` hours."""

    name = "entity_history"

    @override
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> dict[str, Any]:
        current = await super().async_fetch(hass, source_id, params, language)
        hours = int(params.get("hours", DEFAULT_HOURS))
        records = await async_fetch_records(hass, [source_id], hours * SECONDS_PER_HOUR)
        recorded = records.get(source_id, []) if records else []
        return {**current, "points": normalize_points(recorded)}

    @override
    def placeholder(self, source_id: str) -> dict[str, Any]:
        return {**super().placeholder(source_id), "points": []}
