"""The events of a calendar widget: what is shown, in what order, under which day."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
from itertools import groupby
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    format_time,
)

WEEKDAYS: Final = (
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
)
WEEK_LENGTH: Final = 7
SATURDAY: Final = 5
MAX_WEEKS: Final = 6


@dataclass(frozen=True, slots=True)
class Event:
    """One event with the look of the calendar it came from."""

    title: str
    description: str
    location: str
    start: datetime
    end: datetime
    all_day: bool
    label: str
    color: str
    icon: str

    @property
    def first_day(self) -> date:
        """Return the day the event starts on."""
        return self.start.date()

    @property
    def last_day(self) -> date:
        """Return the last day covered; an end at midnight belongs to the day before."""
        if self.end <= self.start:
            return self.first_day
        return (self.end - timedelta(microseconds=1)).date()

    @property
    def spans_days(self) -> bool:
        """Tell whether the event covers more than one day."""
        return self.last_day > self.first_day

    @property
    def is_bar(self) -> bool:
        """Tell whether a grid draws it as a bar over days, not as an item in a day."""
        return self.all_day or self.spans_days


def week_floor(day: date, first_day: str) -> date:
    """Return the first day of the week of `day`, for weeks starting on `first_day`."""
    offset = (day.weekday() - WEEKDAYS.index(first_day)) % WEEK_LENGTH
    return day - timedelta(days=offset)


def clock(context: WidgetContext, moment: datetime) -> str:
    """Return a time of day the way the options ask for."""
    return format_time(moment, use_24h=context.options["use24h"])


def time_range(context: WidgetContext, event: Event) -> str:
    """Return when an event starts and ends: "06:30 - 07:15"."""
    return f"{clock(context, event.start)} - {clock(context, event.end)}"


def _lines(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.strip()]


def _ignored(event: Event, phrases: list[str], exact: list[str]) -> bool:
    haystack = f"{event.title}\n{event.description}".lower()
    if any(phrase.lower() in haystack for phrase in phrases):
        return True
    return any(
        text.strip().lower() == phrase.lower()
        for phrase in exact
        for text in (event.title, event.description)
    )


def _event(raw: dict[str, Any], pick: dict[str, Any], look: Look, busy: str) -> Event:
    color = pick.get("color") or look.ink
    return Event(
        title=raw["summary"].strip() or busy,
        description=raw["description"].strip(),
        location=raw["location"].strip(),
        start=raw["start"],
        end=raw["end"],
        all_day=raw["all_day"],
        label=pick.get("label", ""),
        color=look.ink if color == look.paper else color,
        icon=pick.get("icon") or "calendar",
    )


def _is_over(event: Event, context: WidgetContext, *, hide_started: bool) -> bool:
    """Tell whether an event has ended before the moment that counts as now."""
    if event.all_day:
        return event.last_day < context.now.date()
    return (
        event.end <= context.now
        if hide_started
        else event.last_day < context.now.date()
    )


def collect(context: WidgetContext, look: Look, *, hide_past: bool) -> list[Event]:
    """Merge the picked calendars: filtered, without twins, in the order they happen."""
    options = context.options
    phrases = _lines(options["ignore"])
    exact = _lines(options["ignoreExact"])
    found: dict[tuple[Any, ...], Event] = {}
    busy = context.t("busy")
    for pick, data in zip(
        context.sources["calendars"], context.data["calendars"], strict=True
    ):
        for raw in data["events"]:
            event = _event(raw, pick, look, busy)
            if _ignored(event, phrases, exact):
                continue
            if hide_past and _is_over(event, context, hide_started=options["hidePast"]):
                continue
            key = (
                event.title,
                event.description,
                event.start,
                event.end,
                event.all_day,
            )
            found.setdefault(key, event)
    return sorted(
        found.values(),
        key=lambda event: (
            event.first_day,
            not event.all_day,
            event.start,
            event.title,
        ),
    )


def calendar_names(context: WidgetContext) -> str:
    """Return the names of the picked calendars, for the title bar."""
    names = [
        pick.get("label") or data.get("name") or pick["id"]
        for pick, data in zip(
            context.sources["calendars"], context.data["calendars"], strict=True
        )
    ]
    return ", ".join(dict.fromkeys(names))


def display_day(event: Event, today: date) -> date:
    """Return the day a list shows an event under; a running one counts as today."""
    return max(event.first_day, today)


def group_by_day(events: list[Event], today: date) -> list[tuple[date, list[Event]]]:
    """Group events under the day a list shows them under, in order of days."""
    listed = sorted(events, key=lambda event: display_day(event, today))
    return [
        (day, list(items))
        for day, items in groupby(listed, key=lambda event: display_day(event, today))
    ]
