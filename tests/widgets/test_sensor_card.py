"""Sensor cards of one frame draw the same layout, whatever they show."""

from __future__ import annotations

from typing import Any

import pytest
from PIL import Image

from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from scripts.widget_devkit.scenario import context_for, draw

# The frame of the cards of the "Sensory" dashboard, in the palette it uses.
FRAME = (200, 300)
PALETTE = "grayscale16"
INK = (0, 0, 0)

ROOMS = (
    ("Salon", "24.1"),
    ("Biuro", "25.4"),
    ("Sypialnia", "23.8"),
)

# Frames of the three shapes a card has: a column, a square and a strip.
SHAPES = {"tall": (200, 300), "square": (220, 220), "wide": (360, 120)}


def card_state(name: str, value: str, **options: Any) -> dict[str, Any]:
    """A sensor card showing `value` under the label `name`."""
    entity = f"sensor.{name.lower()}"
    return {
        "language": "pl",
        "now": "2026-10-07T20:00:00+02:00",
        "options": {"showFrame": False, "decimals": "1", **options},
        "sources": {"entities": [{"id": entity, "label": name}]},
        "data": {
            "entities": [
                {
                    "id": entity,
                    "missing": False,
                    "name": name,
                    "state": value,
                    "display_state": value,
                    "unit": "°C",
                    "icon": "thermometer",
                    "device_class": "temperature",
                    "available": True,
                    "last_changed": "",
                }
            ]
        },
    }


async def draw_card(
    name: str, value: str, size: tuple[int, int] = FRAME, **options: Any
) -> tuple[Image.Image, list[dict[str, Any]]]:
    context = context_for(
        DEFAULT_REGISTRY,
        "sensor-card",
        card_state(name, value, **options),
        size,
        PALETTE,
    )
    return await draw(context, DEFAULT_REGISTRY.renderer("sensor-card"))


def skeleton(elements: list[dict[str, Any]]) -> list[tuple[Any, ...]]:
    """What must not depend on the words and digits: kinds, rows and sizes."""
    return [
        (
            element["type"],
            element.get("y", element.get("y_start")),
            element.get("y_end"),
            element.get("size"),
        )
        for element in elements
    ]


def rows_with_ink(image: Image.Image, column_range: range) -> list[int]:
    """The rows of the picture that have a dark pixel in the columns."""
    return [
        y
        for y in range(image.height)
        if any(image.getpixel((x, y)) == INK for x in column_range)
    ]


@pytest.mark.parametrize("shape", sorted(SHAPES))
async def test_cards_of_one_frame_have_the_same_layout(shape: str) -> None:
    drawn = [await draw_card(name, value, SHAPES[shape]) for name, value in ROOMS]

    layouts = [skeleton(elements) for _, elements in drawn]

    assert layouts[0] == layouts[1] == layouts[2]


async def test_the_lines_under_the_names_are_on_one_row() -> None:
    pictures = [(await draw_card(name, value))[0] for name, value in ROOMS]

    # The separator is the row with a long run of ink: the same row on every card.
    def separator_row(picture: Image.Image) -> int:
        long_run = [
            y
            for y in range(picture.height)
            if sum(picture.getpixel((x, y)) == INK for x in range(picture.width)) > 150
        ]
        assert len(long_run) == 1
        return long_run[0]

    rows = [separator_row(picture) for picture in pictures]
    assert rows[0] == rows[1] == rows[2]


async def test_every_card_puts_its_name_icon_and_value_on_the_same_rows() -> None:
    pictures = [(await draw_card(name, value))[0] for name, value in ROOMS]

    first_ink_rows = [
        rows_with_ink(picture, range(picture.width))[0] for picture in pictures
    ]
    last_ink_rows = [
        rows_with_ink(picture, range(picture.width))[-1] for picture in pictures
    ]

    # The icon starts on the same row, and the last ink is within a pixel of each other.
    assert first_ink_rows[0] == first_ink_rows[1] == first_ink_rows[2]
    assert abs(last_ink_rows[0] - last_ink_rows[1]) <= 1
    assert abs(last_ink_rows[1] - last_ink_rows[2]) <= 1


@pytest.mark.parametrize("shape", sorted(SHAPES))
async def test_the_digits_do_not_change_the_size_of_the_value(shape: str) -> None:
    sizes = set()
    for value in ("20.0", "11.1", "88.8", "10.7", "19.9"):
        _, elements = await draw_card("Salon", value, SHAPES[shape])
        sizes.add(max(element["size"] for element in elements if "size" in element))

    assert len(sizes) == 1


@pytest.mark.parametrize("shape", sorted(SHAPES))
async def test_a_longer_value_changes_only_the_value(shape: str) -> None:
    _, short = await draw_card("Salon", "9.9", SHAPES[shape])
    _, long = await draw_card("Salon", "-24.1", SHAPES[shape])

    def without_value(elements: list[dict[str, Any]]) -> list[tuple[Any, ...]]:
        biggest = max(element.get("size", 0) for element in elements)
        return [
            item
            for element, item in zip(elements, skeleton(elements), strict=True)
            if element.get("size") != biggest
        ]

    # The name, the icon and the separator stay exactly where they were.
    assert without_value(short) == without_value(long)


def lines_of(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """The separators: a line, or the one pixel wide rectangle a vertical divider is."""
    return [element for element in elements if element["type"] in ("line", "rectangle")]


@pytest.mark.parametrize("shape", sorted(SHAPES))
async def test_the_separator_lines_are_identical_on_every_card(shape: str) -> None:
    drawn = [await draw_card(name, value, SHAPES[shape]) for name, value in ROOMS]

    separators = [lines_of(elements) for _, elements in drawn]

    # Tall cards have a horizontal line under the name, wide ones a vertical line
    # beside the icon, and a square one has none; it is the same on all three cards.
    assert separators[0] == separators[1] == separators[2]
    assert len(separators[0]) == (0 if shape == "square" else 1)


@pytest.mark.parametrize("frame", [(150, 300), (200, 300), (240, 400), (180, 460)])
async def test_the_horizontal_line_of_a_tall_card_is_level_at_any_width(
    frame: tuple[int, int],
) -> None:
    drawn = [await draw_card(name, value, frame) for name, value in ROOMS]

    lines = [lines_of(elements) for _, elements in drawn]

    assert len(lines[0]) == 1
    assert lines[0] == lines[1] == lines[2]
    line = lines[0][0]
    assert line["y_start"] == line["y_end"]


@pytest.mark.parametrize("frame", [(300, 100), (360, 120), (420, 140)])
async def test_the_vertical_line_of_a_wide_card_is_upright_at_any_size(
    frame: tuple[int, int],
) -> None:
    drawn = [await draw_card(name, value, frame) for name, value in ROOMS]

    lines = [lines_of(elements) for _, elements in drawn]

    assert len(lines[0]) == 1
    assert lines[0] == lines[1] == lines[2]
    divider = lines[0][0]
    assert divider["x_start"] == divider["x_end"]


async def test_a_card_without_the_separator_has_no_line_and_keeps_its_rows() -> None:
    drawn = [
        await draw_card(name, value, FRAME, showSeparator=False)
        for name, value in ROOMS
    ]

    assert all(not lines_of(elements) for _, elements in drawn)
    layouts = [skeleton(elements) for _, elements in drawn]
    assert layouts[0] == layouts[1] == layouts[2]
