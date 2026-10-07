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


SQUARE_TILE = (240, 240)
STRIP_TILE = (400, 120)
TALL_TILE = (160, 400)


def _text(elements: list[dict[str, Any]], value: str) -> dict[str, Any]:
    return next(e for e in elements if e["type"] == "text" and e["value"] == value)


def _separators(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        e
        for e in elements
        if e["type"] == "line"
        or (e["type"] == "rectangle" and e["x_start"] == e["x_end"])
    ]


@pytest.mark.parametrize("size", [SQUARE_TILE, TALL_TILE])
def test_the_unit_is_below_the_value_in_a_square_or_tall_tile(
    size: tuple[int, int],
) -> None:
    elements = _elements("sensor-card", "single", size)

    value, unit = _text(elements, "21.4"), _text(elements, "°C")

    assert unit["y"] > value["y"] + value["size"]
    assert unit["size"] < value["size"]


def test_the_unit_is_beside_the_value_in_a_strip() -> None:
    elements = _elements("sensor-card", "single", STRIP_TILE)

    value, unit = _text(elements, "21.4"), _text(elements, "°C")

    assert unit["x"] >= value["x"] + text_width("21.4", value["size"])
    assert unit["size"] < value["size"]


def test_a_strip_has_a_vertical_line_and_a_tall_tile_a_horizontal_one() -> None:
    strip = _separators(_elements("sensor-card", "single", STRIP_TILE))
    tall = _separators(_elements("sensor-card", "single", TALL_TILE))
    square = _separators(_elements("sensor-card", "single", SQUARE_TILE))

    assert [e["type"] for e in strip] == ["rectangle"]
    assert [e["type"] for e in tall] == ["line"]
    assert square == []


@pytest.mark.parametrize("size", [STRIP_TILE, TALL_TILE])
def test_the_separator_can_be_turned_off(size: tuple[int, int]) -> None:
    elements = _elements("sensor-card", "single", size, showSeparator=False)

    assert _separators(elements) == []


def test_the_icon_is_larger_than_the_name_beside_it_in_a_strip() -> None:
    elements = _elements("sensor-card", "single", STRIP_TILE)

    icon = next(e for e in elements if e["type"] == "icon")
    name = _text(elements, "Kitchen temperature")

    assert icon["size"] > 2 * name["size"]


def test_the_separator_lies_between_the_icon_and_the_text_of_a_strip() -> None:
    elements = _elements("sensor-card", "single", STRIP_TILE)

    icon = next(e for e in elements if e["type"] == "icon")
    separator = _separators(elements)[0]
    name = _text(elements, "Kitchen temperature")
    height = separator["y_end"] - separator["y_start"]

    assert height < STRIP_TILE[1] * 0.7
    assert icon["x"] < separator["x_start"] < name["x"]


def test_the_name_and_value_of_a_strip_are_centered_beside_the_line() -> None:
    elements = _elements("sensor-card", "single", STRIP_TILE)

    name = _text(elements, "Kitchen temperature")
    value = _text(elements, "21.4")
    unit = _text(elements, "°C")
    name_middle = name["x"] + text_width(name["value"], name["size"]) / 2
    shown = value["x"] + (unit["x"] + text_width("°C", unit["size"]) - value["x"]) / 2

    assert abs(name_middle - shown) <= 4
    assert unit["x"] - (value["x"] + text_width("21.4", value["size"])) >= 8


def test_alignment_moves_the_text_of_a_square_tile() -> None:
    left = _elements("sensor-card", "single", SQUARE_TILE, align="left")
    right = _elements("sensor-card", "single", SQUARE_TILE, align="right")

    assert _text(right, "21.4")["x"] > _text(left, "21.4")["x"]


def test_a_calendar_color_equal_to_the_background_is_drawn_in_the_ink() -> None:
    elements = _elements(
        "agenda", "two-children", (400, 240), color="yellow", background="red"
    )

    swimming = _text(elements, "Ola")

    assert swimming["color"] == "yellow"
