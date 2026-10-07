"""What the widgets put on the picture: text that never collides, icons on request."""

from __future__ import annotations

from itertools import pairwise
from typing import Any

import pytest

from custom_components.opendisplay_studio.sdk import text_width
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from scripts.widget_devkit.scenario import context_for, load_states, with_options
from tests.widgets.test_catalog import widget_folder

WIDE_AND_SMALL = [(720, 400), (400, 240), (296, 128), (360, 200), (800, 480)]


def _elements(
    widget_id: str, state_id: str, size: tuple[int, int], **options: Any
) -> list[dict[str, Any]]:
    state = with_options(load_states(widget_folder(widget_id))[state_id], options)
    context = context_for(DEFAULT_REGISTRY, widget_id, state, size, "bw")
    return DEFAULT_REGISTRY.renderer(widget_id)(context)


def _spans(elements: list[dict[str, Any]], marker: str) -> list[tuple[int, int]]:
    """Return where each text containing `marker` starts and ends, left to right."""
    return sorted(
        (element["x"], element["x"] + text_width(element["value"], element["size"]))
        for element in elements
        if element["type"] == "text" and marker in str(element["value"])
    )


@pytest.mark.parametrize("size", WIDE_AND_SMALL)
def test_hourly_labels_never_touch_each_other(size: tuple[int, int]) -> None:
    elements = _elements("weather", "hourly-details", size)

    spans = _spans(elements, ":")

    assert len(spans) >= 2
    for (_, end), (start, _) in pairwise(spans):
        assert end <= start


@pytest.mark.parametrize("size", WIDE_AND_SMALL)
def test_daily_temperatures_never_touch_each_other(size: tuple[int, int]) -> None:
    elements = _elements("weather", "daily", size)

    spans = _spans(elements, "°/")

    for (_, end), (start, _) in pairwise(spans):
        assert end <= start


def test_calendar_icons_are_drawn_only_when_asked_for() -> None:
    without = _elements("agenda", "two-children", (400, 240))
    with_icons = _elements("agenda", "two-children", (400, 240), showIcons=True)

    assert [e for e in without if e["type"] == "icon"] == []
    icons = [e["value"] for e in with_icons if e["type"] == "icon"]
    assert icons.count("mdi:swim") == 2
    assert icons.count("mdi:soccer") == 3


def test_a_calendar_without_an_icon_gets_the_calendar_icon() -> None:
    state = load_states(widget_folder("agenda"))["one-event"]
    elements = _elements("agenda", "one-event", (400, 240), showIcons=True)

    assert state["sources"]["calendars"][0].get("icon") is None
    assert [e["value"] for e in elements if e["type"] == "icon"] == ["mdi:calendar"]


def test_the_place_of_an_event_is_drawn_below_its_title() -> None:
    elements = _elements("agenda", "two-children", (400, 240), showLocation=True)

    title = next(e for e in elements if e.get("value") == "Swimming")
    place = next(e for e in elements if e.get("value") == "City pool")
    assert place["y"] > title["y"]
