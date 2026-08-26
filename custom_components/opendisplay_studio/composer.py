"""Resolve widget data and compose one final TRMNL HTML document."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from time import perf_counter
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .data_providers import (
    ICON_PATHS,
    CalendarProvider,
    EntityStateProvider,
    WeatherForecastProvider,
)
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


STUDIO_STYLES = """
<style>
  .studio-screen{width:var(--studio-width)!important;height:var(--studio-height)!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#fff;box-sizing:border-box}
  .studio-screen .view--full{width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important}
  .studio-grid{display:grid;width:100%;height:100%;padding:var(--studio-gap);gap:var(--studio-gap);box-sizing:border-box}
  .studio-region{position:relative;min-width:0;min-height:0;overflow:hidden;background:#fff;box-sizing:border-box;container-type:size;container-name:od-region}
  .studio-region>.item{width:100%!important;height:100%!important;margin:0!important;padding:0!important}
  .studio-entity,.studio-entity__content{width:100%;height:100%;box-sizing:border-box}
  .studio-entity__content{display:flex!important;align-items:center;justify-content:center;gap:clamp(4px,4cqh,14px);padding:clamp(7px,7cqh,22px)!important;overflow:hidden}
  .studio-entity__icon{display:block;flex:0 0 auto;width:clamp(20px,22cqh,58px);height:clamp(20px,22cqh,58px);fill:currentColor}
  .studio-entity__name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:clamp(9px,7cqh,20px)!important;font-weight:700!important;line-height:1!important;text-transform:none!important}
  .studio-entity__reading{display:flex;min-width:0;align-items:baseline;justify-content:center;gap:.18em;white-space:nowrap}
  .studio-entity__value{font-size:clamp(25px,34cqh,84px)!important;font-weight:500!important;line-height:.9!important;letter-spacing:-.045em!important}
  .studio-entity__unit{font-size:clamp(9px,10cqh,24px)!important;font-weight:700!important;line-height:1!important}
  .studio-entity__rule{display:none;background:currentColor}
  .studio-entity--square .studio-entity__content{flex-direction:column}
  .studio-entity--square .studio-entity__icon{width:clamp(22px,20cqw,64px);height:clamp(22px,20cqw,64px)}
  .studio-entity--square .studio-entity__name{max-width:100%;font-size:clamp(9px,7cqw,19px)!important}
  .studio-entity--square .studio-entity__value{font-size:clamp(25px,27cqw,78px)!important}
  .studio-entity--wide .studio-entity__content{flex-direction:row}
  .studio-entity--wide .studio-entity__name{flex:1 1 auto}
  .studio-entity--wide .studio-entity__rule{display:block;width:1px;height:60%;flex:0 0 1px}
  .studio-entity--wide .studio-entity__reading{flex:0 1 auto;margin-left:auto}
  .studio-entity--tall .studio-entity__content{flex-direction:column}
  .studio-entity--tall .studio-entity__icon{width:clamp(22px,32cqw,62px);height:clamp(22px,32cqw,62px)}
  .studio-entity--tall .studio-entity__name{max-width:100%;font-size:clamp(8px,12cqw,18px)!important}
  .studio-entity--tall .studio-entity__rule{display:block;width:70%;height:1px;flex:0 0 1px}
  .studio-entity--tall .studio-entity__reading{flex-direction:column;align-items:center;gap:2px}
  .studio-entity--tall .studio-entity__value{font-size:clamp(24px,35cqw,66px)!important}
  .studio-entity--tall .studio-entity__unit{font-size:clamp(9px,15cqw,20px)!important}
</style>
"""


def _screen_size(width: int, height: int) -> str:
    """Map arbitrary display dimensions to the nearest TRMNL size tier."""
    longest = max(width, height)
    if longest <= 400:
        return "screen--sm"
    if longest >= 1_000:
        return "screen--lg"
    return "screen--md"


def _region_size(
    project: Project, region: dict[str, Any], *, gap: int
) -> tuple[float, float]:
    """Calculate the physical CSS-pixel size of one grid region."""
    grid = project["grid"]
    project_width = int(project.get("width", 800))
    project_height = int(project.get("height", 480))
    cell_width = (project_width - gap * (grid["columns"] + 1)) / grid["columns"]
    cell_height = (project_height - gap * (grid["rows"] + 1)) / grid["rows"]
    width = cell_width * region["columnSpan"] + gap * (region["columnSpan"] - 1)
    height = cell_height * region["rowSpan"] + gap * (region["rowSpan"] - 1)
    return width, height


def _region_shape(project: Project, region: dict[str, Any], *, gap: int) -> str:
    """Classify a region using its physical aspect ratio, not grid spans alone."""
    width, height = _region_size(project, region, gap=gap)
    ratio = width / max(1, height)
    if ratio >= 1.55:
        return "wide"
    if ratio <= 0.72:
        return "tall"
    return "square"


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
) -> tuple[set[str], dict[str, int], set[str]]:
    """Compile widget declarations into one deduplicated screen request."""
    entity_ids: set[str] = set()
    calendar_requests: dict[str, int] = {}
    weather_requests: set[str] = set()
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
            elif requirement["provider"] == "weather_forecast":
                weather_requests.update(sources)
    return entity_ids, calendar_requests, weather_requests


def _resolve_widget_data(
    widget_type: str,
    config: dict[str, Any],
    entities: dict[str, dict[str, str]],
    calendars: dict[str, list[dict[str, str | bool | int]]],
    weather: dict[str, dict[str, Any]],
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
                    {
                        "state": "Unavailable",
                        "unit": "",
                        "name": source,
                        "iconPath": ICON_PATHS["default"],
                    },
                )
                for source in sources
            ]
            if not values and requirement.get("cardinality") != "many":
                values = [
                    {
                        "state": "Unavailable",
                        "unit": "",
                        "name": "Choose an entity",
                        "iconPath": ICON_PATHS["default"],
                    }
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
        elif requirement["provider"] == "weather_forecast":
            values = [weather.get(source) for source in sources]
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
    entity_ids, calendar_requests, weather_requests = _collect_requirements(project)
    entities = EntityStateProvider(hass).get_many(entity_ids)
    try:
        calendars, weather = await asyncio.gather(
            CalendarProvider(hass).async_get_many(calendar_requests),
            WeatherForecastProvider(hass).async_get_many(weather_requests),
        )
    except HomeAssistantError as err:
        raise ProjectComposeError("Could not resolve widget data") from err
    data_ms = (perf_counter() - started) * 1_000

    liquid_ms = 0.0
    fragments: list[str] = []
    width = int(project.get("width", 800))
    height = int(project.get("height", 480))
    gap = max(3, min(10, round(min(width, height) / 60)))
    grid = project["grid"]
    full_canvas = (
        len(project["regions"]) == 1
        and project["regions"][0]["row"] == 1
        and project["regions"][0]["column"] == 1
        and project["regions"][0]["rowSpan"] == grid["rows"]
        and project["regions"][0]["columnSpan"] == grid["columns"]
    )
    layout_gap = 0 if full_canvas else gap
    for region in project["regions"]:
        widget = region.get("widget")
        fragment = ""
        if widget is not None:
            widget_type = widget["type"]
            config = with_defaults(widget_type, widget["config"])
            data = _resolve_widget_data(
                widget_type,
                config,
                entities,
                calendars,
                weather,
            )
            if widget_type == "entity-state" and data.get("entity") is not None:
                title = str(config.get("title", "")).strip()
                data["entity"]["displayName"] = title or data["entity"]["name"]
            result = LIQUID.render(
                TEMPLATES[widget_type],
                {
                    "config": config,
                    "data": data,
                    "region": {"shape": _region_shape(project, region, gap=layout_gap)},
                },
            )
            fragment = result.html
            liquid_ms += result.milliseconds
        region_width, region_height = _region_size(project, region, gap=layout_gap)
        ratio = region_width / max(1, region_height)
        style = (
            f"grid-row:{region['row']} / span {region['rowSpan']};"
            f"grid-column:{region['column']} / span {region['columnSpan']};"
            f"--od-region-width:{region_width:.3f};"
            f"--od-region-height:{region_height:.3f};"
            f"--od-region-aspect-ratio:{ratio:.6f};"
        )
        shape = _region_shape(project, region, gap=layout_gap)
        fragments.append(
            f'<section class="studio-region studio-region--{shape}" '
            f'data-region-width="{region_width:.3f}" '
            f'data-region-height="{region_height:.3f}" '
            f'data-region-aspect-ratio="{ratio:.6f}" '
            f'style="{style}">{fragment}</section>'
        )

    mode = {
        "bwr": "screen--color-3bwr",
        "bwy": "screen--color-3bwr",
        "bwry": "screen--color-4bwry",
        "spectra6": "screen--color-4bwry",
    }.get(project["palette"], "screen--1bit")
    body = "".join(fragments)
    size = _screen_size(width, height)
    portrait = " screen--portrait" if height > width else ""
    html = (
        f'<main class="screen {mode} {size}{portrait} studio-screen" '
        f'style="--studio-width:{width}px;--studio-height:{height}px;'
        f"--screen-w:{width}px;--screen-h:{height}px;"
        f'--studio-gap:{layout_gap}px">{STUDIO_STYLES}<div class="view view--full">'
        f'<div class="studio-grid" style="grid-template-columns:'
        f"repeat({grid['columns']},minmax(0,1fr));grid-template-rows:"
        f'repeat({grid["rows"]},minmax(0,1fr))">'
        f"{body}</div></div></main>"
    )
    compose_ms = (perf_counter() - started) * 1_000
    return ComposedProject(html, data_ms, liquid_ms, compose_ms)
