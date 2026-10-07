"""Compile semantic Studio dashboards into structured ODL elements."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import datetime
from time import monotonic
from typing import TYPE_CHECKING, Any, Final

import yaml  # type: ignore[import-untyped]
from homeassistant.util import dt as dt_util

from .data_providers.resolver import DataResolver, RequestKey, provider_params
from .expressions import (
    Resolution,
    async_resolve_expressions,
    has_expressions,
)
from .flatten import (
    Placed,
    background_element,
    flatten_items,
    shift_primitive,
)
from .fonts import font_directories
from .history import RecordedHistory, async_prefetch_history
from .images import async_load_images
from .measure import primitive_box
from .odl import Box, DisplayContext, WidgetContext, rectangle, text
from .palette import accent_color_for_palette
from .raw_yaml import raw_elements
from .widgets import WidgetPackage, WidgetPackageError, WidgetRegistry
from .widgets.options import option_defaults

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

RENDER_BUDGET_SECONDS: Final = 0.1
PLACEHOLDER_SIZE: Final = 14


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
    history: RecordedHistory | None = None


@dataclass(slots=True)
class _WidgetJob:
    """One widget instance to render, and where its data will come from."""

    placed: Placed
    package: WidgetPackage
    options: dict[str, Any]
    picks: dict[str, list[dict[str, Any]]]
    requests: dict[str, list[RequestKey]] = field(default_factory=dict)


def _frame_box(frame: dict[str, int]) -> Box:
    return Box(frame["x"], frame["y"], frame["width"], frame["height"])


def _measure_primitives(
    primitives: dict[str, dict[str, Any]], display: tuple[int, int]
) -> dict[str, dict[str, int]]:
    """Measure every primitive as the renderer draws it (loads fonts, so not async)."""
    return {
        item_id: primitive_box(primitive, display).as_dict()
        for item_id, primitive in primitives.items()
    }


def _plan_widgets(
    placed_items: list[Placed],
    registry: WidgetRegistry,
    resolver: DataResolver,
    warnings: list[str],
) -> dict[str, _WidgetJob]:
    """Register the data every visible, installed widget needs."""
    jobs: dict[str, _WidgetJob] = {}
    for placed in placed_items:
        item = placed.item
        if item["kind"] != "widget" or placed.hidden:
            continue
        widget = item["widget"]
        try:
            package = registry.package(widget["type"])
        except WidgetPackageError:
            warnings.append(f"{item['name']}: widget {widget['type']} is not installed")
            continue
        manifest = package.manifest
        options = {**option_defaults(manifest), **widget.get("options", {})}
        job = _WidgetJob(placed, package, options, widget.get("sources", {}))
        for source in manifest["sources"]:
            provider_name = source.get("data")
            if provider_name is None:
                continue
            params = provider_params(manifest, provider_name, options)
            job.requests[source["key"]] = [
                resolver.request(provider_name, pick["id"], params)
                for pick in job.picks.get(source["key"], [])
            ]
        jobs[item["id"]] = job
    return jobs


def _missing_widget_elements(box: Box, widget_type: str) -> list[dict[str, Any]]:
    """Draw a hatched frame naming a widget that is not installed."""
    elements = [rectangle(box, fill="white", outline="black", width=1)]
    step = 12
    for offset in range(step, box.width + box.height, step):
        start = (box.x + min(offset, box.width - 1), box.y + max(0, offset - box.width))
        end = (box.x + max(0, offset - box.height), box.y + min(offset, box.height - 1))
        elements.append(
            {
                "type": "line",
                "x_start": start[0],
                "y_start": start[1],
                "x_end": end[0],
                "y_end": end[1],
                "fill": "black",
                "width": 1,
            }
        )
    elements.append(
        text(
            widget_type,
            x=box.x + box.width // 2,
            y=box.y + box.height // 2,
            size=PLACEHOLDER_SIZE,
            anchor="mm",
        )
    )
    return elements


def _inside(box: Box, element: dict[str, Any]) -> bool:
    """Whether an element's anchor lies in the frame (right and bottom edges included)."""
    x = element.get("x", element.get("x_start"))
    y = element.get("y", element.get("y_start"))
    if not isinstance(x, int) or not isinstance(y, int):
        return True
    return box.x <= x <= box.right and box.y <= y <= box.bottom


