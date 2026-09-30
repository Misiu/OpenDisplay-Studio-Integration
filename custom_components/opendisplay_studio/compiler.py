"""Compile semantic Studio dashboards into structured ODL elements."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from time import monotonic
from typing import Any

import yaml  # type: ignore[import-untyped]
from homeassistant.core import HomeAssistant

from .expressions import (
    Resolution,
    async_resolve_expressions,
    has_expressions,
)
from .flatten import (
    background_element,
    flatten_items,
    shift_primitive,
)
from .measure import primitive_box
from .odl import Box, DisplayContext, WidgetRenderContext
from .palette import accent_color_for_palette
from .raw_yaml import raw_elements
from .widgets import WidgetRegistry, with_defaults


class DashboardCompileError(RuntimeError):
    """A semantic item could not be compiled into ODL."""


@dataclass(frozen=True, slots=True)
class CompiledDashboard:
    """Renderer-ready ODL plus editor metadata."""

    elements: list[dict[str, Any]]
    item_bounds: dict[str, dict[str, int]]
    warnings: list[str]
    dependencies: Resolution
    yaml: str
    data_ms: float
    compile_ms: float


def _sources(config: dict[str, Any], requirement: dict[str, Any]) -> list[str]:
    config_key = requirement.get("configKey")
    if not isinstance(config_key, str):
        return []
    value = config.get(config_key)
    if isinstance(value, str):
        return [value] if value else []
    if isinstance(value, list):
        return [item for item in value if isinstance(item, str) and item]
    return []


def _frame_box(frame: dict[str, int]) -> Box:
    return Box(frame["x"], frame["y"], frame["width"], frame["height"])


def _measure_primitives(
    primitives: dict[str, dict[str, Any]],
) -> dict[str, dict[str, int]]:
    """Measure every primitive as the renderer draws it (loads fonts, so not async)."""
    return {
        item_id: primitive_box(primitive).as_dict()
        for item_id, primitive in primitives.items()
    }


async def async_compile_dashboard(  # noqa: PLR0915
    hass: HomeAssistant,
    dashboard: dict[str, Any],
    registry: WidgetRegistry,
) -> CompiledDashboard:
    """Resolve declared data once, then compile every item in z-order."""
    started = monotonic()
    aggregate: dict[tuple[str, str], object] = {}
    widget_specs: list[
        tuple[dict[str, Any], dict[str, Any], list[tuple[dict[str, Any], list[str]]]]
    ] = []
    warnings: list[str] = []
    display_value = dashboard["display"]
    resolution = Resolution(items=dashboard["items"])
    if has_expressions(dashboard["items"]):
        resolution = await async_resolve_expressions(
            hass,
            dashboard["items"],
            display_value["width"],
            display_value["height"],
        )
    warnings.extend(resolution.warnings)
    placed_items = flatten_items(resolution.items)
    for placed in placed_items:
        item = placed.item
        if item["kind"] != "widget" or placed.hidden:
            continue
        widget = item["widget"]
        config = with_defaults(widget["type"], widget["config"], registry)
        requirement_specs: list[tuple[dict[str, Any], list[str]]] = []
        for requirement in registry.definition(widget["type"])["dataRequirements"]:
            sources = _sources(config, requirement)
            if not sources and not requirement.get("optional", False):
                warnings.append(
                    f"{registry.definition(widget['type'])['name']}: choose {requirement['configKey']}"
                )
            provider_name = requirement["provider"]
            key = (widget["type"], provider_name)
            provider = registry.provider(*key)
            request = aggregate.setdefault(key, provider.new_request())
            provider.add_request(request, sources, config, requirement)
            requirement_specs.append((requirement, sources))
        widget_specs.append((item, config, requirement_specs))
    resolved: dict[tuple[str, str], object] = {}
    for key, request in aggregate.items():
        resolved[key] = await registry.provider(*key).async_resolve(
            hass, request, dashboard["language"]
        )
    data_done = monotonic()
    display = DisplayContext(
        width=display_value["width"],
        height=display_value["height"],
        palette=display_value["palette"],
        background=display_value["background"],
        accent_color=accent_color_for_palette(display_value["palette"]),
    )
    widget_contexts: dict[str, tuple[dict[str, Any], dict[str, Any]]] = {}
    for item, config, requirements in widget_specs:
        data: dict[str, Any] = {}
        for requirement, sources in requirements:
            key = (item["widget"]["type"], requirement["provider"])
            values = registry.provider(*key).values(
                resolved[key], sources, config, requirement
            )
            data[requirement["key"]] = (
                values if requirement.get("cardinality") == "many" else values[0]
            )
        widget_contexts[item["id"]] = (config, data)
    primitive_bounds = await asyncio.to_thread(
        _measure_primitives,
        {
            placed.item["id"]: shift_primitive(
                placed.item["primitive"], placed.x, placed.y
            )
            for placed in placed_items
            if placed.item["kind"] == "primitive"
        },
    )
    elements: list[dict[str, Any]] = []
    widget_elements: dict[str, list[dict[str, Any]]] = {}
    item_bounds: dict[str, dict[str, int]] = {}
    for placed in placed_items:
        item = placed.item
        try:
            if item["kind"] == "container":
                item_bounds[item["id"]] = Box(
                    placed.x + item["x"],
                    placed.y + item["y"],
                    item["width"],
                    item["height"],
                ).as_dict()
                if item["background"] is not None and not placed.hidden:
                    elements.append(background_element(item, placed.x, placed.y))
                continue
            if item["kind"] == "primitive":
                item_bounds[item["id"]] = primitive_bounds[item["id"]]
                if not placed.hidden:
                    elements.append(
                        shift_primitive(item["primitive"], placed.x, placed.y)
                    )
                continue
            box = _frame_box(item["frame"]).moved(placed.x, placed.y)
            item_bounds[item["id"]] = box.as_dict()
            if placed.hidden:
                continue
            content_box = box.inset(item.get("layout", {}).get("padding", 0))
            config, data = widget_contexts[item["id"]]
            context = WidgetRenderContext(
                instance_id=item["id"],
                box=content_box,
                display=display,
                language=dashboard["language"],
                config=config,
                data=data,
            )
            rendered = registry.renderer(item["widget"]["type"])(context)
            widget_elements[item["id"]] = rendered
            elements.extend(rendered)
        except (KeyError, TypeError, ValueError) as err:
            raise DashboardCompileError(f"Item {item['id']}: {err}") from err
    compiled_done = monotonic()
    return CompiledDashboard(
        elements=elements,
        item_bounds=item_bounds,
        warnings=warnings,
        dependencies=resolution,
        yaml=yaml.safe_dump(
            raw_elements(flatten_items(dashboard["items"]), widget_elements),
            sort_keys=False,
            allow_unicode=True,
        ),
        data_ms=round((data_done - started) * 1000, 2),
        compile_ms=round((compiled_done - data_done) * 1000, 2),
    )
