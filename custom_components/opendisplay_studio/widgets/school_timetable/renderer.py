"""School timetable: a week of one calendar as a table of days and lesson slots."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Any, Final

from custom_components.opendisplay_studio.flatten import translate_elements
from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    fit_text,
    format_date,
    format_long_date,
    format_time,
    line_height,
    text_width,
    week_start,
    weekday_name,
)

MIN_TEXT: Final = 10
MAX_TEXT: Final = 18
CELL_PADDING: Final = 2
ALIAS_SEPARATOR: Final = "="
TITLE_SEPARATOR: Final = " / "
ELLIPSIS: Final = "..."
NEWLINE: Final = chr(10)
CELL_MARGIN: Final = 2
RANGE_DASH: Final = chr(0x2013)  # an en dash, between two dates

type Slot = tuple[time, time]


@dataclass(frozen=True, slots=True)
class Lesson:
    """One event of the week that belongs in the table."""

    day: date
    start: datetime
    end: datetime
    title: str

    @property
    def slot(self) -> Slot:
        """Return the start and end times of the day, the row it belongs to."""
        return (self.start.time(), self.end.time())


@dataclass(frozen=True, slots=True)
class Table:
    """What the table shows: the days, the slots and who has a lesson when."""

    monday: date
    days: list[date]
    slots: list[Slot]
    lessons: list[Lesson]
    skipped: int


def _lines(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.strip()]


def _aliases(text: str) -> dict[str, str]:
    pairs = (line.partition(ALIAS_SEPARATOR) for line in _lines(text))
    return {
        full.strip(): short.strip()
        for full, separator, short in pairs
        if separator and full.strip()
    }


def _title(summary: str, markers: list[str], aliases: dict[str, str]) -> str:
    """Return a lesson's title without the markers, under its short name if any."""
    for marker in markers:
        summary = summary.replace(marker, "")
    cleaned = " ".join(summary.split())
    return aliases.get(cleaned, cleaned)


def _spans_days(start: datetime, end: datetime) -> bool:
    """Tell whether an event runs past the day it starts on."""
    midnight_after = datetime.combine(
        start.date() + timedelta(days=1), time.min, tzinfo=start.tzinfo
    )
    return end > midnight_after


def _table(context: WidgetContext) -> Table:
    options = context.options
    monday = week_start(
        context.now.date(), next_on_weekend=options["weekend"] == "next"
    )
    days = [monday + timedelta(days=offset) for offset in range(int(options["days"]))]
    markers = _lines(options["stripText"])
    aliases = _aliases(options["aliases"])
    lessons: list[Lesson] = []
    skipped = 0
    for event in context.data["calendars"][0]["events"]:
        start, end = event["start"], event["end"]
        if start.date() not in days:
            continue
        if event["all_day"] or end <= start or _spans_days(start, end):
            skipped += 1
            continue
        title = _title(event["summary"], markers, aliases) or context.t("lesson")
        lessons.append(Lesson(start.date(), start, end, title))
    slots = sorted({lesson.slot for lesson in lessons})
    return Table(monday, days, slots, lessons, skipped)


def _clock(context: WidgetContext, moment: time) -> str:
    stamp = datetime.combine(date.min, moment)
    return format_time(stamp, use_24h=context.options["use24h"])


def _cell_lessons(table: Table, day: date, slot: Slot) -> list[Lesson]:
    found = [x for x in table.lessons if x.day == day and x.slot == slot]
    return sorted(found, key=lambda lesson: (lesson.start, lesson.title))


def _cell_title(found: list[Lesson]) -> str:
    titles = list(dict.fromkeys(lesson.title for lesson in found))
    return TITLE_SEPARATOR.join(titles)


