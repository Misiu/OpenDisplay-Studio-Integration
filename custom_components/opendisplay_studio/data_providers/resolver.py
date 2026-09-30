"""Collect what every widget instance needs and fetch each distinct source once."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING, Any

from homeassistant.exceptions import HomeAssistantError

from . import DataProvider, ParamsKey, params_key

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

type RequestKey = tuple[str, str, ParamsKey]

OPTION_REFERENCE_PREFIX = "@options."


def provider_params(
    manifest: dict[str, Any], provider_name: str, options: dict[str, Any]
) -> dict[str, Any]:
    """Return a provider's parameters, with `@options.<key>` replaced by the option."""
    params = manifest["data"].get(provider_name, {})
    return {
        name: options[value.removeprefix(OPTION_REFERENCE_PREFIX)]
        if isinstance(value, str) and value.startswith(OPTION_REFERENCE_PREFIX)
        else value
        for name, value in params.items()
    }


class DataResolver:
    """Deduplicates the requests of all widget instances in one render."""

    def __init__(self, providers: dict[str, DataProvider]) -> None:
        """Resolve requests through `providers`, keyed by name."""
        self._providers = providers
        self._keys: set[RequestKey] = set()
        self._results: dict[RequestKey, Any] = {}
        self.warnings: list[str] = []

    def request(
        self, provider_name: str, source_id: str, params: dict[str, Any]
    ) -> RequestKey:
        """Register a need; the returned key reads the value after `async_resolve`."""
        key = (provider_name, source_id, params_key(params))
        self._keys.add(key)
        return key

    async def async_resolve(self, hass: HomeAssistant, language: str) -> None:
        """Fetch every distinct request once, concurrently."""
        keys = sorted(self._keys, key=repr)
        results = await asyncio.gather(
            *(self._fetch(hass, key, language) for key in keys)
        )
        self._results = dict(zip(keys, results, strict=True))

    async def _fetch(self, hass: HomeAssistant, key: RequestKey, language: str) -> Any:
        provider_name, source_id, params = key
        provider = self._providers[provider_name]
        try:
            return await provider.async_fetch(hass, source_id, dict(params), language)
        except (HomeAssistantError, KeyError, ValueError) as err:
            self.warnings.append(f"{source_id}: {err}")
            return provider.placeholder(source_id)

    def value(self, key: RequestKey) -> Any:
        """Return what was fetched for a registered request."""
        return self._results[key]

    @property
    def source_ids(self) -> set[str]:
        """Return every source read, so the preview can refresh when one changes."""
        return {source_id for _, source_id, _ in self._keys}
