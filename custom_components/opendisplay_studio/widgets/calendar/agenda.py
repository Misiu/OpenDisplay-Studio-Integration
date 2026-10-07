"""The agenda view: a bar for each day, each event a line with its times."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    day_heading,
    line_height,
    text_width,
)
from custom_components.opendisplay_studio.widgets.calendar.events import (
    Event,
    clock,
    group_by_day,
)
from custom_components.opendisplay_studio.widgets.calendar.style import sizes_for
from custom_components.opendisplay_studio.widgets.calendar.text import one_line

GAP: Final = 3
INLINE_GAP: Final = 8
PILL_PADDING: Final = 7
MIN_DESCRIPTION: Final = 48
ALL_DAY_MARK: Final = "#"
SLACK: Final = 2


@dataclass(frozen=True, slots=True)
class Style:
    """The sizes of one agenda: the frame's width and the heights of its lines."""

    width: int
    title: int
    small: int
    pill_width: int

    @property
    def row_height(self) -> int:
        """Return the height of a line with an event."""
        return line_height(self.title) + 6

    @property
    def heading_height(self) -> int:
        """Return the height of a bar with a day."""
        return line_height(self.small) + 8


def _pill(look: Look, event: Event, text: str, style: Style) -> dict[str, Any]:
    """Return a rounded box holding a time, in the color of the event's calendar."""
    return {
        "type": "row",
        "w": style.pill_width,
        "h": line_height(style.small) + 4,
        "justify": "center",
        "align": "center",
        "radius": 6,
        "background": event.color,
        "children": [look.text(text, size=style.small, color=look.paper)],
    }


def _row(
    context: WidgetContext, look: Look, event: Event, style: Style
) -> dict[str, Any]:
    """Return one event: when it starts, its title and description, when it ends."""
    options = context.options
    show_times = options["includeTime"]
    lead = None
    if event.all_day or show_times:
        mark = ALL_DAY_MARK if event.all_day else clock(context, event.start)
        lead = _pill(look, event, mark, style)
    end = None
    if show_times and not event.all_day:
        end = _pill(look, event, clock(context, event.end), style)
    pills = [pill for pill in (lead, end) if pill is not None]
    room = style.width - SLACK - len(pills) * style.pill_width
    room -= INLINE_GAP * len(pills)  # one gap per pill; the title makes the rest
    title = one_line(event.title, room, style.title)
    detail = " - ".join(
        part
        for part in (
            event.description if options["includeDescription"] else "",
            event.location if options["showLocation"] else "",
        )
        if part
    )
    remaining = room - text_width(title, style.title) - INLINE_GAP
    body = [look.text(title, size=style.title, grow=0 if detail else 1)]
    if detail and remaining >= MIN_DESCRIPTION:
        text = one_line(detail, remaining, style.small)
        body.append(look.text(text, size=style.small, grow=1))
    else:
        body[0]["grow"] = 1
    children = [*([lead] if lead else []), *body, *([end] if end else [])]
    return {
        "type": "row",
        "gap": INLINE_GAP,
        "align": "center",
        "h": style.row_height,
        "children": children,
    }


def _heading(
    context: WidgetContext, look: Look, day_text: str, *, today: bool, style: Style
) -> dict[str, Any]:
    """Return the bar that names a day; black when it is today."""
    ink = look.paper if today else look.ink
    node: dict[str, Any] = {
        "type": "row",
        "h": style.heading_height,
        "justify": "center",
        "align": "center",
        "radius": 6,
        "border": look.ink,
        "border_width": 1,
        "children": [look.text(day_text, size=style.small, color=ink)],
    }
    if today:
        node["background"] = look.ink
    return node


def _pill_width(context: WidgetContext, events: list[Event], small: int) -> int:
    texts = [ALL_DAY_MARK]
    for event in events:
        texts += [clock(context, event.start), clock(context, event.end)]
    return max(text_width(text, small) for text in texts) + 2 * PILL_PADDING


def render(
    context: WidgetContext, look: Look, events: list[Event]
) -> list[dict[str, Any]]:
    """Draw every day with events as a bar and its events as lines under it."""
    box = context.box
    options = context.options
    padding = clamp(min(box.width, box.height) // 40, 6, 14)
    sizes = sizes_for(box.height, zoom=options["zoom"])
    title = clamp(round(box.height / 26 * (1.25 if options["zoom"] else 1)), 11, 24)
    small = max(10, title - 4)
    width = box.width - 2 * padding
    style = Style(width, title, small, _pill_width(context, events, small))
    height = box.height - 2 * padding
    today = context.now.date()
    nodes: list[dict[str, Any]] = []
    used = 0
    left_out = 0
    counter = line_height(sizes.small) + GAP
    for pass_reserve in (0, counter):
        nodes, used, left_out = [], 0, 0
        for day, items in group_by_day(events, today):
            label = day_heading(day, context.language, options["dateFormat"])
            needed = style.heading_height + style.row_height + 2 * GAP
            first = True
            for event in items:
                cost = (
                    style.row_height
                    + GAP
                    + (needed - style.row_height - GAP if first else 0)
                )
                if used + cost > height - pass_reserve:
                    left_out += 1
                    continue
                if first:
                    highlight = day == today and options["highlightToday"]
                    nodes.append(
                        _heading(context, look, label, today=highlight, style=style)
                    )
                    first = False
                nodes.append(_row(context, look, event, style))
                used += cost
        if not left_out:
            break
    if not nodes:
        message = look.text(context.t("no_events"), size=title, align="center")
        nodes = [
            {"type": "column", "h": height, "justify": "center", "children": [message]}
        ]
    if left_out:
        more = context.t("more", count=left_out)
        nodes.append(
            look.text(more, size=sizes.small, align="right", h=line_height(sizes.small))
        )
    root = {
        "type": "column",
        "padding": padding,
        "gap": GAP,
        **look.frame(),
        "children": nodes,
    }
    return compose(context, root)
