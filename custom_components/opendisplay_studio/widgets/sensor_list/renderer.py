"""Sensor list: the values of several entities, one line each."""

from __future__ import annotations

from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    Reading,
    WidgetContext,
    clamp,
    compose,
    readings_of,
)

MIN_ROW_HEIGHT: Final = 22
ROW_GAP: Final = 8


def _row(
    context: WidgetContext, look: Look, reading: Reading, height: int
) -> dict[str, Any]:
    """One reading as a line: icon, name, and the value at the right."""
    options = context.options
    size = clamp(height * 6 // 10, 10, 28)
    children: list[dict[str, Any]] = []
    if options["showIcon"]:
        children.append(look.icon(reading.icon, size=size, color=reading.color))
    if options["showName"]:
        children.append(look.text(reading.name, size=size, truncate=True, grow=1))
    else:
        children.append({"type": "spacer"})
    children.append(look.text(reading.text, size=size, color=reading.color))
    return {
        "type": "row",
        "gap": ROW_GAP,
        "padding": [0, ROW_GAP],
        "grow": 1,
        "children": children,
    }


def _list(context: WidgetContext, look: Look, found: list[Reading]) -> dict[str, Any]:
    """Lay out the first readings that fit the frame, one line each."""
    box = context.box
    shown = found[: max(1, box.height // MIN_ROW_HEIGHT)]
    row_height = box.height // len(shown)
    children: list[dict[str, Any]] = []
    for index, reading in enumerate(shown):
        if index and context.options["showDividers"]:
            children.append(look.divider())
        children.append(_row(context, look, reading, row_height))
    return {"type": "column", **look.frame(), "children": children}


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the picked entities as lines, or say that none is picked."""
    look = Look.of(context)
    found = readings_of(context, look.ink)
    if not found:
        return compose(context, look.message(context.box, context.t("choose_entities")))
    return compose(context, _list(context, look, found))


RENDERER = render
