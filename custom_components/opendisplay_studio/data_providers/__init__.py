"""Shared Home Assistant data providers that widgets read their data through."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

type ParamsKey = tuple[tuple[str, Any], ...]


def params_key(params: dict[str, Any]) -> ParamsKey:
    """Return hashable parameters, so identical requests can be shared."""
    return tuple(sorted(params.items()))


def response_items(response: object, source_id: str, key: str) -> list[dict[str, Any]]:
    """Return the list under `key` in a service response for one entity."""
    if not isinstance(response, dict):
        return []
    entity = response.get(source_id)
    items = entity.get(key) if isinstance(entity, dict) else None
    if not isinstance(items, list):
        return []
    return [item for item in items if isinstance(item, dict)]


class DataProvider(ABC):
    """
    Fetch and normalize the data of one source (an entity, a calendar, ...).

    A provider returns plain, localized data and never anything Home Assistant
    specific. The resolver asks it once per distinct source and parameters,
    however many widget instances need that.
    """

    name: str

    @abstractmethod
    async def async_fetch(
        self,
        hass: HomeAssistant,
        source_id: str,
        params: dict[str, Any],
        language: str,
    ) -> Any:
        """Return the normalized data of one source."""

    def placeholder(self, source_id: str) -> Any:
        """Return what a widget sees for a source that could not be read."""
        return {"id": source_id, "missing": True}


def built_in_providers() -> dict[str, DataProvider]:
    """Return the shared providers by name."""
    from .calendar_events import CalendarEventsProvider  # noqa: PLC0415
    from .entity_state import EntityStateProvider  # noqa: PLC0415
    from .weather_forecast import WeatherForecastProvider  # noqa: PLC0415

    providers: list[DataProvider] = [
        EntityStateProvider(),
        CalendarEventsProvider(),
        WeatherForecastProvider(),
    ]
    return {provider.name: provider for provider in providers}
