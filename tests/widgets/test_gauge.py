"""The gauge draws the value of a sensor on a half dial, as a marker or a filled arc."""

from __future__ import annotations

from copy import deepcopy
from math import atan2, degrees, hypot
from typing import Any

import pytest
from PIL import Image

from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
)
from scripts.widget_devkit.scenario import context_for, draw, load_states, with_options

WIDGET = "gauge"
STATES = load_states(BUILTIN_WIDGET_DIRECTORY / WIDGET)
WIDE = (240, 160)
RED = (255, 0, 0)
BLACK = (0, 0, 0)


async def drawn_state(
    state: dict[str, Any], size: tuple[int, int] = WIDE, palette: str = "bwr"
) -> tuple[Image.Image, list[dict[str, Any]]]:
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, palette)
    return await draw(context, DEFAULT_REGISTRY.renderer(WIDGET))


def with_value(value: str, **options: Any) -> dict[str, Any]:
    state = with_options(deepcopy(STATES["normal"]), options)
    entity = state["data"]["entities"][0]
    entity["state"] = entity["display_state"] = value
    return state


def marker_of(elements: list[dict[str, Any]]) -> dict[str, Any]:
    """The marker across the arc: the thickest line."""
    lines = [element for element in elements if element["type"] == "line"]
    return max(lines, key=lambda line: line["width"])


def center_of(elements: list[dict[str, Any]]) -> tuple[int, int]:
    arcs = [element for element in elements if element["type"] == "arc"]
    return arcs[0]["x"], arcs[0]["y"]


def angle_of(elements: list[dict[str, Any]], line: dict[str, Any]) -> float:
    """The angle of the line from the dial's center, clockwise from three o'clock."""
    x, y = center_of(elements)
    middle_x = (line["x_start"] + line["x_end"]) / 2
    middle_y = (line["y_start"] + line["y_end"]) / 2
    return degrees(atan2(middle_y - y, middle_x - x)) % 360


@pytest.mark.parametrize(
    ("value", "angle"),
    [("0", 180), ("25", 225), ("50", 270), ("75", 315), ("100", 360)],
)
async def test_the_marker_lies_at_the_angle_of_the_value(
    value: str, angle: float
) -> None:
    _, elements = await drawn_state(with_value(value, showTicks=False))

    found = angle_of(elements, marker_of(elements))

    assert found == pytest.approx(angle % 360, abs=2)


@pytest.mark.parametrize(("value", "angle"), [("-40", 180), ("250", 360)])
async def test_a_value_beyond_the_scale_stays_at_its_end(
    value: str, angle: float
) -> None:
    _, elements = await drawn_state(with_value(value, showTicks=False))

    assert angle_of(elements, marker_of(elements)) == pytest.approx(angle % 360, abs=2)


async def test_the_scale_can_start_below_zero() -> None:
    state = with_value("0", min=-10, max=10, showTicks=False)

    _, elements = await drawn_state(state)

    assert angle_of(elements, marker_of(elements)) == pytest.approx(270, abs=2)


async def test_the_limits_of_the_scale_are_written_under_the_ends_of_the_arc() -> None:
    _, elements = await drawn_state(with_value("40", min=-10, max=25))

    texts = {e["value"]: e for e in elements if e["type"] == "text"}

    assert "-10" in texts
    assert "25" in texts
    assert texts["-10"]["x"] < texts["25"]["x"]
    assert texts["-10"]["y"] == texts["25"]["y"]


async def test_the_value_is_written_with_its_unit() -> None:
    _, elements = await drawn_state(with_value("64"))

    assert "64.0 %" in [e["value"] for e in elements if e["type"] == "text"]


def band_colors(elements: list[dict[str, Any]]) -> list[str]:
    """The colors of the solid bands, in the order they are drawn."""
    return [e["outline"] for e in elements if e["type"] == "arc" and e["width"] > 3]


def band_sweeps(elements: list[dict[str, Any]]) -> list[tuple[float, float]]:
    return [
        (e["start_angle"], e["end_angle"])
        for e in elements
        if e["type"] == "arc" and e["width"] > 3
    ]


TRAFFIC = [
    {"from": None, "color": "green"},
    {"from": 40, "color": "yellow"},
    {"from": 80, "color": "red"},
]


async def test_a_scale_with_no_ranges_has_no_colored_bands() -> None:
    _, elements = await drawn_state(with_value("50"))

    assert band_colors(elements) == []


async def test_ranges_cut_the_arc_into_colored_bands_where_each_starts() -> None:
    state = with_value("50", ranges=TRAFFIC, showTicks=False)

    image, elements = await drawn_state(state)

    assert band_colors(elements) == ["green", "yellow", "red"]
    assert band_sweeps(elements) == [
        (180, pytest.approx(252, abs=1)),
        (pytest.approx(252, abs=1), pytest.approx(324, abs=1)),
        (pytest.approx(324, abs=1), 0),
    ]
    assert {(0, 255, 0), (255, 255, 0), RED} <= set(
        image.convert("RGB").get_flattened_data()
    )


@pytest.mark.parametrize("count", [1, 2, 4, 6])
async def test_the_user_decides_how_many_ranges_there_are(count: int) -> None:
    colors = ["green", "yellow", "red", "blue", "black", "white"]
    ranges = [
        {"from": None if index == 0 else index * 10, "color": colors[index]}
        for index in range(count)
    ]

    _, elements = await drawn_state(with_value("50", ranges=ranges))

    assert band_colors(elements) == colors[:count]


