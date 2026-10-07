"""
Scenarios of a widget: the states it is drawn in and the sizes it is drawn at.

A widget folder may hold two files next to `widget.yml`:

* `states.yml` — named states. Each one is options, the picks per source, and what
  every pick's provider would resolve to, so a calendar can be drawn with ten events,
  two events or none.
* `preview.yml` — the palette, the sizes to draw every state at and, under `docs`,
  the pictures of the widget's documentation.

The preview tool, the tests and the documentation images all read them here.
"""

from __future__ import annotations

import io
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

import yaml  # type: ignore[import-untyped]
from odl_renderer import generate_image  # type: ignore[import-untyped]

from custom_components.opendisplay_studio.odl import Box, DisplayContext, WidgetContext
from custom_components.opendisplay_studio.palette import accent_color_for_palette
from custom_components.opendisplay_studio.widgets import WidgetRegistry
from custom_components.opendisplay_studio.widgets.options import option_defaults

STATES_FILE = "states.yml"
PREVIEW_FILE = "preview.yml"
DATETIME_KEYS = {"now", "start", "end", "datetime"}
DEFAULT_PALETTE = "bw"
DEFAULT_SIZES = (
    {"name": "full", "width": 800, "height": 480},
    {"name": "half horizontal", "width": 800, "height": 240},
    {"name": "half vertical", "width": 400, "height": 480},
    {"name": "quadrant", "width": 400, "height": 240},
)


@dataclass(frozen=True, slots=True)
class PreviewSize:
    """One size a widget is drawn at."""

    name: str
    width: int
    height: int


@dataclass(frozen=True, slots=True)
class Showcase:
    """One picture of the widget's documentation: a state, a size and some options."""

    title: str
    state: str
    size: str
    options: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class Preview:
    """The palette, sizes and documentation pictures of a widget."""

    palette: str
    sizes: tuple[PreviewSize, ...]
    showcases: tuple[Showcase, ...] = ()


def load_registry(widgets_root: Path) -> WidgetRegistry:
    """Load every widget package under `widgets_root`, from source, without caching."""
    return WidgetRegistry.from_directories(Path("/nonexistent"), widgets_root)


def load_preview(widget_folder: Path) -> Preview:
    """Read `preview.yml`; a widget without one is drawn at the usual sizes."""
    path = widget_folder / PREVIEW_FILE
    raw: dict[str, Any] = {}
    if path.is_file():
        raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    sizes = raw.get("sizes", DEFAULT_SIZES)
    return Preview(
        palette=raw.get("palette", DEFAULT_PALETTE),
        sizes=tuple(PreviewSize(**size) for size in sizes),
        showcases=tuple(Showcase(**item) for item in raw.get("docs", ())),
    )


def load_states(widget_folder: Path) -> dict[str, dict[str, Any]]:
    """Read `states.yml`: state id → state, timestamps still as text."""
    path = widget_folder / STATES_FILE
    if not path.is_file():
        return {}
    states: dict[str, dict[str, Any]] = yaml.safe_load(path.read_text(encoding="utf-8"))
    return states or {}


def with_options(state: dict[str, Any], options: dict[str, Any]) -> dict[str, Any]:
    """Return `state` with `options` set over its own, as the option form does."""
    return {**state, "options": {**state.get("options", {}), **options}}


def with_datetimes(value: Any) -> Any:
    """Turn the ISO timestamps of a state into the datetimes providers return."""
    if isinstance(value, dict):
        return {
            key: datetime.fromisoformat(item)
            if key in DATETIME_KEYS and isinstance(item, str)
            else with_datetimes(item)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [with_datetimes(item) for item in value]
    return value


def context_for(
    registry: WidgetRegistry,
    widget_id: str,
    state: dict[str, Any],
    size: tuple[int, int],
    palette: str = DEFAULT_PALETTE,
) -> WidgetContext:
    """Build what a renderer receives for `state` drawn at `size`."""
    width, height = size
    resolved = with_datetimes(state)
    language = resolved["language"]
    return WidgetContext(
        instance_id="devkit",
        box=Box(0, 0, width, height),
        display=DisplayContext(
            width, height, palette, "white", accent_color_for_palette(palette)
        ),
        language=language,
        options={
            **option_defaults(registry.definition(widget_id)),
            **resolved["options"],
        },
        sources=resolved["sources"],
        data=resolved["data"],
        now=resolved["now"],
        strings=registry.strings(widget_id, language),
    )


async def draw(
    context: WidgetContext, renderer: Any
) -> tuple[Any, list[dict[str, Any]]]:
    """Run `renderer` and the real `odl-renderer`; return the picture and the ODL."""
    elements: list[dict[str, Any]] = renderer(context)
    image = await generate_image(
        context.box.width,
        context.box.height,
        elements,
        background="white",
        accent_color=context.display.accent_color,
    )
    return image.convert("RGB"), elements


def png_bytes(image: Any) -> bytes:
    """Encode a picture as PNG."""
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()
