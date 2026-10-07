"""Calendar: events as upcoming days, an agenda or a grid of weeks."""

from __future__ import annotations

from typing import Any

from custom_components.opendisplay_studio.sdk import Look, WidgetContext, compose
from custom_components.opendisplay_studio.widgets.calendar import (
    agenda,
    upcoming,
    weeks,
)
from custom_components.opendisplay_studio.widgets.calendar.events import collect


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the view the options ask for, or say that no calendar is picked."""
    look = Look.of(context)
    if not context.sources["calendars"]:
        return compose(
            context, look.message(context.box, context.t("choose_calendars"))
        )
    view = context.options["view"]
    events = collect(context, look, hide_past=view != "weeks")
    if view == "weeks":
        return weeks.render(context, look, events)
    if view == "agenda":
        return agenda.render(context, look, events)
    return upcoming.render(context, look, events)


RENDERER = render
