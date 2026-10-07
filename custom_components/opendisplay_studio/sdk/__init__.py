"""What a widget renderer needs: its context, ODL builders, layout and text helpers."""

from __future__ import annotations

from custom_components.opendisplay_studio.odl import (
    Box,
    DisplayContext,
    WidgetContext,
    clamp,
    icon,
    line,
    progress_bar,
    rectangle,
    text,
)

from .compose import compose
from .fitting import fit_text, line_height, text_width, truncate
from .formatting import (
    condition_icon,
    entity_icon,
    format_date,
    format_relative_day,
    format_time,
    weekday_name,
)
from .layout import columns, grid, inset, rows
from .look import Look

__all__ = [
    "Box",
    "DisplayContext",
    "Look",
    "WidgetContext",
    "clamp",
    "columns",
    "compose",
    "condition_icon",
    "entity_icon",
    "fit_text",
    "format_date",
    "format_relative_day",
    "format_time",
    "grid",
    "icon",
    "inset",
    "line",
    "line_height",
    "progress_bar",
    "rectangle",
    "rows",
    "text",
    "text_width",
    "truncate",
    "weekday_name",
]
