"""Agenda: the next events of all picked calendars on one list."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    compose,
    format_date,
    format_relative_day,
    format_time,
    line_height,
    text_width,
)

MAX_SIZE: Final = 22
MIN_SIZE: Final = 10
LINE_PADDING: Final = 2
MARKER_WIDTH: Final = 4
GAP: Final = 6
FRAME_PADDING: Final = 6
DEFAULT_ICON: Final = "mdi:calendar"


@dataclass(frozen=True, slots=True)
class Entry:
    """One event with the label and color of the calendar it came from."""

    event: dict[str, Any]
    label: str
    color: str
    icon: str

    @property
    def day(self) -> date:
        """Return the local day the event starts on."""
        start: date = self.event["start"].date()
        return start


@dataclass(frozen=True, slots=True)
class Row:
    """One line of the list: a day header, an event, or an event's location."""

    kind: str
    text: str = ""
    entry: Entry | None = None


def _visible_color(color: str | None, look: Look) -> str:
    """Return the calendar's color, or the ink when it would vanish into the paper."""
    if color is None or (look.framed and color == look.paper):
        return look.ink
    return color


def _entries(context: WidgetContext, look: Look) -> list[Entry]:
    """Merge all calendars, drop finished events, sort, keep the first N."""
    entries: list[Entry] = []
    for pick, data in zip(
        context.sources["calendars"], context.data["calendars"], strict=True
    ):
        entries.extend(
            Entry(
                event,
                pick.get("label", ""),
                _visible_color(pick.get("color"), look),
                pick.get("icon") or data.get("icon") or DEFAULT_ICON,
            )
            for event in data["events"]
            if event["end"] > context.now
        )
    entries.sort(
        key=lambda entry: (
            entry.day,
            not entry.event["all_day"],
            entry.event["start"],
        )
    )
    return entries[: context.options["maxEvents"]]


def _rows(context: WidgetContext, entries: list[Entry]) -> list[Row]:
    options = context.options
    today = context.now.date()
    rows: list[Row] = []
    previous_day: date | None = None
    for entry in entries:
        if options["groupByDay"] and entry.day != previous_day:
            rows.append(Row("header", format_relative_day(entry.day, today, context)))
        previous_day = entry.day
        rows.append(Row("event", entry=entry))
        if options["showLocation"] and entry.event["location"]:
            rows.append(Row("location", entry.event["location"], entry))
    return rows


def _fit(context: WidgetContext, entries: list[Entry]) -> tuple[list[Row], int]:
    """Show as many events as fit at a readable size, at the largest size that fits."""
    room = context.box.height - 2 * FRAME_PADDING
    for count in range(len(entries), 0, -1):
        rows = _rows(context, entries[:count])
        for size in range(MAX_SIZE, MIN_SIZE - 1, -1):
            if len(rows) * _row_height(size) <= room:
                return rows, size
    return _rows(context, entries[:1]), MIN_SIZE


def _row_height(size: int) -> int:
    """Return the height of one line of the list: the text plus a little air."""
    return line_height(size) + LINE_PADDING


def _time_text(context: WidgetContext, entry: Entry) -> str:
    event = entry.event
    if not context.options["showTime"]:
        return ""
    label = (
        context.t("all_day")
        if event["all_day"]
        else format_time(event["start"], use_24h=context.options["use24h"])
    )
    if context.options["groupByDay"] or entry.day == context.now.date():
        return label
    return f"{format_date(entry.day)} {label}"


def _card(look: Look, children: list[dict[str, Any]], **fields: Any) -> dict[str, Any]:
    return {
        "type": "column",
        "padding": FRAME_PADDING,
        **look.frame(),
        **fields,
        "children": children,
    }


def _message(context: WidgetContext, look: Look, message: str) -> dict[str, Any]:
    return look.message(context.box, message)


def _lead_width(context: WidgetContext, size: int) -> int:
    """Return the width of what starts a row: the calendar's icon or its color bar."""
    return line_height(size) if context.options["showIcons"] else MARKER_WIDTH


def _lead(
    context: WidgetContext, look: Look, entry: Entry, size: int
) -> dict[str, Any]:
    """Return what starts an event row, in the color of its calendar."""
    if context.options["showIcons"]:
        return look.icon(entry.icon, size=line_height(size), color=entry.color)
    return {
        "type": "rectangle",
        "w": MARKER_WIDTH,
        "h": size,
        "fill": entry.color,
        "outline": entry.color,
        "width": 0,
    }


def _event_row(
    context: WidgetContext, look: Look, row: Row, size: int, time_width: int
) -> dict[str, Any]:
    entry = row.entry
    assert entry is not None
    small = max(MIN_SIZE, size - 2)
    children: list[dict[str, Any]] = [_lead(context, look, entry, size)]
    if time_width:
        children.append(look.text(_time_text(context, entry), size=size, w=time_width))
    children.append(look.text(entry.event["summary"], size=size, truncate=True, grow=1))
    if context.options["showCalendarLabel"] and entry.label:
        children.append(
            look.text(entry.label, size=small, color=entry.color, truncate=True)
        )
    return {
        "type": "row",
        "gap": GAP,
        "h": _row_height(size),
        "children": children,
    }


def _header_row(look: Look, row: Row, size: int) -> dict[str, Any]:
    return {
        "type": "column",
        "justify": "space-between",
        "h": _row_height(size),
        "children": [look.text(row.text, size=size), look.divider()],
    }


def _detail_row(look: Look, row: Row, size: int, indent: int) -> dict[str, Any]:
    small = max(MIN_SIZE, size - 2)
    return {
        "type": "row",
        "padding": [0, 0, 0, indent],
        "h": _row_height(size),
        "children": [look.text(row.text, size=small, truncate=True, grow=1)],
    }


def _list(
    context: WidgetContext, look: Look, rows: list[Row], size: int
) -> dict[str, Any]:
    times = [
        text_width(label, size)
        for row in rows
        if row.kind == "event" and row.entry is not None
        if (label := _time_text(context, row.entry))
    ]
    # A little slack: text measured alone wraps when the box is exactly as wide.
    time_width = max(times, default=-4) + 4
    indent = _lead_width(context, size) + GAP + (time_width + GAP if time_width else 0)
    children: list[dict[str, Any]] = []
    for row in rows:
        if row.kind == "header":
            children.append(_header_row(look, row, size))
        elif row.kind == "event":
            children.append(_event_row(context, look, row, size, time_width))
        else:
            children.append(_detail_row(look, row, size, indent))
    return _card(look, children)


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the merged agenda, or say why there is nothing to show."""
    look = Look.of(context)
    if not context.sources["calendars"]:
        return compose(context, _message(context, look, context.t("choose_calendars")))
    entries = _entries(context, look)
    if not entries:
        empty = context.options["emptyText"] or context.t("no_events")
        return compose(context, _message(context, look, empty))
    rows, size = _fit(context, entries)
    return compose(context, _list(context, look, rows, size))


RENDERER = render
