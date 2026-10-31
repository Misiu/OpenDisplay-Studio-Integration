"""The battery widget: a battery that fills up, a low level in the highlight color."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

import pytest
from PIL import Image

from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
)
from scripts.widget_devkit.scenario import context_for, draw, load_states, with_options

WIDGET = "battery"
STATES = load_states(BUILTIN_WIDGET_DIRECTORY / "battery")
WIDE = (200, 100)
TALL = (100, 200)
RED = (255, 0, 0)
BLACK = (0, 0, 0)


async def drawn_state(
    state: dict[str, Any], size: tuple[int, int] = WIDE
) -> tuple[Image.Image, list[dict[str, Any]]]:
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, "bwr")
    return await draw(context, DEFAULT_REGISTRY.renderer(WIDGET))


async def drawn(
    state_id: str, size: tuple[int, int] = WIDE, **options: Any
) -> tuple[Image.Image, list[dict[str, Any]]]:
    return await drawn_state(with_options(STATES[state_id], options), size)


def with_level(level: str, **options: Any) -> dict[str, Any]:
    state = with_options(deepcopy(STATES["charged"]), options)
    state["data"]["entities"][0]["state"] = level
    return state


def captions(elements: list[dict[str, Any]]) -> list[str]:
    return [element["value"] for element in elements if element["type"] == "text"]


def has_red(image: Image.Image) -> bool:
    return any(pixel[:3] == RED for pixel in image.get_flattened_data())


def ink(image: Image.Image) -> int:
    return sum(1 for pixel in image.get_flattened_data() if pixel[:3] == BLACK)


def body_of(elements: list[dict[str, Any]]) -> tuple[int, int]:
    """The width and height of the biggest rectangle: the body of the battery."""
    rectangles = [element for element in elements if element["type"] == "rectangle"]
    sizes = [(r["x_end"] - r["x_start"], r["y_end"] - r["y_start"]) for r in rectangles]
    return max(sizes, key=lambda size: size[0] * size[1])


async def test_a_fuller_battery_has_more_ink() -> None:
    inks = []
    for level in ("10", "40", "70", "100"):
        image, _ = await drawn_state(with_level(level, lowLevel=0))
        inks.append(ink(image))

    assert inks == sorted(inks)
    assert len(set(inks)) == len(inks)


async def test_the_fill_is_in_proportion_to_the_charge() -> None:
    _, half = await drawn_state(with_level("50", lowLevel=0))
    _, full = await drawn_state(with_level("100", lowLevel=0))

    # The body is the same in both; the fill of half a battery is about half as long.
    half_painted = [e for e in half if e["type"] == "rectangle" and e.get("width") == 0]
    full_painted = [e for e in full if e["type"] == "rectangle" and e.get("width") == 0]
    half_fill = max(e["x_end"] - e["x_start"] for e in half_painted)
    full_fill = max(e["x_end"] - e["x_start"] for e in full_painted)
    assert half_fill == pytest.approx(full_fill / 2, abs=full_fill * 0.08)


async def test_the_caption_is_the_percentage() -> None:
    _, elements = await drawn("charged")

    assert captions(elements) == ["Front door", "87%"]


async def test_a_level_beyond_the_scale_is_held_to_it() -> None:
    _, over = await drawn_state(with_level("140"))
    _, under = await drawn_state(with_level("-5"))

    assert captions(over)[-1] == "100%"
    assert captions(under)[-1] == "0%"


@pytest.mark.parametrize(
    ("level", "low"), [("12", True), ("20", True), ("21", False), ("87", False)]
)
async def test_a_low_battery_is_drawn_in_the_highlight_color(
    level: str, *, low: bool
) -> None:
    image, _ = await drawn_state(with_level(level, lowLevel=20))

    assert has_red(image) is low


async def test_the_threshold_can_be_moved() -> None:
    image, _ = await drawn_state(with_level("40", lowLevel=50))

    assert has_red(image)


async def test_a_binary_sensor_says_low_or_ok() -> None:
    image_low, low = await drawn("binary-low")
    image_ok, ok = await drawn("binary-ok")

    assert captions(low)[-1] == "Low"
    assert captions(ok)[-1] == "OK"
    assert has_red(image_low)
    assert not has_red(image_ok)


async def test_a_battery_that_cannot_be_read_shows_dashes() -> None:
    image, elements = await drawn("unavailable")

    assert captions(elements)[-1] == "--"
    assert not has_red(image)


async def test_the_words_are_in_the_language_of_the_dashboard() -> None:
    state = deepcopy(STATES["binary-low"])
    state["language"] = "pl"
    _, elements = await drawn_state(state)

    assert captions(elements)[-1] == "Słaba"


async def test_no_entity_chosen_says_so() -> None:
    _, elements = await drawn("missing-sources")

    assert captions(elements) == ["Choose an entity"]


async def test_the_battery_lies_down_in_a_wide_frame_and_stands_up_in_a_tall_one() -> (
    None
):
    _, wide = await drawn("charged", WIDE, showFrame=False)
    _, tall = await drawn("charged", TALL, showFrame=False)

    wide_width, wide_height = body_of(wide)
    tall_width, tall_height = body_of(tall)
    assert wide_width > wide_height
    assert tall_height > tall_width


@pytest.mark.parametrize("orientation", ["horizontal", "vertical"])
async def test_the_orientation_can_be_chosen(orientation: str) -> None:
    _, elements = await drawn(
        "charged", (200, 200), orientation=orientation, showFrame=False
    )

    width, height = body_of(elements)
    assert (width > height) is (orientation == "horizontal")


async def test_the_percentage_and_the_name_can_be_left_out() -> None:
    _, elements = await drawn("charged", showName=False, showPercentage=False)

    assert captions(elements) == []


async def test_batteries_of_one_frame_have_the_same_layout() -> None:
    layouts = []
    for level in ("5", "47", "88", "100"):
        _, elements = await drawn_state(with_level(level, lowLevel=0))
        layouts.append(
            [
                (element["y"], element["size"])
                for element in elements
                if element["type"] == "text"
            ]
        )

    assert all(layout == layouts[0] for layout in layouts)


@pytest.mark.parametrize(
    "state_id", ["charged", "low", "half-polish", "binary-low", "empty", "unavailable"]
)
@pytest.mark.parametrize(
    "size", [(80, 48), WIDE, TALL, (296, 128), (400, 240), (800, 480), (60, 400)]
)
async def test_nothing_leaves_the_frame_at_any_size(
    state_id: str, size: tuple[int, int]
) -> None:
    image, elements = await drawn(state_id, size)

    assert image.size == size
    for element in elements:
        x, y = element.get("x"), element.get("y")
        if x is not None and y is not None:
            assert 0 <= x <= size[0]
            assert 0 <= y <= size[1]
        assert element.get("x_end", 0) <= size[0]
        assert element.get("y_end", 0) <= size[1]


def glyphs(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [element for element in elements if element["type"] == "text"]


async def inside(
    level: str, size: tuple[int, int] = WIDE, **options: Any
) -> list[dict]:
    state = with_level(level, lowLevel=0, percentagePlacement="inside", showName=False)
    state = with_options(state, options)
    _, elements = await drawn_state(state, size)
    return glyphs(elements)


async def test_the_percentage_can_be_drawn_inside_the_battery() -> None:
    _, elements = await drawn("charged", percentagePlacement="inside", showName=False)

    assert "".join(captions(elements)) == "87%"


async def test_inside_the_text_always_has_an_outline_of_the_background() -> None:
    for level in ("0", "30", "50", "87", "100"):
        (caption,) = await inside(level)

        assert caption["stroke_fill"] == "white"
        assert caption["stroke_width"] > 0


async def test_inside_the_outline_follows_the_background_that_was_picked() -> None:
    (caption,) = await inside("50", color="white", background="black")

    assert caption["color"] == "white"
    assert caption["stroke_fill"] == "black"


async def test_inside_a_low_battery_keeps_its_highlight_color() -> None:
    state = with_options(
        with_level("5", lowLevel=20),
        {"percentagePlacement": "inside", "showName": False},
    )
    _, elements = await drawn_state(state)

    (caption,) = glyphs(elements)
    assert caption["color"] == "accent"
    assert caption["stroke_fill"] == "white"


async def test_inside_the_size_of_the_text_does_not_depend_on_the_level() -> None:
    sizes = set()
    for level in ("5", "47", "88", "100"):
        sizes |= {g["size"] for g in await inside(level)}

    assert len(sizes) == 1
