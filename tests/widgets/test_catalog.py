"""
Every built-in widget, rendered from its `states.yml` at three sizes.

A state is one scenario: options, the picks per source, and what each pick's
provider would resolve to. The harness draws it through the real `odl-renderer`,
checks that nothing leaves the frame and compares the picture with a golden image.

Run with `UPDATE_GOLDEN=1` to write the golden images again, then look at the
diff of the PNG files before committing them.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import pytest
from PIL import Image, ImageChops

from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
)
from scripts.widget_devkit.scenario import context_for, draw, load_states

HERE = Path(__file__).parent
GOLDEN = HERE / "golden"
LARGE_LIMIT = (800, 480)


def sizes(widget_id: str) -> dict[str, tuple[int, int]]:
    layout = DEFAULT_REGISTRY.definition(widget_id)["layout"]
    default = layout["defaultSize"]
    return {
        "min": (layout["minSize"]["width"], layout["minSize"]["height"]),
        "default": (default["width"], default["height"]),
        "large": (
            min(default["width"] * 2, LARGE_LIMIT[0]),
            min(default["height"] * 2, LARGE_LIMIT[1]),
        ),
    }


def widget_folder(widget_id: str) -> Path:
    return BUILTIN_WIDGET_DIRECTORY / widget_id.replace("-", "_")


def cases() -> list[Any]:
    return [
        pytest.param(
            widget_id, state_id, size_name, id=f"{widget_id}-{state_id}-{size_name}"
        )
        for widget_id in sorted(DEFAULT_REGISTRY.widget_types)
        for state_id in load_states(widget_folder(widget_id))
        for size_name in ("min", "default", "large")
    ]


def anchors_inside(elements: list[dict[str, Any]], size: tuple[int, int]) -> list[str]:
    """Name every element whose anchor lies outside the frame."""
    width, height = size
    outside = []
    for element in elements:
        x = element.get("x", element.get("x_start"))
        y = element.get("y", element.get("y_start"))
        if x is None or y is None:
            continue
        if not (0 <= x <= width and 0 <= y <= height):
            outside.append(f"{element['type']} at {x},{y}")
    return outside


async def draw_state(
    widget_id: str, state_id: str, size: tuple[int, int], palette: str
) -> tuple[Image.Image, list[dict[str, Any]]]:
    state = load_states(widget_folder(widget_id))[state_id]
    context = context_for(DEFAULT_REGISTRY, widget_id, state, size, palette)
    return await draw(context, DEFAULT_REGISTRY.renderer(widget_id))


@pytest.mark.parametrize(("widget_id", "state_id", "size_name"), cases())
async def test_widget_matches_its_golden_image(
    widget_id: str, state_id: str, size_name: str
) -> None:
    size = sizes(widget_id)[size_name]

    image, elements = await draw_state(widget_id, state_id, size, "bw")

    assert anchors_inside(elements, size) == []
    golden = GOLDEN / widget_id / f"{state_id}-{size_name}.png"
    if os.environ.get("UPDATE_GOLDEN"):
        golden.parent.mkdir(parents=True, exist_ok=True)
        image.save(golden)
    assert golden.is_file(), f"no golden image {golden.name}; run with UPDATE_GOLDEN=1"
    with Image.open(golden) as expected:
        difference = ImageChops.difference(image, expected.convert("RGB"))
    assert difference.getbbox() is None, f"{golden.name} differs from what is drawn"


@pytest.mark.parametrize(("widget_id", "state_id", "size_name"), cases())
async def test_widget_renders_in_a_six_colour_palette(
    widget_id: str, state_id: str, size_name: str
) -> None:
    size = sizes(widget_id)[size_name]

    image, elements = await draw_state(widget_id, state_id, size, "spectra6")

    assert image.size == size
    assert anchors_inside(elements, size) == []


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
def test_every_widget_has_a_state_without_sources(widget_id: str) -> None:
    assert "missing-sources" in load_states(widget_folder(widget_id))


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_a_widget_without_sources_draws_something_readable(
    widget_id: str,
) -> None:
    size = sizes(widget_id)["default"]

    _, elements = await draw_state(widget_id, "missing-sources", size, "bw")

    assert any(element["type"] == "text" for element in elements)
