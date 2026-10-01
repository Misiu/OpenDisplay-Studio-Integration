"""The editor's boxes must match what the ODL renderer actually draws."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

import pytest
from odl_renderer import generate_image  # type: ignore[import-untyped]
from PIL import Image, ImageChops

from custom_components.opendisplay_studio import measure
from custom_components.opendisplay_studio.compiler import async_compile_dashboard
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.measure import qr_modules
from custom_components.opendisplay_studio.odl import Box
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

WIDTH = 800
HEIGHT = 480


async def render(elements: list[dict[str, Any]]) -> Image.Image:
    image: Image.Image = await generate_image(
        WIDTH, HEIGHT, elements, background="white", accent_color="red"
    )
    return image.convert("RGB")


def primitive_box(primitive: dict[str, Any]) -> Box:
    return measure.primitive_box(primitive, (WIDTH, HEIGHT))


def ink_box(image: Image.Image) -> tuple[int, int, int, int]:
    """Left, top, right (exclusive) and bottom (exclusive) of everything drawn."""
    background = Image.new("RGB", image.size, "white")
    box = ImageChops.difference(image, background).getbbox()
    assert box is not None, "nothing was drawn"
    return box


@pytest.mark.parametrize("size", [12, 20, 32, 64])
@pytest.mark.parametrize("value", ["Hello", "Kitchen 21.4 °C", "Wide WWWW text"])
async def test_text_box_ends_where_the_ink_ends(size: int, value: str) -> None:
    primitive = {"type": "text", "value": value, "x": 30, "y": 20, "size": size}
    box = primitive_box(primitive)

    _, _, right, _ = ink_box(await render([{**primitive, "color": "black"}]))

    assert abs(right - (box.x + box.width)) <= 1


async def test_text_ink_stays_inside_its_box() -> None:
    primitive = {"type": "text", "value": "Quick fox", "x": 30, "y": 20, "size": 32}
    box = primitive_box(primitive)

    left, top, right, bottom = ink_box(await render([{**primitive, "color": "black"}]))

    assert box.x <= left
    assert box.y <= top
    assert right <= box.x + box.width + 1
    assert bottom <= box.y + box.height


@pytest.mark.parametrize("size", [12, 32, 64])
async def test_text_box_contains_descenders_and_capitals(size: int) -> None:
    primitive = {"type": "text", "value": "HgjpyQ", "x": 30, "y": 20, "size": size}
    box = primitive_box(primitive)

    _, top, _, bottom = ink_box(await render([{**primitive, "color": "black"}]))

    assert box.y <= top
    assert bottom <= box.y + box.height


async def test_text_box_grows_with_each_line() -> None:
    one = primitive_box({"type": "text", "value": "a", "x": 0, "y": 0, "size": 24})
    two = primitive_box({"type": "text", "value": "a\nb", "x": 0, "y": 0, "size": 24})

    assert two.height > one.height * 1.5


async def test_colour_markup_is_not_counted_as_text() -> None:
    plain = primitive_box({"type": "text", "value": "red", "x": 0, "y": 0, "size": 24})
    marked = primitive_box(
        {
            "type": "text",
            "value": "[red]red[/red]",
            "x": 0,
            "y": 0,
            "size": 24,
            "parse_colors": True,
        }
    )

    assert marked.width == plain.width


@pytest.mark.parametrize(
    "data", ["ODX", "https://example.org/a/longer/address", "x" * 120]
)
@pytest.mark.parametrize("boxsize", [1, 3, 5])
@pytest.mark.parametrize("border", [0, 1, 4])
async def test_qr_box_is_exactly_the_rendered_code(
    data: str, boxsize: int, border: int
) -> None:
    primitive = {
        "type": "qrcode",
        "data": data,
        "x": 25,
        "y": 15,
        "boxsize": boxsize,
        "border": border,
    }
    box = primitive_box(primitive)

    # A black quiet zone makes the whole code visible against the white canvas.
    left, top, right, bottom = ink_box(
        await render([{**primitive, "color": "white", "bgcolor": "black"}])
    )

    assert (left, top, right, bottom) == (box.x, box.y, box.right, box.bottom)


def test_a_longer_message_needs_a_bigger_code() -> None:
    assert qr_modules("ODX") == 21
    assert qr_modules("x" * 120) > qr_modules("ODX")


def test_the_qr_box_follows_module_size_and_quiet_zone() -> None:
    small = primitive_box(
        {"type": "qrcode", "data": "ODX", "x": 0, "y": 0, "boxsize": 2, "border": 0}
    )
    large = primitive_box(
        {"type": "qrcode", "data": "ODX", "x": 0, "y": 0, "boxsize": 4, "border": 2}
    )

    assert small.width == 21 * 2
    assert large.width == (21 + 4) * 4


@pytest.mark.parametrize(
    ("primitive", "expected"),
    [
        (
            {
                "type": "rectangle",
                "x_start": 10,
                "y_start": 20,
                "x_end": 19,
                "y_end": 39,
            },
            (10, 20, 10, 20),
        ),
        (
            {"type": "line", "x_start": 50, "y_start": 30, "x_end": 10, "y_end": 30},
            (10, 30, 41, 1),
        ),
        (
            {"type": "circle", "x": 50, "y": 50, "radius": 10},
            (40, 40, 21, 21),
        ),
        (
            {"type": "icon", "value": "home", "x": 5, "y": 6, "size": 24},
            (5, 6, 24, 24),
        ),
    ],
)
def test_shapes_keep_their_exact_pixel_box(
    primitive: dict[str, Any], expected: tuple[int, int, int, int]
) -> None:
    box = primitive_box(primitive)

    assert (box.x, box.y, box.width, box.height) == expected


async def test_compiled_dashboard_reports_the_boxes_that_are_drawn() -> None:
    dashboard = {
        "schemaVersion": 1,
        "name": "Measured",
        "status": "draft",
        "language": "en",
        "display": {
            "width": WIDTH,
            "height": HEIGHT,
            "palette": "bw",
            "background": "white",
            "padding": 0,
            "snapSize": 5,
        },
        "items": [
            {
                "id": "code",
                "kind": "primitive",
                "primitive": {
                    "type": "qrcode",
                    "data": "https://example.org/kitchen/thermostat",
                    "x": 300,
                    "y": 40,
                    "boxsize": 4,
                    "border": 2,
                    "color": "white",
                    "bgcolor": "black",
                },
            },
            {
                "id": "label",
                "kind": "primitive",
                "primitive": {
                    "type": "text",
                    "value": "Living room 21.5 °C",
                    "x": 20,
                    "y": 300,
                    "size": 40,
                    "color": "black",
                },
            },
        ],
    }
    validated = validate_dashboard(dashboard, DEFAULT_REGISTRY)

    compiled = await async_compile_dashboard(
        cast("HomeAssistant", None), validated, DEFAULT_REGISTRY
    )
    image = await render(compiled.elements)

    code = compiled.item_bounds["code"]
    label = compiled.item_bounds["label"]
    code_ink = ink_box(image.crop((280, 0, WIDTH, 280)))
    label_ink = ink_box(image.crop((0, 280, WIDTH, HEIGHT)))
    assert code_ink[2] + 280 == code["x"] + code["width"]
    assert code_ink[3] == code["y"] + code["height"]
    assert abs(label_ink[2] - (label["x"] + label["width"])) <= 1
    assert label["y"] <= label_ink[1] + 280
    assert label_ink[3] + 280 <= label["y"] + label["height"]
