"""The waste collection widget: dates in words, highlights and an even layout."""

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

WIDGET = "waste-collection"
STATES = load_states(BUILTIN_WIDGET_DIRECTORY / "waste_collection")
TAG = (296, 128)
PALETTE = "bwr"
RED = (255, 0, 0)
YELLOW = (255, 255, 0)
WHITE = (255, 255, 255)


async def drawn(
    state_id: str,
    size: tuple[int, int] = TAG,
    palette: str = PALETTE,
    **options: Any,
) -> tuple[Image.Image, list[dict[str, Any]]]:
    state = with_options(STATES[state_id], options)
    return await drawn_state(state, size, palette)


async def drawn_state(
    state: dict[str, Any], size: tuple[int, int] = TAG, palette: str = PALETTE
) -> tuple[Image.Image, list[dict[str, Any]]]:
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, palette)
    return await draw(context, DEFAULT_REGISTRY.renderer(WIDGET))


def text_elements(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [element for element in elements if element["type"] == "text"]


def texts(elements: list[dict[str, Any]]) -> list[str]:
    return [element["value"] for element in text_elements(elements)]


def icons(elements: list[dict[str, Any]]) -> list[str]:
    return [element["value"] for element in elements if element["type"] == "icon"]


def pixel(image: Image.Image, x: int, y: int) -> tuple[int, int, int]:
    return image.getpixel((x, y))[:3]


async def test_the_dates_are_in_the_language_of_the_dashboard() -> None:
    _, polish = await drawn("four-bins")
    _, english = await drawn("due-soon")
    _, german = await drawn("two-bins")

    assert texts(polish) == [
        "Zmieszane",
        "za 3 dni",
        "Plastik",
        "za 24 dni",
        "Szkło",
        "za 19 dni",
        "Papier",
        "--",
    ]
    assert "Today" in texts(english)
    assert "in 5 days" in texts(english)
    assert "in 4 Tagen" in texts(german)


async def test_a_bin_due_tomorrow_says_tomorrow_and_one_under_way_says_today() -> None:
    state = deepcopy(STATES["one-bin"])
    state["data"]["bins"][0]["start"] = "2026-11-01T00:00:00+01:00"
    _, tomorrow = await drawn_state(state)

    state["data"]["bins"][0]["start"] = "2026-10-29T00:00:00+01:00"
    _, today = await drawn_state(state)

    assert "Tomorrow" in texts(tomorrow)
    assert "Today" in texts(today)


@pytest.mark.parametrize(
    ("highlight_days", "highlighted"),
    [
        (0, [True, False, False, False]),
        (2, [True, True, False, False]),
        (5, [True, True, True, False]),
        (30, [True] * 4),
    ],
)
async def test_a_bin_is_highlighted_that_many_days_before(
    highlight_days: int, highlighted: list[bool]
) -> None:
    image, _ = await drawn("due-soon", (400, 240), highlightDays=highlight_days)

    # A point in each cell: General (today), Recycling (in 2), Garden (in 5) and Glass.
    corners = [(12, 12), (388, 12), (12, 228), (388, 228)]
    filled = [pixel(image, x, y) != WHITE for x, y in corners]
    assert filled == highlighted


async def test_a_bin_can_have_a_highlight_color_of_its_own() -> None:
    state = deepcopy(STATES["due-soon"])
    state["options"]["highlightDays"] = 30
    image, _ = await drawn_state(state, (400, 240), "bwry")

    # Recycling asks for yellow, the others use the widget's accent.
    assert pixel(image, 388, 12) == YELLOW
    assert pixel(image, 12, 12) == RED


async def test_text_on_a_highlight_is_the_color_of_the_background() -> None:
    _, plain = await drawn("due-soon", highlightDays=0)
    _, everything = await drawn("due-soon", highlightDays=30)

    assert {element["color"] for element in text_elements(everything)} == {"white"}
    assert "black" in {element["color"] for element in text_elements(plain)}


async def test_a_bin_without_a_date_shows_dashes_and_is_never_highlighted() -> None:
    image, elements = await drawn("four-bins", highlightDays=30)

    assert "--" in texts(elements)
    # Papier has no date, so its cell stays plain however long the threshold is.
    assert pixel(image, 280, 115) == WHITE


async def test_a_calendar_that_cannot_be_read_does_not_break_the_rest() -> None:
    _, elements = await drawn("calendar-gone")

    assert texts(elements)[:2] == ["General", "in 6 days"]
    assert texts(elements)[-1] == "--"


async def test_no_calendar_chosen_says_so() -> None:
    _, elements = await drawn("missing-sources")

    assert texts(elements) == ["Choose calendars"]


@pytest.mark.parametrize(
    ("state_id", "size", "columns", "rows"),
    [
        ("one-bin", TAG, 1, 1),
        ("two-bins", (400, 240), 2, 1),
        ("two-bins", (200, 400), 1, 2),
        ("three-bins", (800, 240), 3, 1),
        ("three-bins", (200, 400), 1, 3),
        ("three-bins", (400, 400), 2, 2),
        ("due-soon", TAG, 2, 2),
        ("due-soon", (1000, 200), 4, 1),
        ("due-soon", (150, 600), 1, 4),
    ],
)
async def test_the_cells_follow_the_shape_of_the_frame(
    state_id: str, size: tuple[int, int], columns: int, rows: int
) -> None:
    _, elements = await drawn(state_id, size)

    names = text_elements(elements)[::2]
    first_row = [element for element in names if element["y"] == names[0]["y"]]
    assert len(first_row) == columns
    assert len({element["y"] for element in names}) == rows


async def test_every_cell_has_the_same_rows_and_sizes() -> None:
    _, elements = await drawn("four-bins")

    lines = text_elements(elements)
    names, dates = lines[0::2], lines[1::2]
    assert len({element["size"] for element in names}) == 1
    assert len({element["size"] for element in dates}) == 1
    # The two cells of a row have their names and their dates on the same rows.
    assert names[0]["y"] == names[1]["y"]
    assert dates[0]["y"] == dates[1]["y"]
    assert names[2]["y"] == names[3]["y"]
    assert dates[2]["y"] == dates[3]["y"]


async def test_the_layout_does_not_depend_on_how_soon_a_bin_is_due() -> None:
    _, soon = await drawn("due-soon")
    state = deepcopy(STATES["due-soon"])
    for item in state["data"]["bins"]:
        item["start"] = "2026-12-24T00:00:00+01:00"
    _, later = await drawn_state(state)

    def rows(elements: list[dict[str, Any]]) -> list[tuple[Any, Any]]:
        return [(element["y"], element["size"]) for element in text_elements(elements)]

    assert rows(soon) == rows(later)


async def test_the_bin_in_the_middle_appears_only_where_four_cells_meet() -> None:
    _, four = await drawn("due-soon", TAG)
    _, row = await drawn("due-soon", (1000, 200))
    _, hidden = await drawn("due-soon", TAG, showIcon=False)

    assert icons(four) == ["circle", "trash-can"]
    assert icons(row) == []
    assert icons(hidden) == []


async def test_dividers_can_be_turned_off() -> None:
    with_lines, _ = await drawn("four-bins", highlightDays=0)
    without, _ = await drawn(
        "four-bins", highlightDays=0, showDividers=False, showIcon=False
    )

    # The middle of the picture is red where the cross is, and white without it.
    assert pixel(with_lines, 148, 20) == RED
    assert pixel(without, 148, 20) == WHITE


@pytest.mark.parametrize(
    "state_id", ["four-bins", "due-soon", "three-bins", "two-bins", "one-bin"]
)
@pytest.mark.parametrize("size", [(160, 96), TAG, (400, 240), (800, 480), (150, 600)])
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
