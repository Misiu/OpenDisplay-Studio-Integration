"""
Every built-in widget, rendered from YAML fixtures at three sizes.

A fixture is one scenario: options, the picks per source, and what each pick's
provider would resolve to. The harness draws it through the real `odl-renderer`,
checks that nothing leaves the frame and compares the picture with a golden image.

Run with `UPDATE_GOLDEN=1` to write the golden images again, then look at the
diff of the PNG files before committing them.
"""

from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path
from typing import Any

import pytest
import yaml
from odl_renderer import generate_image  # type: ignore[import-untyped]
from PIL import Image, ImageChops

from custom_components.opendisplay_studio.odl import Box, DisplayContext, WidgetContext
from custom_components.opendisplay_studio.palette import accent_color_for_palette
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from custom_components.opendisplay_studio.widgets.options import option_defaults

HERE = Path(__file__).parent
FIXTURES = HERE / "fixtures"
GOLDEN = HERE / "golden"
LARGE_LIMIT = (800, 480)
DATETIME_KEYS = {"now", "start", "end", "datetime"}


def load_fixture(path: Path) -> dict[str, Any]:
    fixture: dict[str, Any] = yaml.safe_load(path.read_text(encoding="utf-8"))
    return _with_datetimes(fixture)


def _with_datetimes(value: Any) -> Any:
    """Turn the ISO timestamps a fixture holds into the datetimes providers return."""
    if isinstance(value, dict):
        return {
            key: datetime.fromisoformat(item)
            if key in DATETIME_KEYS and isinstance(item, str)
            else _with_datetimes(item)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [_with_datetimes(item) for item in value]
    return value


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


def context_for(
    widget_id: str, fixture: dict[str, Any], size: tuple[int, int], palette: str
) -> WidgetContext:
    width, height = size
    language = fixture["language"]
    return WidgetContext(
        instance_id="fixture",
        box=Box(0, 0, width, height),
        display=DisplayContext(
            width, height, palette, "white", accent_color_for_palette(palette)
        ),
        language=language,
        options={
            **_defaults(widget_id),
            **fixture["options"],
        },
        sources=fixture["sources"],
        data=fixture["data"],
        now=fixture["now"],
        strings=DEFAULT_REGISTRY.strings(widget_id, language),
    )


def _defaults(widget_id: str) -> dict[str, Any]:
    return option_defaults(DEFAULT_REGISTRY.definition(widget_id))


def cases() -> list[Any]:
    return [
        pytest.param(
            widget_dir.name,
            path,
            size_name,
            id=f"{widget_dir.name}-{path.stem}-{size_name}",
        )
        for widget_dir in sorted(FIXTURES.iterdir())
        for path in sorted(widget_dir.glob("*.yml"))
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


async def draw(
    widget_id: str, path: Path, size: tuple[int, int], palette: str
) -> tuple[Image.Image, list[dict[str, Any]]]:
    context = context_for(widget_id, load_fixture(path), size, palette)
    elements = DEFAULT_REGISTRY.renderer(widget_id)(context)
    image: Image.Image = await generate_image(
        size[0],
        size[1],
        elements,
        background="white",
        accent_color=context.display.accent_color,
    )
    return image.convert("RGB"), elements


@pytest.mark.parametrize(("widget_id", "path", "size_name"), cases())
async def test_widget_matches_its_golden_image(
    widget_id: str, path: Path, size_name: str
) -> None:
    size = sizes(widget_id)[size_name]

    image, elements = await draw(widget_id, path, size, "bw")

    assert anchors_inside(elements, size) == []
    golden = GOLDEN / widget_id / f"{path.stem}-{size_name}.png"
    if os.environ.get("UPDATE_GOLDEN"):
        golden.parent.mkdir(parents=True, exist_ok=True)
        image.save(golden)
    assert golden.is_file(), f"no golden image {golden.name}; run with UPDATE_GOLDEN=1"
    with Image.open(golden) as expected:
        difference = ImageChops.difference(image, expected.convert("RGB"))
    assert difference.getbbox() is None, f"{golden.name} differs from what is drawn"


@pytest.mark.parametrize(("widget_id", "path", "size_name"), cases())
async def test_widget_renders_in_a_six_colour_palette(
    widget_id: str, path: Path, size_name: str
) -> None:
    size = sizes(widget_id)[size_name]

    image, elements = await draw(widget_id, path, size, "spectra6")

    assert image.size == size
    assert anchors_inside(elements, size) == []


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
def test_every_widget_has_a_fixture_without_sources(widget_id: str) -> None:
    assert (FIXTURES / widget_id / "missing-sources.yml").is_file()


@pytest.mark.parametrize("widget_id", sorted(DEFAULT_REGISTRY.widget_types))
async def test_a_widget_without_sources_draws_something_readable(
    widget_id: str,
) -> None:
    path = FIXTURES / widget_id / "missing-sources.yml"

    _, elements = await draw(widget_id, path, sizes(widget_id)["default"], "bw")

    assert any(element["type"] == "text" for element in elements)
