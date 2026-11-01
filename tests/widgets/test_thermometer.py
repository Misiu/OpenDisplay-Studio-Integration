"""The thermometer draws a temperature on a classic round dial with a needle."""

from __future__ import annotations

from copy import deepcopy
from math import atan2, degrees
from typing import Any

import pytest
from PIL import Image

from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
)
from scripts.widget_devkit.scenario import context_for, draw, load_states, with_options

WIDGET = "thermometer"
STATES = load_states(BUILTIN_WIDGET_DIRECTORY / WIDGET)
SQUARE = (200, 200)


async def drawn_state(
    state: dict[str, Any], size: tuple[int, int] = SQUARE, palette: str = "spectra6"
) -> tuple[Image.Image, list[dict[str, Any]]]:
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, palette)
    return await draw(context, DEFAULT_REGISTRY.renderer(WIDGET))


def with_value(value: str, **options: Any) -> dict[str, Any]:
    state = with_options(deepcopy(STATES["outdoor"]), options)
    entity = state["data"]["entities"][0]
    entity["state"] = entity["display_state"] = value
    return state


def texts(elements: list[dict[str, Any]]) -> list[str]:
    return [e["value"] for e in elements if e["type"] == "text"]


def ring_of(elements: list[dict[str, Any]]) -> dict[str, Any]:
    return next(e for e in elements if e["type"] == "arc")


def needle_of(elements: list[dict[str, Any]]) -> dict[str, Any]:
    return next(e for e in elements if e["type"] == "polygon")


def needle_angle(elements: list[dict[str, Any]]) -> float:
    """The angle of the tip of the needle from the hub, clockwise from three o'clock."""
    ring = ring_of(elements)
    tip = max(
        needle_of(elements)["points"],
        key=lambda p: (p[0] - ring["x"]) ** 2 + (p[1] - ring["y"]) ** 2,
    )
    return degrees(atan2(tip[1] - ring["y"], tip[0] - ring["x"])) % 360


async def test_the_scale_opens_at_the_bottom() -> None:
    _, elements = await drawn_state(with_value("20"))

    ring = ring_of(elements)

    assert ring["start_angle"] == 150
    assert ring["end_angle"] == 30


@pytest.mark.parametrize(
    ("value", "angle"), [("-10", 150), ("15", 270), ("40", 30), ("27.5", 330)]
)
async def test_the_needle_points_at_the_temperature(value: str, angle: float) -> None:
    _, elements = await drawn_state(with_value(value))

    assert needle_angle(elements) == pytest.approx(angle, abs=2)


@pytest.mark.parametrize(("value", "angle"), [("-50", 150), ("90", 30)])
async def test_a_temperature_beyond_the_scale_stays_at_its_end(
    value: str, angle: float
) -> None:
    _, elements = await drawn_state(with_value(value))

    assert needle_angle(elements) == pytest.approx(angle, abs=2)


async def test_the_scale_is_numbered_every_step() -> None:
    _, elements = await drawn_state(with_value("20"))

    numbers = [w for w in texts(elements) if w.lstrip("-").isdigit()]

    assert numbers == ["-10", "0", "10", "20", "30", "40"]


async def test_the_numbers_follow_the_scale_and_the_step() -> None:
    state = with_value("50", min=20, max=100, majorStep=20)

    _, elements = await drawn_state(state)

    numbers = [w for w in texts(elements) if w.isdigit()]
    assert numbers == ["20", "40", "60", "80", "100"]


async def test_a_step_that_would_draw_thousands_of_ticks_is_made_coarser() -> None:
    state = with_value("5", min=0, max=1000, majorStep=0.01)

    _, elements = await drawn_state(state)

    assert len(elements) < 600


async def test_a_scale_with_no_length_does_not_fail() -> None:
    image, _ = await drawn_state(with_value("5", min=5, max=5))

    assert image.size == SQUARE


async def test_the_needle_has_the_color_that_was_picked() -> None:
    _, elements = await drawn_state(with_value("20", needleColor="blue"))

    assert needle_of(elements)["fill"] == "blue"


async def test_the_temperature_is_written_with_its_unit_and_the_name_under_it() -> None:
    _, elements = await drawn_state(with_value("21.4"))

    words = texts(elements)

    assert "21.4 °C" in words
    assert "Outdoor" in words
    value = next(e for e in elements if e.get("value") == "21.4 °C")
    name = next(e for e in elements if e.get("value") == "Outdoor")
    assert name["y"] > value["y"]


async def test_the_name_can_be_left_out() -> None:
    _, elements = await drawn_state(with_value("21.4", showName=False))

    assert "Outdoor" not in texts(elements)


async def test_the_numbers_of_the_scale_can_be_left_out() -> None:
    _, elements = await drawn_state(with_value("21.4", showLabels=False))

    assert "30" not in texts(elements)


async def test_a_small_frame_gives_up_the_numbers_for_a_bigger_dial() -> None:
    _, elements = await drawn_state(with_value("21.4"), (96, 96))

    assert "30" not in texts(elements)
    assert ring_of(elements)["radius"] >= 24


async def test_a_sensor_that_cannot_be_read_has_no_needle_and_says_why() -> None:
    _, elements = await drawn_state(STATES["unavailable"])

    assert "unavailable" in texts(elements)
    assert not [e for e in elements if e["type"] == "polygon"]


async def test_nothing_chosen_says_so() -> None:
    _, elements = await drawn_state(STATES["missing-sources"])

    assert any(e["type"] == "text" for e in elements)


@pytest.mark.parametrize("state_id", sorted(STATES))
@pytest.mark.parametrize(
    "size", [(96, 96), (120, 120), SQUARE, (296, 128), (160, 280), (800, 480), (24, 24)]
)
async def test_nothing_leaves_the_frame_at_any_size(
    state_id: str, size: tuple[int, int]
) -> None:
    image, elements = await drawn_state(STATES[state_id], size)

    assert image.size == size
    ring = [e for e in elements if e["type"] == "arc"]
    for element in ring:
        assert element["x"] - element["radius"] >= 0
        assert element["x"] + element["radius"] <= size[0]
        assert element["y"] - element["radius"] >= 0


def bands_of(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [e for e in elements if e["type"] == "arc" and e["width"] > 2]


async def test_a_dial_without_ranges_has_no_colored_band() -> None:
    _, elements = await drawn_state(with_value("20"))

    assert bands_of(elements) == []


async def test_ranges_put_a_band_of_color_along_the_edge_of_the_dial() -> None:
    ranges = [
        {"from": None, "color": "blue"},
        {"from": 0, "color": "green"},
        {"from": 30, "color": "red"},
    ]

    _, elements = await drawn_state(with_value("20", ranges=ranges))

    bands = bands_of(elements)
    assert [b["outline"] for b in bands] == ["blue", "green", "red"]
    assert bands[0]["start_angle"] == 150
    assert bands[1]["start_angle"] == pytest.approx(150 + 240 * 10 / 50, abs=1)
    assert bands[2]["end_angle"] == 30


async def test_the_scale_lies_inside_the_band() -> None:
    ranges = [{"from": None, "color": "blue"}]
    _, plain = await drawn_state(with_value("20"))
    _, banded = await drawn_state(with_value("20", ranges=ranges))

    band = bands_of(banded)[0]
    thin = next(e for e in banded if e["type"] == "arc" and e["width"] == 2)
    assert thin["radius"] < band["radius"] - band["width"] + 2
    assert ring_of(plain)["radius"] > thin["radius"]
