"""The weeks view: a grid of days, events as bars over days and items inside them."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any, Final

from custom_components.opendisplay_studio.flatten import translate_elements
from custom_components.opendisplay_studio.odl import Box
from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    line_height,
    month_year,
    short_date,
    text_width,
    weekday_name,
)
from custom_components.opendisplay_studio.widgets.calendar.events import (
    SATURDAY,
    WEEK_LENGTH,
    Event,
    clock,
    week_floor,
)
from custom_components.opendisplay_studio.widgets.calendar.text import clip, one_line

MIN_ROW_HEIGHT: Final = 100
MAX_ROWS: Final = 6
MARK_WIDTH: Final = 3
LANE_SHARE: Final = 0.45
CELL_PADDING: Final = 3
THURSDAY: Final = 3
SHADE_GAP: Final = 5
DASH: Final = 2

type Element = dict[str, Any]


@dataclass(frozen=True, slots=True)
class Grid:
    """Where the cells are: the edges of the columns and of the rows, and the sizes."""

    columns: list[int]
    rows: list[int]
    first: date
    heading: int
    small: int
    number_height: int

    @property
    def row_count(self) -> int:
        """Return how many weeks the grid has."""
        return len(self.rows) - 1

    def cell(self, row: int, column: int) -> Box:
        """Return the box of one day."""
        left, right = self.columns[column], self.columns[column + 1]
        top, bottom = self.rows[row], self.rows[row + 1]
        return Box(left, top, right - left, bottom - top)

    def day(self, row: int, column: int) -> date:
        """Return the date of one cell."""
        return self.first + timedelta(days=row * WEEK_LENGTH + column)


def _text(
    look: Look,
    value: str,
    point: tuple[int, int],
    size: int,
    **fields: Any,
) -> Element:
    """Return a text element placed by its top and by its left, middle or right."""
    x, y = point
    return {
        **look.text(value, size=size, x=x, y=y, anchor="la"),
        **fields,
    }


def _edges(start: int, length: int, count: int) -> list[int]:
    return [start + round(index * length / count) for index in range(count + 1)]


def _row_count(context: WidgetContext, height: int, first: date) -> int:
    options = context.options
    if options["weeks"] != "auto":
        return int(options["weeks"])
    if options["monthMode"] == "month":
        today = context.now.date()
        month_end = (today.replace(day=28) + timedelta(days=4)).replace(day=1)
        last = month_end - timedelta(days=1)
        return min(MAX_ROWS, (last - first).days // WEEK_LENGTH + 1)
    return clamp(height // MIN_ROW_HEIGHT, 1, MAX_ROWS)


def _first_day(context: WidgetContext) -> date:
    """Return the first day of the grid, as the calendar's data says it starts."""
    for data in context.data["calendars"]:
        if data.get("range_start"):
            return date.fromisoformat(data["range_start"])
    options = context.options
    today = context.now.date()
    anchor = today if options["monthMode"] == "rolling" else today.replace(day=1)
    return week_floor(anchor, options["firstDay"])


