"""Compile semantic Studio dashboards into structured ODL elements."""

from __future__ import annotations

from dataclasses import dataclass
from time import monotonic
from typing import Any

import yaml  # type: ignore[import-untyped]
from homeassistant.core import HomeAssistant

from .odl import Box, DisplayContext, WidgetRenderContext
from .palette import accent_color_for_palette
from .widgets import WidgetRegistry, with_defaults


class DashboardCompileError(RuntimeError):
    """A semantic item could not be compiled into ODL."""


@dataclass(frozen=True, slots=True)
class CompiledDashboard:
    """Renderer-ready ODL plus editor metadata."""

    elements: list[dict[str, Any]]
    item_bounds: dict[str, dict[str, int]]
    warnings: list[str]
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


def _primitive_bounds(primitive: dict[str, Any]) -> Box:
    primitive_type = primitive["type"]
    if primitive_type in {"rectangle", "ellipse", "progress_bar"}:
        return Box(
            primitive["x_start"],
            primitive["y_start"],
            primitive["x_end"] - primitive["x_start"] + 1,
            primitive["y_end"] - primitive["y_start"] + 1,
        )
    if primitive_type == "line":
        left = min(primitive["x_start"], primitive["x_end"])
        top = min(primitive["y_start"], primitive["y_end"])
        return Box(
            left,
            top,
            max(1, abs(primitive["x_end"] - primitive["x_start"]) + 1),
            max(1, abs(primitive["y_end"] - primitive["y_start"]) + 1),
        )
    if primitive_type == "circle":
        radius = primitive["radius"]
        return Box(
            primitive["x"] - radius,
            primitive["y"] - radius,
            radius * 2 + 1,
            radius * 2 + 1,
        )
    if primitive_type == "icon":
        return Box(primitive["x"], primitive["y"], primitive["size"], primitive["size"])
    if primitive_type == "qrcode":
        # Version 1 with the configured quiet zone is 21 + 2 * border modules.
        size = (21 + primitive["border"] * 2) * primitive["boxsize"]
        return Box(primitive["x"], primitive["y"], size, size)
    size = primitive["size"]
    return Box(
        primitive["x"],
        primitive["y"],
        max(size, round(len(primitive["value"]) * size * 0.62)),
        max(1, round(size * 1.25)),
    )


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
    for item in dashboard["items"]:
        if item["kind"] != "widget" or item.get("hidden", False):
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
    display_value = dashboard["display"]
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
    elements: list[dict[str, Any]] = []
    item_bounds: dict[str, dict[str, int]] = {}
    for item in dashboard["items"]:
        try:
            if item["kind"] == "primitive":
                primitive = dict(item["primitive"])
                item_bounds[item["id"]] = _primitive_bounds(primitive).as_dict()
                if not item.get("hidden", False):
                    elements.append(primitive)
                continue
            box = _frame_box(item["frame"])
            item_bounds[item["id"]] = box.as_dict()
            if item.get("hidden", False):
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
            elements.extend(registry.renderer(item["widget"]["type"])(context))
        except (KeyError, TypeError, ValueError) as err:
            raise DashboardCompileError(f"Item {item['id']}: {err}") from err
    compiled_done = monotonic()
    return CompiledDashboard(
        elements=elements,
        item_bounds=item_bounds,
        warnings=warnings,
        yaml=yaml.safe_dump(elements, sort_keys=False, allow_unicode=True),
        data_ms=round((data_done - started) * 1000, 2),
        compile_ms=round((compiled_done - data_done) * 1000, 2),
    )