def _text_size(table: Table, row_height: int, cell_width: int) -> int:
    """Return one size for every lesson: by the row, and small enough for any word."""
    size = clamp(row_height // 3, MIN_TEXT, MAX_TEXT)
    words = [word for lesson in table.lessons for word in lesson.title.split()]
    if not words:
        return size
    longest = max(words, key=lambda word: text_width(word, size))
    return fit_text(longest, cell_width - 2 * CELL_PADDING - 2, size, MIN_TEXT)


def _size_for_lines(lines: int, height: int, ceiling: int) -> int:
    """Return the largest size up to `ceiling` at which `lines` lines fit `height`."""
    size = ceiling
    while size > MIN_TEXT and lines * line_height(size) > height:
        size -= 1
    return size


def _header_labels(context: WidgetContext, day: date, *, full: bool) -> tuple[str, str]:
    """Return the weekday and the date a column is headed with."""
    name = weekday_name(day, context.language, full=full)
    date_text = format_long_date(day, context.language) if full else format_date(day)
    return name, date_text


def _full_names_fit(
    context: WidgetContext, days: list[date], size: tuple[int, int]
) -> bool:
    """Decide whether the full names and dates fit the header of a column."""
    chosen = context.options["dayNames"]
    if chosen != "auto":
        return bool(chosen == "full")
    width, height = size
    text_size = _size_for_lines(2, height - 2 * CELL_PADDING, MAX_TEXT)
    room = width - 2 * CELL_PADDING - 2
    longest = max(
        text_width(label, text_size)
        for day in days
        for label in _header_labels(context, day, full=True)
    )
    return bool(longest <= room)


def _header_cell(
    look: Look,
    labels: tuple[str, str],
    size: tuple[int, int],
    *,
    today: bool,
) -> dict[str, Any]:
    width, height = size
    ink = look.paper if today else look.ink
    text_size = _size_for_lines(2, height - 2 * CELL_PADDING, MAX_TEXT)
    name, date_text = labels
    fields = {"size": text_size, "color": ink, "align": "center", "truncate": True}
    cell: dict[str, Any] = {
        "type": "column",
        "w": width,
        "h": height,
        "padding": CELL_PADDING,
        "justify": "center",
        "children": [look.text(name, **fields), look.text(date_text, **fields)],
    }
    if today:
        cell["background"] = look.ink
    return cell


def _shorten(word: str, width: int, size: int) -> str:
    """Cut `word` so that it fits `width` with the ellipsis after it."""
    while word and text_width(word + ELLIPSIS, size) > width:
        word = word[:-1]
    return word + ELLIPSIS


def _wrap(title: str, width: int, size: int) -> list[str]:
    """Break a title into lines no wider than `width`; a longer word is cut short."""
    lines: list[str] = []
    line = ""
    for word in title.split():
        if text_width(word, size) > width:
            word = _shorten(word, width, size)  # noqa: PLW2901 - the cut word replaces it
        candidate = f"{line} {word}".strip()
        if text_width(candidate, size) <= width:
            line = candidate
            continue
        lines.append(line)
        line = word
    if line:
        lines.append(line)
    return lines


def _clip(title: str, width: int, size: int, max_lines: int) -> str:
    """Return the title as lines that fit a cell; the last line ends in an ellipsis."""
    lines = _wrap(title, width, size)
    if len(lines) > max_lines:
        last = lines[max_lines - 1].removesuffix(ELLIPSIS)
        lines = [*lines[: max_lines - 1], _shorten(last, width, size)]
    return NEWLINE.join(lines)


def _lesson_cell(
    context: WidgetContext,
    look: Look,
    found: list[Lesson],
    size: tuple[int, int],
    text_size: int,
) -> dict[str, Any]:
    width, height = size
    cell: dict[str, Any] = {
        "type": "column",
        "w": width,
        "h": height,
        "padding": CELL_PADDING,
        "justify": "center",
        "children": [],
    }
    if not found:
        return cell
    lines = max(1, (height - 2 * CELL_PADDING) // line_height(text_size))
    ink = look.ink
    if any(lesson.start <= context.now < lesson.end for lesson in found):
        highlight = context.options["highlightColor"]
        cell["background"] = highlight
        ink = look.paper if highlight == look.ink else look.ink
    room = width - 2 * CELL_PADDING - CELL_MARGIN
    title = _clip(_cell_title(found), room, text_size, lines)
    cell["children"] = [
        look.text(title, size=text_size, color=ink, align="center", w=room)
    ]
    return cell


def _time_cell(
    context: WidgetContext, look: Look, slot: Slot, size: tuple[int, int]
) -> dict[str, Any]:
    """Show when the slot starts and ends, or only starts if two lines do not fit."""
    width, height = size
    both = 2 * line_height(MIN_TEXT) <= height
    text_size = _size_for_lines(2 if both else 1, height, MAX_TEXT - 4)
    children = [look.text(_clock(context, slot[0]), size=text_size, align="center")]
    if both:
        end_size = max(MIN_TEXT, text_size - 3)
        end = look.text(_clock(context, slot[1]), size=end_size, align="center")
        children.append(end)
    return {
        "type": "column",
        "w": width,
        "h": height,
        "justify": "center",
        "children": children,
    }


def _footer(
    context: WidgetContext, look: Look, table: Table, size: tuple[int, int]
) -> dict[str, Any]:
    width, height = size
    last = table.days[-1]
    span = f"{format_date(table.monday)}{RANGE_DASH}{format_date(last)}.{last.year}"
    parts = [context.t("timetable"), span]
    if table.skipped:
        parts.append(context.t("skipped", count=table.skipped))
    clock = format_time(context.now, use_24h=context.options["use24h"])
    # The font has a very narrow space after a digit, so the gap is two of them.
    rendered = f"{format_date(context.now.date())}  {clock}"
    text_size = _size_for_lines(1, height, MAX_TEXT - 4)
    return {
        "type": "row",
        "w": width,
        "h": height,
        "align": "center",
        "children": [
            look.text(" · ".join(parts), size=text_size, truncate=True, grow=1),
            look.text(rendered, size=text_size, w=text_width(rendered, text_size) + 6),
        ],
    }


def _widest_time(context: WidgetContext, table: Table, text_size: int) -> int:
    clocks = [_clock(context, moment) for slot in table.slots for moment in slot]
    return max(text_width(clock, text_size) for clock in clocks) + 8


def _grid_lines(
    look: Look, x_edges: list[int], y_edges: list[int]
) -> list[dict[str, Any]]:
    """Draw the lines between the columns and rows of the table."""
    top, bottom = y_edges[0], y_edges[-1]
    left, right = x_edges[0], x_edges[-1]
    lines = [
        {"type": "line", "x_start": x, "y_start": top, "x_end": x, "y_end": bottom}
        for x in x_edges[1:-1]
    ]
    lines += [
        {"type": "line", "x_start": left, "y_start": y, "x_end": right, "y_end": y}
        for y in y_edges[1:-1]
    ]
    return [{**line, "fill": look.ink, "width": 1} for line in lines]


def _layout(
    context: WidgetContext, look: Look, table: Table
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Return the root node and the grid lines, in the widget's own coordinates."""
    box = context.box
    padding = clamp(min(box.width, box.height) // 60, 3, 8)
    width, height = box.width - 2 * padding, box.height - 2 * padding
    footer_height = 0
    if context.options["showFooter"]:
        footer_height = line_height(MIN_TEXT) + 6
    header_height = clamp(height // 10, 2 * line_height(MIN_TEXT) + 4, 56)
    row_height = max(1, (height - header_height - footer_height) // len(table.slots))
    time_width = _widest_time(context, table, clamp(row_height // 4, MIN_TEXT, 14))
    day_width = (width - time_width) // len(table.days)
    time_width = width - day_width * len(table.days)
    today = context.now.date()
    full_names = _full_names_fit(context, table.days, (day_width, header_height))
    text_size = _text_size(table, row_height, day_width)
    header = {
        "type": "row",
        "h": header_height,
        "children": [
            {"type": "spacer", "w": time_width},
            *[
                _header_cell(
                    look,
                    _header_labels(context, day, full=full_names),
                    (day_width, header_height),
                    today=day == today,
                )
                for day in table.days
            ],
        ],
    }
    body = []
    for slot in table.slots:
        cells = [
            _lesson_cell(
                context,
                look,
                _cell_lessons(table, day, slot),
                (day_width, row_height),
                text_size,
            )
            for day in table.days
        ]
        time_cell = _time_cell(context, look, slot, (time_width, row_height))
        body.append({"type": "row", "h": row_height, "children": [time_cell, *cells]})
    children = [header, *body]
    if footer_height:
        gap = height - header_height - row_height * len(table.slots) - footer_height
        children.append({"type": "spacer", "h": max(0, gap)})
        children.append(_footer(context, look, table, (width, footer_height)))
    root = {
        "type": "column",
        "padding": padding,
        **look.frame(),
        "children": children,
    }
    x_edges = [
        padding + time_width + day_width * index for index in range(len(table.days) + 1)
    ]
    x_edges.insert(0, padding)
    y_edges = [
        padding + header_height + row_height * index
        for index in range(len(table.slots) + 1)
    ]
    y_edges.insert(0, padding)
    return root, _grid_lines(look, x_edges, y_edges)


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the week, or say why there is nothing to draw."""
    look = Look.of(context)
    if not context.sources["calendars"]:
        return compose(context, look.message(context.box, context.t("choose_calendar")))
    table = _table(context)
    if not table.slots:
        return compose(context, look.message(context.box, context.t("no_lessons")))
    root, lines = _layout(context, look, table)
    elements = compose(context, root)
    if not context.options["showGrid"]:
        return elements
    box = context.box
    return elements + translate_elements(lines, box.x, box.y)


RENDERER = render
