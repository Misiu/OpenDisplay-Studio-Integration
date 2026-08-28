"""Home Assistant data provider owned by the Sensor widget package."""

from __future__ import annotations

import asyncio
import json
import re
from collections.abc import Mapping
from pathlib import Path
from typing import Any, cast

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.icon import async_get_icons
from homeassistant.util import dt as dt_util

TRANSLATIONS_DIRECTORY = Path(__file__).with_name("translations")
MDI_ICON_PATTERN = re.compile(r"mdi:([a-z0-9]+(?:-[a-z0-9]+)*)")
DEFAULT_ICON = "mdi-eye"


def _translation_file(language: str) -> Path:
    """Resolve a validated language name inside this widget package."""
    return TRANSLATIONS_DIRECTORY / f"{language}.json"


def _read_translation_file(path: Path) -> dict[str, str]:
    """Read one flat widget translation resource."""
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        return {}
    return {
        str(key): str(label) for key, label in value.items() if isinstance(label, str)
    }


def _load_widget_labels(language: str) -> dict[str, str]:
    """Load English, base-language, and exact-locale widget labels."""
    labels = _read_translation_file(_translation_file("en"))
    candidates = [language.partition("-")[0], language]
    for candidate in dict.fromkeys(candidates):
        path = _translation_file(candidate)
        if candidate != "en" and path.is_file():
            labels.update(_read_translation_file(path))
    return labels


def _mdi_class(value: object) -> str | None:
    """Convert a supported Home Assistant MDI identifier into a CSS class."""
    if not isinstance(value, str):
        return None
    match = MDI_ICON_PATTERN.fullmatch(value)
    return f"mdi-{match.group(1)}" if match else None


def _range_icon(state: str, ranges: object) -> str | None:
    """Resolve the highest Home Assistant icon range not above the state."""
    if not isinstance(ranges, dict):
        return None
    try:
        numeric_state = float(state)
    except ValueError:
        return None
    thresholds: list[tuple[float, str]] = []
    for threshold, icon in ranges.items():
        icon_class = _mdi_class(icon)
        if icon_class is None:
            continue
        try:
            thresholds.append((float(threshold), icon_class))
        except TypeError, ValueError:
            continue
    eligible = [item for item in thresholds if item[0] <= numeric_state]
    return max(eligible, default=(0, ""), key=lambda item: item[0])[1] or None


def _resource_icon(
    state: str,
    device_class: object,
    resources: dict[str, Any],
) -> str:
    """Resolve the Sensor component's state, range, or default icon."""
    sensor_resources = resources.get("sensor")
    if not isinstance(sensor_resources, dict):
        return DEFAULT_ICON
    resource = (
        sensor_resources.get(device_class) if isinstance(device_class, str) else None
    )
    if not isinstance(resource, dict):
        resource = sensor_resources.get("_")
    if not isinstance(resource, dict):
        return DEFAULT_ICON

    state_icons = resource.get("state")
    if isinstance(state_icons, dict) and (
        state_icon := _mdi_class(state_icons.get(state))
    ):
        return state_icon
    if range_icon := _range_icon(state, resource.get("range")):
        return range_icon
    return _mdi_class(resource.get("default")) or DEFAULT_ICON


def _sensor_icon(
    state: str,
    attributes: Mapping[str, Any],
    registry_icon: object,
    resources: dict[str, Any],
) -> str:
    """Follow Home Assistant's icon precedence for a Sensor entity."""
    return (
        _mdi_class(registry_icon)
        or _mdi_class(attributes.get("icon"))
        or _resource_icon(state, attributes.get("device_class"), resources)
    )


def _placeholder(entity_id: str, labels: dict[str, str]) -> dict[str, str]:
    """Return a complete Sensor template contract without live state."""
    return {
        "entity_id": entity_id,
        "name": entity_id or labels["choose_sensor"],
        "state": "—",
        "unit": "",
        "icon": DEFAULT_ICON,
        "updated_at": "",
    }


class SensorDataProvider:
    """Collect and normalize current Sensor state values."""

    name = "sensor"

    def new_request(self) -> set[str]:
        """Create an empty entity ID set."""
        return set()

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None:
        """Add selected Sensor entity IDs to the aggregate request."""
        del config, requirement
        cast("set[str]", request).update(sources)

    async def async_resolve(
        self, hass: HomeAssistant, request: object, language: str
    ) -> dict[str, Any]:
        """Resolve states, automatic icons, units, names, and update times."""
        labels, resources = await asyncio.gather(
            hass.async_add_executor_job(_load_widget_labels, language),
            async_get_icons(
                hass,
                "entity_component",
                integrations={"sensor"},
            ),
        )
        registry = er.async_get(hass)
        values: dict[str, dict[str, str]] = {}
        for entity_id in sorted(cast("set[str]", request)):
            state = hass.states.get(entity_id)
            if state is None:
                values[entity_id] = _placeholder(entity_id, labels)
                continue
            registry_entry = registry.async_get(entity_id)
            raw_state = state.state
            display_state = {
                STATE_UNAVAILABLE: labels["unavailable"],
                STATE_UNKNOWN: labels["unknown"],
            }.get(raw_state, raw_state)
            values[entity_id] = {
                "entity_id": entity_id,
                "name": str(state.attributes.get("friendly_name", entity_id)),
                "state": display_state,
                "unit": str(state.attributes.get("unit_of_measurement", "")),
                "icon": _sensor_icon(
                    raw_state,
                    state.attributes,
                    getattr(registry_entry, "icon", None),
                    resources,
                ),
                "updated_at": dt_util.as_local(state.last_changed).strftime("%H:%M"),
            }
        return {"values": values, "labels": labels}

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]:
        """Map normalized Sensor entities back to one widget."""
        del config
        result = cast("dict[str, Any]", resolved)
        entities = cast("dict[str, dict[str, str]]", result["values"])
        labels = cast("dict[str, str]", result["labels"])
        values = [
            dict(entities.get(source, _placeholder(source, labels)))
            for source in sources
        ]
        if not values and requirement.get("cardinality") != "many":
            values = [_placeholder("", labels)]
        return values


PROVIDER = SensorDataProvider()
