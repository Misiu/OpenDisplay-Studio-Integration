"""Agenda: the next events of all picked calendars on one list."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Box,
    WidgetContext,
    clamp,
    format_date,
    format_relative_day,
    format_time,
    line,
    rectangle,
    text,
    text_width,
    truncate,
)

MAX_SIZE: Final = 22
MIN_SIZE: Final = 10
LINE_PADDING: Final = 6
MARKER_WIDTH: Final = 4
GAP: Final = 6


@dataclass(frozen=True, slots=True)
class Entry:
    """One event with the label and color of the calendar it came from."""

    event: dict[str, Any]
    label: str
    color: str

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


def _entries(context: WidgetContext) -> list[Entry]:
    """Merge all calendars, drop finished events, sort, keep the first N."""
    entries: list[Entry] = []
    for pick, data in zip(
        context.sources["calendars"], context.data["calendars"], strict=True
    ):
        entries.extend(
            Entry(event, pick.get("label", ""), pick.get("color", "black"))
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
    for count in range(len(entries), 0, -1):
        rows = _rows(context, entries[:count])
        size = min(MAX_SIZE, context.box.height // len(rows) - LINE_PADDING)
        if size >= MIN_SIZE:
            return rows, size
    return _rows(context, entries[:1]), MIN_SIZE


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


def _message(context: WidgetContext, message: str) -> list[dict[str, Any]]:
    box = context.box
    size = clamp(min(box.height // 5, box.width // 14), MIN_SIZE, 20)
    return [
        text(
            truncate(message, box.width - 8, size),
            x=box.x + box.width // 2,
            y=box.y + box.height // 2,
            size=size,
            anchor="mm",
        )
    ]


def _event_row(
    context: WidgetContext, row: Row, top: int, size: int, time_width: int
) -> list[dict[str, Any]]:
    entry = row.entry
    if entry is None:
        return []
    box = context.box
    middle = top + (size + LINE_PADDING) // 2
    elements = [
        rectangle(
            Box(box.x, top + 2, MARKER_WIDTH, size + LINE_PADDING - 4),
            fill=entry.color,
            outline=entry.color,
            width=0,
        )
    ]
    left = box.x + MARKER_WIDTH + GAP
    if time_width:
        elements.append(
            text(_time_text(context, entry), x=left, y=middle, size=size, anchor="lm")
        )
        left += time_width + GAP
    right = box.right
    if context.options["showCalendarLabel"] and entry.label:
        label = truncate(entry.label, box.width // 4, max(MIN_SIZE, size - 2))
        elements.append(
            text(
                label,
                x=right,
                y=middle,
                size=max(MIN_SIZE, size - 2),
                color=entry.color,
                anchor="rm",
            )
        )
        right -= text_width(label, max(MIN_SIZE, size - 2)) + GAP
    title = truncate(entry.event["summary"], right - left, size)
    elements.append(text(title, x=left, y=middle, size=size, anchor="lm"))
    return elements


def _detail_row(
    context: WidgetContext, row: Row, top: int, size: int, left: int
) -> list[dict[str, Any]]:
    small = max(MIN_SIZE, size - 2)
    middle = top + (size + LINE_PADDING) // 2
    return [
        text(
            truncate(row.text, context.box.right - left, small),
            x=left,
            y=middle,
            size=small,
            anchor="lm",
        )
    ]


def _draw(context: WidgetContext, rows: list[Row], size: int) -> list[dict[str, Any]]:
    box = context.box
    height = size + LINE_PADDING
    times = [
        text_width(label, size)
        for row in rows
        if row.kind == "event" and row.entry is not None
        if (label := _time_text(context, row.entry))
    ]
    time_width = max(times, default=0)
    body_left = box.x + MARKER_WIDTH + GAP + (time_width + GAP if time_width else 0)
    elements: list[dict[str, Any]] = []
    for index, row in enumerate(rows):
        top = box.y + index * height
        if row.kind == "header":
            elements.append(
                text(row.text, x=box.x, y=top + height // 2, size=size, anchor="lm")
            )
            elements.append(
                line((box.x, top + height - 1), (box.right - 1, top + height - 1))
            )
        elif row.kind == "event":
            elements.extend(_event_row(context, row, top, size, time_width))
        else:
            elements.extend(_detail_row(context, row, top, size, body_left))
    return elements


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the merged agenda, or say why there is nothing to show."""
    if not context.sources["calendars"]:
        return _message(context, context.t("choose_calendars"))
    entries = _entries(context)
    if not entries:
        empty = context.options["emptyText"] or context.t("no_events")
        return _message(context, empty)
    rows, size = _fit(context, entries)
    return _draw(context, rows, size)


RENDERER = render
