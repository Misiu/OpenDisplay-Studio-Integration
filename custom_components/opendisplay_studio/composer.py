"""Resolve widget data and compose one final TRMNL HTML document."""

from __future__ import annotations

from dataclasses import dataclass
from time import perf_counter
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .data_providers import CalendarProvider, EntityStateProvider
from .liquid_renderer import LIQUID
from .projects import Project
from .widgets import TEMPLATES, definition, with_defaults


@dataclass(frozen=True, slots=True)
class ComposedProject:
    """Final renderer input and integration-side timing."""

    html: str
    data_ms: float
    liquid_ms: float
    compose_ms: float


class ProjectComposeError(Exception):
    """Raised when current Home Assistant data cannot be resolved."""


def _requirement_sources(
    config: dict[str, Any], requirement: dict[str, Any]
) -> list[str]:
    """Read one or many configured provider source IDs."""
    value = config.get(requirement["configKey"])
    if requirement.get("cardinality") == "many":
        return [str(item) for item in value] if isinstance(value, list) else []
    return [str(value)] if value else []


def _calendar_value(
    events: list[dict[str, str | bool | int]],
    *,
    days: int,
    time_24h: bool,
) -> dict[str, list[dict[str, str | bool | int]]]:
    """Apply presentation range and time format to normalized events."""
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


def _collect_requirements(
    project: Project,
) -> tuple[set[str], dict[str, int]]:
    """Compile widget declarations into one deduplicated screen request."""
    entity_ids: set[str] = set()
    calendar_requests: dict[str, int] = {}
    for region in project["regions"]:
        widget = region.get("widget")
        if widget is None:
            continue
        config = with_defaults(widget["type"], widget["config"])
        for requirement in definition(widget["type"])["dataRequirements"]:
            sources = _requirement_sources(config, requirement)
            if requirement["provider"] == "entity_state":
                entity_ids.update(sources)
            elif requirement["provider"] == "calendar":
                range_key = requirement.get("rangeConfigKey", "days")
                days = max(1, min(31, int(config.get(range_key, 7))))
                for entity_id in sources:
                    calendar_requests[entity_id] = max(
                        calendar_requests.get(entity_id, 0), days
                    )
    return entity_ids, calendar_requests


def _resolve_widget_data(
    widget_type: str,
    config: dict[str, Any],
    entities: dict[str, dict[str, str]],
    calendars: dict[str, list[dict[str, str | bool | int]]],
) -> dict[str, Any]:
    """Hydrate declared requirements with normalized provider values."""
    data: dict[str, Any] = {}
    for requirement in definition(widget_type)["dataRequirements"]:
        sources = _requirement_sources(config, requirement)
        values: list[Any] = []
        if requirement["provider"] == "entity_state":
            values = [
                entities.get(
                    source,
                    {"state": "Unavailable", "unit": "", "name": source},
                )
                for source in sources
            ]
        elif requirement["provider"] == "calendar":
            range_key = requirement.get("rangeConfigKey", "days")
            values = [
                _calendar_value(
                    calendars.get(source, []),
                    days=int(config.get(range_key, 7)),
                    time_24h=bool(config.get("time24h", True)),
                )
                for source in sources
            ]
        data[requirement["key"]] = (
            values
            if requirement.get("cardinality") == "many"
            else values[0]
            if values
            else None
        )
    return data


async def async_compose_project(
    hass: HomeAssistant, project: Project
) -> ComposedProject:
    """Collect requirements once, render fragments, and create one screen."""
    started = perf_counter()
    entity_ids, calendar_requests = _collect_requirements(project)
    entities = EntityStateProvider(hass).get_many(entity_ids)
    try:
        calendars = await CalendarProvider(hass).async_get_many(calendar_requests)
    except HomeAssistantError as err:
        raise ProjectComposeError("Could not resolve widget data") from err
    data_ms = (perf_counter() - started) * 1_000

    liquid_ms = 0.0
    fragments: list[str] = []
    for region in project["regions"]:
        widget = region.get("widget")
        fragment = ""
        if widget is not None:
            widget_type = widget["type"]
            config = with_defaults(widget_type, widget["config"])
            data = _resolve_widget_data(widget_type, config, entities, calendars)
            result = LIQUID.render(
                TEMPLATES[widget_type], {"config": config, "data": data}
            )
            fragment = result.html
            liquid_ms += result.milliseconds
        style = (
            f"grid-row:{region['row']} / span {region['rowSpan']};"
            f"grid-column:{region['column']} / span {region['columnSpan']};"
        )
        fragments.append(
            f'<section class="studio-region" style="{style}">{fragment}</section>'
        )

    mode = {
        "bwr": "screen--color-3bwr",
        "bwy": "screen--color-3bwr",
        "bwry": "screen--color-4bwry",
        "spectra6": "screen--color-4bwry",
    }.get(project["palette"], "screen--1bit")
    grid = project["grid"]
    body = "".join(fragments)
    html = (
        f'<main class="screen {mode}"><div class="view view--full">'
        f'<div class="studio-grid" style="display:grid;grid-template-columns:'
        f"repeat({grid['columns']},minmax(0,1fr));grid-template-rows:"
        f"repeat({grid['rows']},minmax(0,1fr));gap:8px;width:100%;height:100%;"
        'padding:8px;box-sizing:border-box">'
        f"{body}</div></div></main>"
    )
    compose_ms = (perf_counter() - started) * 1_000
    return ComposedProject(html, data_ms, liquid_ms, compose_ms)
