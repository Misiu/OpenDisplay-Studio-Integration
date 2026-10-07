"""The appearance options every built-in widget offers: frame, colors and corners."""

from __future__ import annotations

from typing import Any

import pytest
from PIL import Image

from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from scripts.widget_devkit.scenario import context_for, draw, load_states, with_options
from tests.widgets.test_catalog import widget_folder

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)
SIZE = (400, 240)
CORNER = 4
STATE = "missing-sources"


async def _picture(widget_id: str, **options: Any) -> Image.Image:
    state = load_states(widget_folder(widget_id))[STATE]
    state = with_options(state, options)
    context = context_for(DEFAULT_REGISTRY, widget_id, state, SIZE, "bw")
    image, _ = await draw(context, DEFAULT_REGISTRY.renderer(widget_id))
    return image


def _edge_colors(image: Image.Image) -> set[tuple[int, int, int]]:
    """Return the colors along the four edges, leaving out the rounded corners."""
    width, height = image.size
    inner = range(CORNER, width - CORNER)
    side = range(CORNER, height - CORNER)
    edge = [(x, 0) for x in inner] + [(x, height - 1) for x in inner]
    edge += [(0, y) for y in side] + [(width - 1, y) for y in side]
    return {image.getpixel(point) for point in edge}


def _colors(image: Image.Image) -> set[tuple[int, int, int]]:
    return {color for _, color in image.getcolors(maxcolors=1 << 16)}


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_a_widget_is_black_on_white_inside_a_frame_by_default(
    widget_id: str,
) -> None:
    image = await _picture(widget_id)

    assert _edge_colors(image) == {BLACK}
    assert image.getpixel((SIZE[0] // 2, 4)) == WHITE


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_a_widget_without_a_frame_draws_nothing_at_its_edge(
    widget_id: str,
) -> None:
    image = await _picture(widget_id, showFrame=False)

    assert _edge_colors(image) == {WHITE}
    assert BLACK in _colors(image)


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_color_and_background_are_the_ones_picked(widget_id: str) -> None:
    image = await _picture(widget_id, color="yellow", background="red")

    assert image.getpixel((SIZE[0] // 2, 4)) == RED
    assert _edge_colors(image) == {YELLOW}


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_white_on_black_is_just_a_pair_of_colors(widget_id: str) -> None:
    image = await _picture(widget_id, color="white", background="black")

    assert image.getpixel((SIZE[0] // 2, 4)) == BLACK
    assert WHITE in _colors(image)


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_the_corner_radius_rounds_the_frame(widget_id: str) -> None:
    square = await _picture(widget_id, cornerRadius=0)
    round_ = await _picture(widget_id, cornerRadius=16)

    assert square.getpixel((0, 0)) == BLACK
    assert round_.getpixel((0, 0)) == WHITE
