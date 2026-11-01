"""A dial puts a value at an angle and draws its parts where the renderer expects."""

from __future__ import annotations

import pytest
from odl_renderer import generate_image
from PIL import Image

from custom_components.opendisplay_studio.sdk import Dial, Stroke, dial

CENTER = (200, 150)
BLACK = (0, 0, 0)
INK = Stroke("black", 4)


def half_dial() -> Dial:
    return Dial(*CENTER, 100, 180, 180, 0, 100)


def open_dial() -> Dial:
    """A dial that opens at the bottom, like a thermometer: 240 degrees from 150."""
    return Dial(*CENTER, 100, 150, 240, -10, 40)


async def render(elements: list[dict[str, object]]) -> Image.Image:
    image = await generate_image(
        400, 300, elements, background="white", accent_color="red"
    )
    return image.convert("RGB")


@pytest.mark.parametrize(
    ("value", "angle"), [(0, 180), (25, 225), (50, 270), (100, 360)]
)
def test_a_value_has_an_angle_along_the_sweep(value: float, angle: float) -> None:
    assert half_dial().angle(value) == angle


def test_a_value_outside_the_scale_is_at_the_nearer_end() -> None:
    scale = half_dial()

    assert scale.angle(-50) == scale.start
    assert scale.angle(500) == scale.end


def test_the_lowest_and_the_highest_value_of_an_open_dial() -> None:
    scale = open_dial()

    assert scale.angle(-10) == 150
    assert scale.angle(40) == 390
    assert scale.angle(15) == 270


@pytest.mark.parametrize(
    ("angle", "expected"),
    [(0, (300, 150)), (90, (200, 250)), (180, (100, 150)), (270, (200, 50))],
)
def test_a_point_lies_at_a_distance_along_an_angle(
    angle: float, expected: tuple[int, int]
) -> None:
    assert half_dial().point(angle, 100) == expected


def test_a_place_is_a_point_at_the_angle_of_a_value() -> None:
    assert half_dial().place(50, 100) == (200, 50)


async def test_a_band_is_drawn_across_the_top_and_only_there() -> None:
    elements = dial.band(half_dial(), 180, 360, thickness=20, color="black")

    image = await render(elements)

    assert image.getpixel((200, 55)) == BLACK
    assert image.getpixel((105, 150)) == BLACK
    assert image.getpixel((200, 80)) == (255, 255, 255)
    assert image.getpixel((200, 200)) == (255, 255, 255)


async def test_a_band_between_two_angles_covers_only_that_part() -> None:
    scale = half_dial()
    elements = dial.band(
        scale, scale.angle(0), scale.angle(50), thickness=20, color="black"
    )

    image = await render(elements)

    assert image.getpixel((110, 130)) == BLACK
    assert image.getpixel((290, 130)) == (255, 255, 255)


async def test_an_open_dial_leaves_its_bottom_open() -> None:
    scale = open_dial()
    elements = dial.band(scale, scale.start, scale.end, thickness=10, color="black")

    image = await render(elements)

    assert image.getpixel((200, 55)) == BLACK
    assert image.getpixel((200, 245)) == (255, 255, 255)
    assert image.getpixel((105, 170)) == BLACK


def test_a_band_with_no_length_is_not_drawn() -> None:
    assert dial.band(half_dial(), 200, 200, thickness=10, color="black") == []


def test_a_band_that_ends_past_a_full_turn_ends_at_the_right_angle() -> None:
    [arc] = dial.band(open_dial(), 150, 390, thickness=10, color="black")

    assert arc["start_angle"] == 150
    assert arc["end_angle"] == 30


async def test_an_outline_band_is_empty_inside() -> None:
    elements = dial.outline_band(
        half_dial(), 180, 360, thickness=20, stroke=Stroke("black", 2)
    )

    image = await render(elements)

    assert image.getpixel((200, 51)) == BLACK
    assert image.getpixel((200, 69)) == BLACK
    assert image.getpixel((200, 60)) == (255, 255, 255)


async def test_a_pointer_crosses_the_scale_at_the_value() -> None:
    scale = half_dial()
    element = dial.pointer(scale, 50, inner=80, outer=105, stroke=INK)

    image = await render([element])

    assert image.getpixel((200, 60)) == BLACK
    assert image.getpixel((200, 140)) == (255, 255, 255)


async def test_ticks_are_drawn_one_for_each_value() -> None:
    scale = half_dial()
    marks = dial.ticks(scale, [0, 50, 100], inner=90, outer=100, stroke=INK)

    image = await render(marks)

    assert len(marks) == 3
    assert image.getpixel((200, 55)) == BLACK
    assert image.getpixel((95, 150)) == BLACK or image.getpixel((105, 150)) == BLACK


async def test_a_needle_points_from_the_center_to_the_value() -> None:
    scale = open_dial()
    needle = dial.needle(scale, 15, length=90, stroke=Stroke("black", 6))

    image = await render([needle])

    assert image.getpixel((200, 100)) == BLACK
    assert image.getpixel((200, 62)) == BLACK
    assert image.getpixel((200, 200)) == (255, 255, 255)


async def test_the_hub_is_a_disc_at_the_center() -> None:
    image = await render([dial.hub(half_dial(), 8, "black")])

    assert image.getpixel(CENTER) == BLACK
    assert image.getpixel((CENTER[0] + 14, CENTER[1])) == (255, 255, 255)
