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

from . import dial
from .compose import compose
from .dial import Dial, Stroke
from .fitting import fit_text, line_height, size_limit, text_width, truncate
from .formatting import (
    condition_icon,
    entity_icon,
    format_date,
    format_long_date,
    format_relative_day,
    format_time,
    week_start,
    weekday_name,
)
from .layout import columns, grid, inset, rows
from .locale import (
    day_heading,
    long_date,
    month_name,
    month_year,
    short_date,
    state_word,
)
from .look import Look
from .ranges import Span, spans_of
from .readings import (
    Reading,
    format_value,
    is_alert,
    limit_of,
    number_of,
    readings_of,
)

__all__ = [
    "Box",
    "Dial",
    "DisplayContext",
    "Look",
    "Reading",
    "Span",
    "Stroke",
    "WidgetContext",
    "clamp",
    "columns",
    "compose",
    "condition_icon",
    "day_heading",
    "dial",
    "entity_icon",
    "fit_text",
    "format_date",
    "format_long_date",
    "format_relative_day",
    "format_time",
    "format_value",
    "grid",
    "icon",
    "inset",
    "is_alert",
    "limit_of",
    "line",
    "line_height",
    "long_date",
    "month_name",
    "month_year",
    "number_of",
    "progress_bar",
    "readings_of",
    "rectangle",
    "rows",
    "short_date",
    "size_limit",
    "spans_of",
    "state_word",
    "text",
    "text_width",
    "truncate",
    "week_start",
    "weekday_name",
]
