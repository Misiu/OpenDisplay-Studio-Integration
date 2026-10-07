"""The upcoming view: the next days in columns, with a bar naming the calendars."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Any, Final

from custom_components.opendisplay_studio.odl import Box
from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    day_heading,
    line_height,
)
from custom_components.opendisplay_studio.widgets.calendar.events import (
    Event,
    calendar_names,
    group_by_day,
    time_range,
)
from custom_components.opendisplay_studio.widgets.calendar.style import (
    Sizes,
    sizes_for,
)
from custom_components.opendisplay_studio.widgets.calendar.text import clip, one_line

GAP: Final = 6
ITEM_GAP: Final = 6
COLUMN_GAP: Final = 18
COLUMN_WIDTH: Final = 250
MIN_BAR_HEIGHT: Final = 160
HEADING_PADDING: Final = 8
JUSTIFY: Final = {"top": "start", "center": "center", "bottom": "end"}

type Group = tuple[date, list[Event]]


@dataclass(slots=True)
class Column:
    """The nodes put into one column and the height they use."""

    nodes: list[dict[str, Any]] = field(default_factory=list)
    used: int = 0
    day: date | None = None


def _groups(context: WidgetContext, events: list[Event]) -> list[Group]:
    """Group events by the day they are listed under, for as many days as asked."""
    today = context.now.date()
    groups = group_by_day(events, today)
    if context.options["todayOnly"]:
        return [group for group in groups if group[0] == today]
    return groups[: int(context.options["days"])]


def _heading(
    context: WidgetContext, look: Look, day: date, sizes: Sizes, *, continued: bool
) -> tuple[dict[str, Any], int]:
    """Return a day's heading, filled for today, and its height."""
    label = day_heading(day, context.language, context.options["dateFormat"])
    today = day == context.now.date() and context.options["highlightToday"]
    height = line_height(sizes.heading) + HEADING_PADDING
    filled = today and not continued
    node: dict[str, Any] = {
        "type": "row",
        "h": height,
        "padding": [0, 6],
        "align": "center",
        "children": [
            look.text(
                label,
                size=sizes.heading,
                color=look.paper if filled else look.ink,
            )
        ],
    }
    if filled:
        node["background"] = look.ink
        node["radius"] = 4
    return node, height


def _marker(look: Look, event: Event, number: int | None, size: int) -> dict[str, Any]:
    """Return the little box in front of an event: its number, or a hash for all day."""
    box = line_height(size) + 2
    all_day = number is None
    text = look.text(
        "#" if all_day else number,
        size=size,
        color=look.paper if all_day else look.ink,
    )
    node: dict[str, Any] = {
        "type": "row",
        "w": box,
        "h": box,
        "justify": "center",
        "align": "center",
        "radius": 3,
        "border": event.color,
        "border_width": 1,
        "children": [text],
    }
    if all_day:
        node["background"] = event.color
    return node


@dataclass(frozen=True, slots=True)
class ItemStyle:
    """How much of an event an item may show."""

    width: int
    sizes: Sizes
    title_lines: int
    description_lines: int
    show_index: bool


def _item(
    context: WidgetContext,
    look: Look,
    event: Event,
    style: ItemStyle,
    number: int,
) -> tuple[dict[str, Any], int]:
    """Return an event as an item with its marker, title, description and time."""
    options = context.options
    sizes = style.sizes
    marker_size = max(10, sizes.small - 1)
    marker = line_height(marker_size) + 2
    lead = marker + GAP if style.show_index else 0
    room = style.width - lead
    rows: list[tuple[str, int]] = [
        (line, sizes.title)
        for line in clip(event.title, room, sizes.title, style.title_lines)
    ]
    if options["includeDescription"] and event.description:
        lines = clip(event.description, room, sizes.small, style.description_lines)
        rows += [(line, sizes.small) for line in lines]
    if options["showLocation"] and event.location:
        rows.append((one_line(event.location, room, sizes.small), sizes.small))
    if options["includeTime"] and not event.all_day:
        rows.append(
            (one_line(time_range(context, event), room, sizes.small), sizes.small)
        )
    texts = [look.text(line, size=size, h=line_height(size)) for line, size in rows]
    height = max(sum(line_height(size) for _, size in rows), marker)
    children: list[dict[str, Any]] = []
    if style.show_index:
        children.append(
            _marker(look, event, None if event.all_day else number, marker_size)
        )
    children.append({"type": "column", "grow": 1, "children": texts})
    node = {"type": "row", "gap": GAP, "h": height, "children": children}
    return node, height


