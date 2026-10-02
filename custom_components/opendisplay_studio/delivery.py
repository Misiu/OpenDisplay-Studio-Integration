"""Render a dashboard into the picture a display shows, for preview and for sending."""

from __future__ import annotations

from dataclasses import dataclass
from time import monotonic
from typing import TYPE_CHECKING, Any, Final

from .compiler import CompiledDashboard, async_compile_dashboard
from .const import DOMAIN, LOGGER
from .flatten import translate_elements
from .palette import accent_color_for_palette
from .rendering import OdlRenderResult

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

PREVIEW_MARGIN_LIMIT: Final = 256


@dataclass(frozen=True, slots=True)
class RenderedDashboard:
    """A compiled dashboard, its picture and what the pipeline took."""

    compiled: CompiledDashboard
    picture: OdlRenderResult
    pipeline_ms: float
    # Pixels of the picture beyond each edge of the display; 0 for one of its size.
    margin: int = 0


def preview_margin(display: dict[str, Any]) -> int:
    """
    Return how much of what hangs out of the display the editor's picture shows.

    Elements may lie partly outside the display; seeing them makes moving them back
    easy. A margin of two fifths of the shorter side, at most 256 px, keeps the picture
    small enough to render quickly.
    """
    shorter_side: int = min(display["width"], display["height"])
    return min(PREVIEW_MARGIN_LIMIT, round(shorter_side * 0.4))


async def async_render_dashboard(
    hass: HomeAssistant,
    dashboard: dict[str, Any],
    *,
    for_device: bool,
    with_margin: bool = False,
) -> RenderedDashboard:
    """
    Compile and render a validated dashboard.

    The editor shows the canvas as it is designed. A picture meant for a display,
    from the Media Source or sent to a device, is turned by the dashboard's rotation
    so it has the display's own width and height. With `with_margin` the picture also
    shows a margin around the display, where elements that hang out of it are drawn.
    """
    started = monotonic()
    data = hass.data[DOMAIN]
    compiled = await async_compile_dashboard(hass, dashboard, data.widgets)
    display = dashboard["display"]
    margin = preview_margin(display) if with_margin else 0
    elements = (
        translate_elements(compiled.elements, margin, margin)
        if margin
        else compiled.elements
    )
    picture = await data.renderer.async_render(
        width=display["width"] + 2 * margin,
        height=display["height"] + 2 * margin,
        elements=elements,
        history=compiled.history,
        background=display["background"],
        accent_color=accent_color_for_palette(display["palette"]),
        rotation=display["rotation"] if for_device else 0,
    )
    pipeline_ms = round((monotonic() - started) * 1000, 2)
    LOGGER.info(
        "Rendered dashboard=%s canvas=%dx%d rotation=%d queue=%.2f ms data=%.2f ms "
        "compile=%.2f ms render=%.2f ms encode=%.2f ms pipeline=%.2f ms bytes=%d",
        dashboard.get("id", "unsaved"),
        display["width"],
        display["height"],
        display["rotation"] if for_device else 0,
        picture.timings["queue"],
        compiled.data_ms,
        compiled.compile_ms,
        picture.timings["render"],
        picture.timings["encode"],
        pipeline_ms,
        len(picture.png),
    )
    return RenderedDashboard(compiled, picture, pipeline_ms, margin)