async def test_a_single_range_colors_the_whole_arc() -> None:
    _, elements = await drawn_state(
        with_value("50", ranges=[{"from": None, "color": "blue"}])
    )

    assert band_colors(elements) == ["blue"]
    assert band_sweeps(elements) == [(180, 0)]


async def test_the_ranges_may_be_fractions_of_a_scale_from_0_to_1() -> None:
    ranges = [
        {"from": None, "color": "green"},
        {"from": 0.4, "color": "yellow"},
        {"from": 0.8, "color": "red"},
    ]
    state = with_value("0.62", min=0, max=1, ranges=ranges)

    _, elements = await drawn_state(state)

    sweeps = band_sweeps(elements)
    assert sweeps[0][1] == pytest.approx(180 + 0.4 * 180, abs=1)
    assert sweeps[1][1] == pytest.approx(180 + 0.8 * 180, abs=1)


async def test_there_is_no_color_before_the_first_range_when_it_starts_later() -> None:
    ranges = [{"from": 40, "color": "yellow"}, {"from": 80, "color": "red"}]

    _, elements = await drawn_state(with_value("50", ranges=ranges))

    assert band_colors(elements) == ["yellow", "red"]
    assert band_sweeps(elements)[0][0] == pytest.approx(252, abs=1)


async def test_a_range_starting_beyond_the_scale_is_left_out() -> None:
    ranges = [{"from": None, "color": "green"}, {"from": 500, "color": "red"}]

    _, elements = await drawn_state(with_value("50", ranges=ranges))

    assert band_colors(elements) == ["green"]


async def test_the_marker_is_in_ink_so_it_shows_on_a_range() -> None:
    _, elements = await drawn_state(with_value("91", ranges=TRAFFIC))

    assert marker_of(elements)["fill"] == "black"


async def test_a_filled_arc_takes_the_color_of_each_range_it_passes() -> None:
    state = with_value("60", ranges=TRAFFIC, style="arc")

    _, elements = await drawn_state(state)

    assert band_colors(elements) == ["green", "yellow"]
    sweeps = band_sweeps(elements)
    assert sweeps[-1][1] == pytest.approx(180 + 0.6 * 180, abs=1)


async def test_a_filled_arc_without_ranges_is_in_ink() -> None:
    _, elements = await drawn_state(with_value("60", style="arc"))

    assert band_colors(elements) == ["black"]


async def test_a_filled_arc_ends_at_the_value() -> None:
    plain = await drawn_state(with_value("50", style="arc", showTicks=False))
    image, elements = plain
    arcs = [e for e in elements if e["type"] == "arc" and e["width"] > 3]

    assert len(arcs) == 1
    assert arcs[0]["start_angle"] == 180
    assert arcs[0]["end_angle"] == pytest.approx(270, abs=1)
    center = center_of(elements)
    top = (center[0], center[1] - arcs[0]["radius"] + 2)
    assert image.convert("RGB").getpixel(top) == BLACK


async def test_a_sensor_that_cannot_be_read_has_no_marker_and_says_why() -> None:
    _, elements = await drawn_state(STATES["unavailable"])

    assert "unavailable" in [e["value"] for e in elements if e["type"] == "text"]
    assert all(e["width"] <= 2 for e in elements if e["type"] == "line")


async def test_a_scale_with_no_length_does_not_fail() -> None:
    image, _ = await drawn_state(with_value("5", min=5, max=5))

    assert image.size == WIDE


@pytest.mark.parametrize("style", ["needle", "arc"])
@pytest.mark.parametrize(
    "state_id", ["normal", "load", "overload", "unit-scale", "negative", "out-of-range"]
)
@pytest.mark.parametrize(
    "size", [(96, 64), (120, 80), WIDE, (160, 240), (296, 128), (800, 480), (24, 24)]
)
async def test_nothing_leaves_the_frame_at_any_size(
    style: str, state_id: str, size: tuple[int, int]
) -> None:
    state = with_options(deepcopy(STATES[state_id]), {"style": style})

    image, elements = await drawn_state(state, size)

    assert image.size == size
    for element in elements:
        for key in ("x_end", "x"):
            assert element.get(key, 0) <= size[0] + 1
        for key in ("y_end", "y"):
            assert element.get(key, 0) <= size[1] + 1
        assert element.get("x", 0) >= 0
        assert element.get("y", 0) >= 0


async def test_a_roomy_frame_has_ticks_limits_and_a_name() -> None:
    _, elements = await drawn_state(with_value("40"))

    words = [e["value"] for e in elements if e["type"] == "text"]
    assert "Living room" in words
    assert "0" in words
    assert "100" in words
    assert len([e for e in elements if e["type"] == "line"]) > 8


async def test_a_small_frame_gives_up_the_extras_for_a_bigger_dial() -> None:
    _, small = await drawn_state(with_value("40"), (96, 64))

    words = [e["value"] for e in small if e["type"] == "text"]
    assert "0" not in words
    assert "100" not in words
    radius = max(e["radius"] for e in small if e["type"] == "arc")
    assert radius >= 24


async def test_the_dial_never_reaches_further_than_the_frame_is_wide() -> None:
    _, elements = await drawn_state(with_value("40"), (200, 400))

    radius = max(e["radius"] for e in elements if e["type"] == "arc")
    x, _ = center_of(elements)
    assert hypot(radius, 0) <= x
    assert x + radius <= 200


async def test_nothing_chosen_says_so() -> None:
    _, elements = await drawn_state(STATES["missing-sources"])

    assert any(e["type"] == "text" for e in elements)
