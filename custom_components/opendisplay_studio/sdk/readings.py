"""Read the state of a sensor as a number, a text to show and an alert."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from custom_components.opendisplay_studio.odl import WidgetContext


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


def number_of(value: str) -> float | None:
    """Return `value` as a number, or None when it is not one."""
    try:
        return float(value)
    except ValueError:
        return None


def format_value(state: str, display_state: str, decimals: str) -> str:
    """
    Return the value of a sensor as it is shown.

    A state that is not a number is shown as Home Assistant words it. A number is shown
    as reported, with `decimals` as "auto", or rounded to that many places.
    """
    number = number_of(state)
    if number is None:
        return display_state
    if decimals == "auto":
        return state
    return f"{number:.{int(decimals)}f}"


def limit_of(options: dict[str, Any], key: str) -> float | None:
    """Return the number a text option holds, or None when it is empty or not one."""
    return number_of(str(options.get(key, "")))


def is_alert(state: str, options: dict[str, Any]) -> bool:
    """Return whether the state is below `alertBelow` or above `alertAbove`."""
    number = number_of(state)
    if number is None:
        return False
    below = limit_of(options, "alertBelow")
    above = limit_of(options, "alertAbove")
    return (below is not None and number < below) or (
        above is not None and number > above
    )


def readings_of(context: WidgetContext, ink: str) -> list[Reading]:
    """
    Return what each picked entity shows, in the order they were picked.

    A value outside the limits of `alertBelow` and `alertAbove`, when the widget has
    them, is drawn in `alertColor`; any other is drawn in `ink`.
    """
    options = context.options
    found: list[Reading] = []
    for pick, data in zip(
        context.sources["entities"], context.data["entities"], strict=True
    ):
        alert = is_alert(data["state"], options)
        found.append(
            Reading(
                name=pick.get("label") or data["name"],
                icon=pick.get("icon") or data["icon"],
                value=format_value(
                    data["state"], data["display_state"], options["decimals"]
                ),
                unit=data["unit"] if options["showUnit"] else "",
                color=options["alertColor"] if alert else ink,
            )
        )
    return found