@dataclass(slots=True)
class Flow:
    """Columns being filled with headings and items, top to bottom, left to right."""

    context: WidgetContext
    look: Look
    sizes: Sizes
    height: int
    columns: list[Column]
    counter_height: int
    current: int = 0
    seen: set[date] = field(default_factory=set)

    def _limit(self) -> int:
        last = self.current == len(self.columns) - 1
        return self.height - (self.counter_height if last else 0)

    def place(self, day: date, item: dict[str, Any], height: int) -> bool:
        """Put an item under its day's heading where it fits; False if nowhere."""
        while True:
            column = self.columns[self.current]
            heading, heading_height = _heading(
                self.context, self.look, day, self.sizes, continued=day in self.seen
            )
            needs_heading = column.day != day
            heights = ([heading_height] if needs_heading else []) + [height]
            gaps = len(heights) - (0 if column.nodes else 1)
            cost = sum(heights) + ITEM_GAP * gaps
            if column.used + cost <= self._limit():
                break
            if self.current == len(self.columns) - 1:
                return False
            self.current += 1
        if needs_heading:
            column.nodes.append(heading)
        column.nodes.append(item)
        column.used += cost
        column.day = day
        self.seen.add(day)
        return True


@dataclass(frozen=True, slots=True)
class Pour:
    """Where the groups are poured: the area, the columns in it and a line to spare."""

    area: Box
    count: int
    counter_height: int


def _flow(
    context: WidgetContext, look: Look, groups: list[Group], pour: Pour
) -> tuple[list[Column], int]:
    """Pour the groups into columns; return them and how many events did not fit."""
    area, count = pour.area, pour.count
    sizes = sizes_for(context.box.height, zoom=context.options["zoom"])
    width = (area.width - COLUMN_GAP * (count - 1)) // count
    style = ItemStyle(
        width=width,
        sizes=sizes,
        title_lines=clamp(area.height // 150, 1, 3),
        description_lines=1 if area.height < 260 else 2,
        show_index=context.options["showIndex"],
    )
    flow = Flow(
        context,
        look,
        sizes,
        area.height,
        [Column() for _ in range(count)],
        pour.counter_height,
    )
    number = 0
    left_out = 0
    for day, events in groups:
        for event in events:
            item, height = _item(context, look, event, style, number + 1)
            if not flow.place(day, item, height):
                left_out += 1
            elif not event.all_day:
                number += 1
    return flow.columns, left_out


def _title_bar(
    context: WidgetContext, look: Look, sizes: Sizes, width: int
) -> tuple[dict[str, Any], int]:
    options = context.options
    height = line_height(sizes.small) + 10
    title = options["titleBarText"] or context.t("upcoming_events")
    names = one_line(calendar_names(context), width // 3, sizes.small)
    icon = context.sources["calendars"][0].get("icon") or "calendar"
    node = {
        "type": "row",
        "h": height,
        "padding": [0, 10],
        "gap": 8,
        "align": "center",
        "radius": 8,
        "border": look.ink,
        "border_width": 1,
        "children": [
            look.icon(icon, size=sizes.small + 4),
            look.text(title, size=sizes.small + 1, truncate=True, grow=1),
            look.text(names, size=sizes.small),
        ],
    }
    return node, height


def render(
    context: WidgetContext, look: Look, events: list[Event]
) -> list[dict[str, Any]]:
    """Draw the next days of events in columns, or say there are none."""
    box = context.box
    options = context.options
    padding = clamp(min(box.width, box.height) // 40, 6, 14)
    sizes = sizes_for(box.height, zoom=options["zoom"])
    bar = None
    bar_height = 0
    if options["showTitleBar"] and box.height >= MIN_BAR_HEIGHT:
        bar, bar_height = _title_bar(context, look, sizes, box.width - 2 * padding)
    inner_width = box.width - 2 * padding
    content_height = box.height - 2 * padding - (bar_height + GAP if bar else 0)
    area = Box(0, 0, inner_width, content_height)
    groups = _groups(context, events)
    children: list[dict[str, Any]] = []
    if not groups:
        message = look.text(
            context.t("no_events_today" if options["todayOnly"] else "no_events"),
            size=sizes.title,
            align="center",
        )
        children.append(
            {
                "type": "column",
                "h": content_height,
                "justify": "center",
                "children": [message],
            }
        )
    else:
        chosen = options["columns"]
        count = (
            clamp(inner_width // COLUMN_WIDTH, 1, 3)
            if chosen == "auto"
            else int(chosen)
        )
        counter = line_height(sizes.small) + ITEM_GAP
        cells, left_out = _flow(context, look, groups, Pour(area, count, 0))
        if left_out:
            pour = Pour(area, count, counter)
            cells, left_out = _flow(context, look, groups, pour)
        width = (inner_width - COLUMN_GAP * (count - 1)) // count
        nodes = []
        for index, cell in enumerate(cells):
            body = list(cell.nodes)
            if left_out and index == count - 1:
                more = context.t("more", count=left_out)
                body.append(
                    look.text(
                        more,
                        size=sizes.small,
                        align="right",
                        h=line_height(sizes.small),
                    )
                )
            nodes.append(
                {
                    "type": "column",
                    "w": width,
                    "h": content_height,
                    "gap": ITEM_GAP,
                    "justify": JUSTIFY[options["alignment"]],
                    "children": body,
                }
            )
        children.append(
            {"type": "row", "gap": COLUMN_GAP, "h": content_height, "children": nodes}
        )
    if bar:
        children.append(bar)
    root = {
        "type": "column",
        "padding": padding,
        "gap": GAP,
        **look.frame(),
        "children": children,
    }
    return compose(context, root)
