"""Render a dashboard into the picture a display shows, for preview and for sending."""

from __future__ import annotations

from dataclasses import dataclass
from time import monotonic
from typing import TYPE_CHECKING, Any

from .compiler import CompiledDashboard, async_compile_dashboard
from .const import DOMAIN, LOGGER
from .palette import accent_color_for_palette
from .rendering import OdlRenderResult

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


@dataclass(frozen=True, slots=True)
class RenderedDashboard:
    """A compiled dashboard, its picture and what the pipeline took."""

    compiled: CompiledDashboard
    picture: OdlRenderResult
    pipeline_ms: float


async def async_render_dashboard(
    hass: HomeAssistant, dashboard: dict[str, Any], *, for_device: bool
) -> RenderedDashboard:
    """
    Compile and render a validated dashboard.

    The editor shows the canvas as it is designed. A picture meant for a display,
    from the Media Source or sent to a device, is turned by the dashboard's rotation
    so it has the display's own width and height.
    """
    started = monotonic()
    data = hass.data[DOMAIN]
    compiled = await async_compile_dashboard(hass, dashboard, data.widgets)
    display = dashboard["display"]
    picture = await data.renderer.async_render(
        width=display["width"],
        height=display["height"],
        elements=compiled.elements,
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
    return RenderedDashboard(compiled, picture, pipeline_ms)