def _grid(context: WidgetContext, small: int, heading: int) -> tuple[Grid, int]:
    """Lay the columns and rows of the grid out; also return the top of the grid."""
    box = context.box
    options = context.options
    padding = clamp(min(box.width, box.height) // 60, 3, 8)
    top = padding
    if options["monthHeader"]:
        top += line_height(heading) + 4
    header = line_height(heading) + 6
    first = _first_day(context)
    number_width = 0
    if options["weekNumbers"]:
        number_width = text_width("52", small) + 8
    left = padding + number_width
    width = box.width - padding - left
    body_top = top + header
    body_height = box.height - padding - body_top
    rows = _row_count(context, body_height, first)
    grid = Grid(
        columns=_edges(left, width, WEEK_LENGTH),
        rows=_edges(body_top, body_height, rows),
        first=first,
        heading=heading,
        small=small,
        number_height=line_height(small) + 4,
    )
    return grid, top


def _shading(look: Look, grid: Grid, context: WidgetContext) -> list[Element]:
    """Dot the cells of Saturdays and Sundays."""
    if not context.options["shadeWeekends"]:
        return []
    elements: list[Element] = []
    for row in range(grid.row_count):
        for column in range(WEEK_LENGTH):
            if grid.day(row, column).weekday() < SATURDAY:
                continue
            cell = grid.cell(row, column)
            elements.append(
                {
                    "type": "rectangle_pattern",
                    "x_start": cell.x + 1,
                    "y_start": cell.y + 1,
                    "x_size": 1,
                    "y_size": 1,
                    "x_offset": SHADE_GAP,
                    "y_offset": SHADE_GAP,
                    "x_repeat": (cell.width - 3) // (SHADE_GAP + 1),
                    "y_repeat": (cell.height - 3) // (SHADE_GAP + 1),
                    "fill": look.ink,
                    "outline": look.ink,
                    "width": 0,
                }
            )
    return elements


def _lines(look: Look, grid: Grid) -> list[Element]:
    """Draw the dashed lines between the columns and the rows."""
    left, right = grid.columns[0], grid.columns[-1]
    top, bottom = grid.rows[0], grid.rows[-1]
    dash = {"fill": look.ink, "width": 1, "dashed": True}
    dash |= {"dash_length": DASH, "space_length": DASH}
    verticals = [
        {"type": "line", "x_start": x, "y_start": top, "x_end": x, "y_end": bottom}
        for x in grid.columns[1:-1]
    ]
    horizontals = [
        {"type": "line", "x_start": left, "y_start": y, "x_end": right, "y_end": y}
        for y in grid.rows
    ]
    return [{**line, **dash} for line in [*verticals, *horizontals]]


def _headers(context: WidgetContext, look: Look, grid: Grid, top: int) -> list[Element]:
    """Name the columns; today's is inverted."""
    elements: list[Element] = []
    today = context.now.date()
    height = grid.rows[0] - top
    for column in range(WEEK_LENGTH):
        day = grid.day(0, column)
        left, right = grid.columns[column], grid.columns[column + 1]
        name = weekday_name(day, context.language)
        here = context.options["highlightToday"] and any(
            grid.day(row, column) == today for row in range(grid.row_count)
        )
        if here:
            elements.append(
                {
                    "type": "rectangle",
                    "x_start": left,
                    "y_start": top,
                    "x_end": right - 1,
                    "y_end": grid.rows[0],
                    "fill": look.ink,
                    "outline": look.ink,
                    "width": 0,
                }
            )
        point = ((left + right) // 2, top + (height - line_height(grid.heading)) // 2)
        elements.append(
            _text(
                look,
                name,
                point,
                grid.heading,
                color=look.paper if here else look.ink,
                anchor="ma",
            )
        )
    return elements


def _numbers(context: WidgetContext, look: Look, grid: Grid) -> list[Element]:
    """Write the day numbers in the corners of the cells; a pill marks today."""
    elements: list[Element] = []
    today = context.now.date()
    for row in range(grid.row_count):
        for column in range(WEEK_LENGTH):
            day = grid.day(row, column)
            cell = grid.cell(row, column)
            label = short_date(day, context.language) if day.day == 1 else str(day.day)
            width = text_width(label, grid.small)
            right = cell.x + cell.width - CELL_PADDING - 2
            marked = day == today and context.options["highlightToday"]
            if marked:
                elements.append(
                    {
                        "type": "rectangle",
                        "x_start": right - width - 4,
                        "y_start": cell.y + 2,
                        "x_end": right + 3,
                        "y_end": cell.y + grid.number_height - 2,
                        "fill": look.ink,
                        "outline": look.ink,
                        "width": 0,
                        "radius": 4,
                    }
                )
            elements.append(
                _text(
                    look,
                    label,
                    (right, cell.y + 3),
                    grid.small,
                    color=look.paper if marked else look.ink,
                    anchor="ra",
                )
            )
    return elements


def _week_numbers(context: WidgetContext, look: Look, grid: Grid) -> list[Element]:
    if not context.options["weekNumbers"]:
        return []
    elements: list[Element] = []
    for row in range(grid.row_count):
        thursday = next(
            grid.day(row, column)
            for column in range(WEEK_LENGTH)
            if grid.day(row, column).weekday() == THURSDAY
        )
        number = str(thursday.isocalendar().week)
        point = (grid.columns[0] - 4, grid.rows[row] + 3)
        elements.append(_text(look, number, point, grid.small, anchor="ra"))
    return elements


@dataclass(frozen=True, slots=True)
class Segment:
    """The part of a bar that lies in one week row."""

    event: Event
    first: int
    last: int
    lane: int = 0


def _segments(grid: Grid, row: int, events: list[Event]) -> list[Segment]:
    start = grid.day(row, 0)
    end = grid.day(row, WEEK_LENGTH - 1)
    found = [
        Segment(
            event,
            (max(event.first_day, start) - start).days,
            (min(event.last_day, end) - start).days,
        )
        for event in events
        if event.is_bar and event.first_day <= end and event.last_day >= start
    ]
    found.sort(key=lambda s: (s.first, -(s.last - s.first), s.event.title))
    ends: list[int] = []
    placed: list[Segment] = []
    for segment in found:
        lane = next((i for i, last in enumerate(ends) if last < segment.first), None)
        if lane is None:
            ends.append(segment.last)
            lane = len(ends) - 1
        else:
            ends[lane] = segment.last
        placed.append(Segment(segment.event, segment.first, segment.last, lane))
    return placed


def _bars(
    look: Look, grid: Grid, row: int, segments: list[Segment], lanes: int
) -> list[Element]:
    """Draw the bars that fit the lanes of a row."""
    elements: list[Element] = []
    lane_height = line_height(grid.small) + 3
    for segment in segments:
        if segment.lane >= lanes:
            continue
        left = grid.columns[segment.first] + 2
        right = grid.columns[segment.last + 1] - 2
        top = grid.rows[row] + grid.number_height + segment.lane * (lane_height + 1)
        filled = segment.event.color != look.ink
        elements.append(
            {
                "type": "rectangle",
                "x_start": left,
                "y_start": top,
                "x_end": right,
                "y_end": top + lane_height,
                "fill": segment.event.color if filled else look.paper,
                "outline": segment.event.color,
                "width": 1,
                "radius": 3,
            }
        )
        title = one_line(segment.event.title, right - left - 8, grid.small)
        elements.append(
            _text(
                look,
                title,
                (left + 4, top + 1),
                grid.small,
                color=look.paper if filled else look.ink,
            )
        )
    return elements


def _item_height(grid: Grid, lines: int, *, with_time: bool) -> int:
    height = lines * line_height(grid.small)
    if with_time:
        height += line_height(grid.small - 1)
    return height + 2


@dataclass(frozen=True, slots=True)
class Day:
    """A day of the grid: where it is, its events and where they may start."""

    row: int
    column: int
    events: list[Event]
    top: int
    hidden: int


def _fitting_lines(
    event: Event, grid: Grid, room: int, space: int, *, with_time: bool
) -> list[str] | None:
    """Return the title lines that fit `space` high, two if possible, else None."""
    for count in (2, 1):
        lines = clip(event.title, room, grid.small, count)
        if _item_height(grid, len(lines), with_time=with_time) <= space:
            return lines
    return None


def _items(context: WidgetContext, look: Look, grid: Grid, day: Day) -> list[Element]:
    """Stack a day's events inside its cell and count what does not fit."""
    cell = grid.cell(day.row, day.column)
    bottom = cell.y + cell.height - CELL_PADDING
    room = cell.width - 2 * CELL_PADDING - MARK_WIDTH - 3
    with_time = context.options["includeTime"]
    elements: list[Element] = []
    y = day.top
    left_out = day.hidden
    counter = line_height(grid.small)
    for index, event in enumerate(day.events):
        remaining = len(day.events) - index - 1
        space = bottom - y - (counter if remaining else 0)
        lines = _fitting_lines(event, grid, room, space, with_time=with_time)
        if lines is None:
            left_out += len(day.events) - index
            break
        height = _item_height(grid, len(lines), with_time=with_time)
        x = cell.x + CELL_PADDING
        elements.append(
            {
                "type": "rectangle",
                "x_start": x,
                "y_start": y,
                "x_end": x + MARK_WIDTH - 1,
                "y_end": y + height - 3,
                "fill": event.color,
                "outline": event.color,
                "width": 0,
            }
        )
        text_x = x + MARK_WIDTH + 3
        for number, line in enumerate(lines):
            point = (text_x, y + number * line_height(grid.small))
            elements.append(_text(look, line, point, grid.small))
        if with_time:
            point = (text_x, y + len(lines) * line_height(grid.small))
            clock_text = clock(context, event.start)
            elements.append(_text(look, clock_text, point, grid.small - 1))
        y += height
    if left_out:
        label = context.t("more", count=left_out)
        if text_width(label, grid.small) > cell.width - 2 * CELL_PADDING:
            label = f"+{left_out}"
        point = (cell.x + cell.width - CELL_PADDING - 1, bottom - counter)
        elements.append(_text(look, label, point, grid.small, anchor="ra"))
    return elements


def _cells(
    context: WidgetContext, look: Look, grid: Grid, events: list[Event]
) -> list[Element]:
    """Draw the bars of every row and the events inside every day."""
    elements: list[Element] = []
    for row in range(grid.row_count):
        segments = _segments(grid, row, events)
        lane_height = line_height(grid.small) + 4
        cell_height = grid.rows[row + 1] - grid.rows[row]
        capacity = max(1, int(cell_height * LANE_SHARE) // lane_height)
        lanes = min(capacity, max((s.lane + 1 for s in segments), default=0))
        elements += _bars(look, grid, row, segments, lanes)
        top = grid.rows[row] + grid.number_height + lanes * lane_height + 1
        for column in range(WEEK_LENGTH):
            day = grid.day(row, column)
            hidden = sum(
                1 for s in segments if s.lane >= lanes and s.first <= column <= s.last
            )
            items = [
                event for event in events if not event.is_bar and event.first_day == day
            ]
            day_cell = Day(row, column, items, top, hidden)
            elements += _items(context, look, grid, day_cell)
    return elements


def render(
    context: WidgetContext, look: Look, events: list[Event]
) -> list[dict[str, Any]]:
    """Draw the grid of weeks, with the frame under everything."""
    box = context.box
    small = clamp(
        round(box.height / 40 * (1.25 if context.options["zoom"] else 1)), 9, 16
    )
    heading = clamp(small + 3, 11, 20)
    grid, top = _grid(context, small, heading)
    frame = compose(context, {"type": "column", **look.frame(), "children": []})
    drawn: list[Element] = []
    drawn += _shading(look, grid, context)
    drawn += _lines(look, grid)
    drawn += _headers(context, look, grid, top)
    drawn += _numbers(context, look, grid)
    drawn += _week_numbers(context, look, grid)
    drawn += _cells(context, look, grid, events)
    if context.options["monthHeader"]:
        title = month_year(context.now.date(), context.language)
        point = (grid.columns[0], top - line_height(heading) - 2)
        drawn.append(_text(look, title, point, heading))
    return frame + translate_elements(drawn, box.x, box.y)
