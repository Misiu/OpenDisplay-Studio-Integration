"""A container moves what it holds: nesting must not change what is drawn."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

from PIL import ImageChops

from custom_components.opendisplay_studio.compiler import async_compile_dashboard
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import container, dashboard, text
from .test_measure import ink_box, render

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def square(item_id: str, x: int, y: int) -> dict[str, Any]:
    return {
        "id": item_id,
        "kind": "primitive",
        "primitive": {
            "type": "rectangle",
            "x_start": x,
            "y_start": y,
            "x_end": x + 39,
            "y_end": y + 39,
            "fill": "black",
        },
    }


async def compile_items(items: list[dict[str, Any]]) -> Any:
    validated = validate_dashboard(dashboard(items), DEFAULT_REGISTRY)
    return await async_compile_dashboard(
        cast("HomeAssistant", None), validated, DEFAULT_REGISTRY
    )


async def test_nested_items_render_where_the_same_flat_items_render() -> None:
    nested = await compile_items(
        [container("c", [square("a", 10, 20), square("b", 100, 60)], x=200, y=100)]
    )
    flat = await compile_items([square("a", 210, 120), square("b", 300, 160)])

    difference = ImageChops.difference(
        await render(nested.elements), await render(flat.elements)
    )
    assert difference.getbbox() is None


async def test_offsets_accumulate_through_every_container() -> None:
    compiled = await compile_items(
        [
            container(
                "outer",
                [container("inner", [square("a", 5, 6)], x=30, y=40)],
                x=100,
                y=200,
            )
        ]
    )

    assert compiled.item_bounds["inner"] == {
        "x": 130,
        "y": 240,
        "width": 200,
        "height": 120,
    }
    assert compiled.item_bounds["a"]["x"] == 135
    assert compiled.item_bounds["a"]["y"] == 246


async def test_a_background_is_drawn_behind_the_children() -> None:
    compiled = await compile_items(
        [
            container(
                "c",
                [square("a", 20, 20)],
                x=100,
                y=100,
                background={"fill": "black", "outline": "black", "width": 0},
            )
        ]
    )
    image = await render(compiled.elements)

    assert compiled.elements[0]["type"] == "rectangle"
    assert compiled.elements[0]["x_start"] == 100
    assert ink_box(image)[:2] == (100, 100)
    assert image.getpixel((110, 110)) == (0, 0, 0)


async def test_a_group_draws_nothing_of_its_own() -> None:
    compiled = await compile_items(
        [container("g", [square("a", 20, 20)], x=100, y=100, grouped=True)]
    )

    assert len(compiled.elements) == 1


async def test_a_hidden_container_hides_everything_inside_but_keeps_its_bounds() -> (
    None
):
    compiled = await compile_items(
        [
            container(
                "c", [square("a", 20, 20)], hidden=True, background={"fill": "black"}
            )
        ]
    )

    assert compiled.elements == []
    assert "a" in compiled.item_bounds
    assert compiled.item_bounds["a"]["x"] == 120


async def test_text_inside_a_container_is_measured_at_its_absolute_position() -> None:
    compiled = await compile_items([container("c", [text("t", x=10, y=20)])])

    assert compiled.item_bounds["t"]["x"] == 110
    assert compiled.item_bounds["t"]["y"] == 70
