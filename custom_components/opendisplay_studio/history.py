"""
State history for `plot` elements, read once from the recorder per compile.

The renderer asks a data provider for history while it draws. Fetching it before the
render lets a plot without data be left out with a warning, where the renderer would
fail the whole picture.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any, Final

from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

DEFAULT_DURATION: Final = 24 * 60 * 60


class RecordedHistory:
    """History already fetched: answers the renderer's `DataProvider` protocol."""

    def __init__(self, records: dict[str, list[dict[str, str]]]) -> None:
        """Keep the records, per entity, oldest first."""
        self._records = records

    async def get_history(
        self, entity_ids: list[str], start: datetime, end: datetime
    ) -> dict[str, list[dict[str, str]]]:
        """Return each entity's records from `start`, oldest first."""
        return {
            entity_id: _within(self._records[entity_id], start, end)
            for entity_id in entity_ids
            if entity_id in self._records
        }


def _within(
    records: list[dict[str, str]], start: datetime, end: datetime
) -> list[dict[str, str]]:
    """Keep the records inside the range; the state in force at `start` opens it."""
    inside = [
        record
        for record in records
        if start <= datetime.fromisoformat(record["last_changed"]) <= end
    ]
    before = [
        record
        for record in records
        if datetime.fromisoformat(record["last_changed"]) < start
    ]
    if before and (not inside or inside[0] is not before[-1]):
        opening = {**before[-1], "last_changed": start.isoformat()}
        return [opening, *inside]
    return inside


def _has_numbers(records: list[dict[str, str]]) -> bool:
    for record in records:
        try:
            float(record["state"])
        except ValueError:
            continue
        return True
    return False


def _series_entities(plot: dict[str, Any]) -> list[str]:
    return [series["entity"] for series in plot["data"]]


async def async_prefetch_history(
    hass: HomeAssistant, elements: list[dict[str, Any]], warnings: list[str]
) -> tuple[list[dict[str, Any]], RecordedHistory | None]:
    """
    Return `elements` without the plots that have nothing to draw, and the history.

    A plot is dropped, and reported, when the recorder is not running or holds no
    numeric state for any of its entities in the plot's time span.
    """
    plots = [element for element in elements if element.get("type") == "plot"]
    if not plots:
        return elements, None
    records = await _async_fetch(hass, plots)
    kept: list[dict[str, Any]] = []
    for element in elements:
        if element.get("type") != "plot":
            kept.append(element)
        elif records is None:
            warnings.append("History plot: the recorder is not running")
        elif any(_has_numbers(records.get(e, [])) for e in _series_entities(element)):
            kept.append(element)
        else:
            entities = ", ".join(_series_entities(element))
            warnings.append(f"History plot: no numeric history for {entities}")
    return kept, RecordedHistory(records or {})


async def _async_fetch(
    hass: HomeAssistant, plots: list[dict[str, Any]]
) -> dict[str, list[dict[str, str]]] | None:
    """Read the longest span any plot asks for, for every entity the plots use."""
    if "recorder" not in hass.config.components:
        return None
    # Imported here: the recorder is an optional dependency of the integration.
    from homeassistant.components.recorder import (  # noqa: PLC0415
        get_instance,
        history,
    )

    seconds = max(plot.get("duration", DEFAULT_DURATION) for plot in plots)
    end = dt_util.utcnow()
    entities = sorted({e for plot in plots for e in _series_entities(plot)})
    states = await get_instance(hass).async_add_executor_job(
        history.get_significant_states,
        hass,
        end - timedelta(seconds=seconds),
        end,
        entities,
    )
    return {
        entity_id: [
            {"state": state.state, "last_changed": state.last_changed.isoformat()}
            for state in entity_states
            if not isinstance(state, dict)
        ]
        for entity_id, entity_states in states.items()
    }