def _render_widget(
    job: _WidgetJob,
    resolver: DataResolver,
    context_parts: tuple[Box, DisplayContext, str, datetime],
    registry: WidgetRegistry,
    warnings: list[str],
) -> list[dict[str, Any]]:
    box, display, language, now = context_parts
    item = job.placed.item
    context = WidgetContext(
        instance_id=item["id"],
        box=box,
        display=display,
        language=language,
        options=job.options,
        sources=job.picks,
        data={
            key: [resolver.value(request) for request in requests]
            for key, requests in job.requests.items()
        },
        now=now,
        strings=registry.strings(item["widget"]["type"], language),
    )
    started = monotonic()
    rendered = job.package.renderer(context)
    if monotonic() - started > RENDER_BUDGET_SECONDS:
        warnings.append(f"{item['name']}: rendering took longer than 100 ms")
    kept = [element for element in rendered if _inside(box, element)]
    if len(kept) != len(rendered):
        warnings.append(f"{item['name']}: elements outside the frame were dropped")
    return kept


async def async_compile_dashboard(
    hass: HomeAssistant,
    dashboard: dict[str, Any],
    registry: WidgetRegistry,
) -> CompiledDashboard:
    """Resolve declared data once, then compile every item in z-order."""
    started = monotonic()
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
    resolver = DataResolver(registry.providers)
    jobs = _plan_widgets(placed_items, registry, resolver, warnings)
    await resolver.async_resolve(hass, dashboard["language"])
    warnings.extend(resolver.warnings)
    resolution.entities |= resolver.source_ids
    data_done = monotonic()
    display = DisplayContext(
        width=display_value["width"],
        height=display_value["height"],
        palette=display_value["palette"],
        background=display_value["background"],
        accent_color=accent_color_for_palette(display_value["palette"]),
        # Only widgets lay text out by font name; most dashboards never need the folder.
        font_dirs=tuple(font_directories(hass)) if jobs else (),
    )
    primitive_bounds = await asyncio.to_thread(
        _measure_primitives,
        {
            placed.item["id"]: shift_primitive(
                placed.item["primitive"], placed.x, placed.y
            )
            for placed in placed_items
            if placed.item["kind"] == "primitive"
        },
        (display.width, display.height),
    )
    elements: list[dict[str, Any]] = []
    widget_elements: dict[str, list[dict[str, Any]]] = {}
    item_bounds: dict[str, dict[str, int]] = {}
    now = dt_util.now()
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
            frame = _frame_box(item["frame"]).moved(placed.x, placed.y)
            item_bounds[item["id"]] = frame.as_dict()
            if placed.hidden:
                continue
            if item["id"] not in jobs:
                elements.extend(_missing_widget_elements(frame, item["widget"]["type"]))
                continue
            content_box = frame.inset(item.get("layout", {}).get("padding", 0))
            # Laying a widget out reads font files, so it runs off the event loop.
            rendered = await asyncio.to_thread(
                _render_widget,
                jobs[item["id"]],
                resolver,
                (content_box, display, dashboard["language"], now),
                registry,
                warnings,
            )
            widget_elements[item["id"]] = rendered
            elements.extend(rendered)
        except (KeyError, TypeError, ValueError) as err:
            raise DashboardCompileError(f"Item {item['id']}: {err}") from err
    elements = await async_load_images(hass, elements, warnings)
    elements, history = await async_prefetch_history(hass, elements, warnings)
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
        history=history,
    )
