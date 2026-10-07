"""Sensor list: the values of several entities, one line each."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
)

MIN_ROW_HEIGHT: Final = 22
ROW_GAP: Final = 8


@dataclass(frozen=True, slots=True)
class Reading:
    """What one entity shows: its name, icon, value, unit and the color of the value."""

    name: str
    icon: str
    value: str
    unit: str
    color: str

    @property
    def text(self) -> str:
        """Return the value with its unit, as drawn."""
        return f"{self.value} {self.unit}" if self.unit else self.value


def _number(value: str) -> float | None:
    try:
        return float(value)
    except ValueError:
        return None


def _format_value(state: str, display_state: str, decimals: str) -> str:
    number = _number(state)
    if number is None:
        return display_state
    if decimals == "auto":
        return state
    return f"{number:.{int(decimals)}f}"


def _is_alert(state: str, options: dict[str, Any]) -> bool:
    number = _number(state)
    if number is None:
        return False
    below = _number(str(options["alertBelow"]))
    above = _number(str(options["alertAbove"]))
    return (below is not None and number < below) or (
        above is not None and number > above
    )


def _readings(context: WidgetContext, look: Look) -> list[Reading]:
    options = context.options
    found: list[Reading] = []
    for pick, data in zip(
        context.sources["entities"], context.data["entities"], strict=True
    ):
        alert = _is_alert(data["state"], options)
        found.append(
            Reading(
                name=pick.get("label") or data["name"],
                icon=pick.get("icon") or data["icon"],
                value=_format_value(
                    data["state"], data["display_state"], options["decimals"]
                ),
                unit=data["unit"] if options["showUnit"] else "",
                color=options["alertColor"] if alert else look.ink,
            )
        )
    return found


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
    found = _readings(context, look)
    if not found:
        return compose(context, look.message(context.box, context.t("choose_entities")))
    return compose(context, _list(context, look, found))


RENDERER = render
