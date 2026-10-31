"""Primitives can be turned; one that is not turned is drawn exactly as before."""

from __future__ import annotations

from base64 import b64encode
from copy import deepcopy
from io import BytesIO
from types import SimpleNamespace
from typing import TYPE_CHECKING, Any, cast

import pytest
from PIL import Image, ImageChops

from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.delivery import async_render_dashboard
from custom_components.opendisplay_studio.flatten import shift_primitive, without_turn
from custom_components.opendisplay_studio.pivots import (
    UNMEASURED_TYPES,
    async_find_pivots,
)
from custom_components.opendisplay_studio.primitives import DEFAULT_PRIMITIVES
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.validation import DashboardValidationError
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from tests.test_items import dashboard as dashboard_with
from tests.test_measure import HEIGHT, WIDTH, ink_box, render
from tests.test_primitive_types import DRAWN_TYPES

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

TURNABLE = sorted(DRAWN_TYPES)


# The drawings of the other tests sit near the corner; turned, the wide ones would leave
# the picture, which only draws what is in view. These are moved well inside it.
INSET = (250, 160)


def element(primitive_type: str, **fields: Any) -> dict[str, Any]:
    normalized = DEFAULT_PRIMITIVES.normalize(
        {"type": primitive_type, **DRAWN_TYPES[primitive_type], **fields}, WIDTH, HEIGHT
    )
    return shift_primitive(normalized, *INSET)


def centre(box: tuple[int, int, int, int]) -> tuple[float, float]:
    left, top, right, bottom = box
    return (left + right) / 2, (top + bottom) / 2


def size(box: tuple[int, int, int, int]) -> tuple[int, int]:
    return box[2] - box[0], box[3] - box[1]


def test_every_drawn_type_offers_a_rotation() -> None:
    types = {definition["type"] for definition in DEFAULT_PRIMITIVES.definitions}

    assert types - {"debug_grid"} == {
        definition["type"]
        for definition in DEFAULT_PRIMITIVES.definitions
        if any(field["key"] == "rotation" for field in definition["fields"])
    }


@pytest.mark.parametrize("primitive_type", TURNABLE)
def test_the_rotation_is_optional_and_in_degrees(primitive_type: str) -> None:
    field = DEFAULT_PRIMITIVES.field(primitive_type, "rotation")

    assert field["optional"] is True
    assert field["unit"] == "°"
    assert (field["min"], field["max"]) == (-360, 360)


@pytest.mark.parametrize("primitive_type", TURNABLE)
def test_a_primitive_without_a_rotation_does_not_send_one_to_the_renderer(
    primitive_type: str,
) -> None:
    assert "rotation" not in element(primitive_type)


@pytest.mark.parametrize("primitive_type", TURNABLE)
async def test_a_primitive_that_is_not_turned_is_drawn_as_before(
    primitive_type: str,
) -> None:
    before = dict(element(primitive_type))
    stored = DEFAULT_PRIMITIVES.normalize(
        {"type": primitive_type, **DRAWN_TYPES[primitive_type]}, WIDTH, HEIGHT
    )
    without_the_field = {
        key: value for key, value in stored.items() if key != "rotation"
    }
    reloaded = DEFAULT_PRIMITIVES.normalize(without_the_field, WIDTH, HEIGHT)

    first = await render([shift_primitive(stored, *INSET)])
    second = await render([shift_primitive(reloaded, *INSET)])

    assert ImageChops.difference(first, second).getbbox() is None
    assert shift_primitive(reloaded, *INSET) == before


@pytest.mark.parametrize("primitive_type", TURNABLE)
async def test_a_rotation_of_zero_changes_nothing(primitive_type: str) -> None:
    plain = await render([element(primitive_type)])
    zero = await render([element(primitive_type, rotation=0)])

    assert ImageChops.difference(plain, zero).getbbox() is None


@pytest.mark.parametrize("primitive_type", TURNABLE)
async def test_a_quarter_turn_swaps_the_sides_of_what_is_drawn(
    primitive_type: str,
) -> None:
    plain = ink_box(await render([element(primitive_type)]))
    turned = ink_box(await render([element(primitive_type, rotation=90)]))

    plain_width, plain_height = size(plain)
    turned_width, turned_height = size(turned)
    assert turned_width == pytest.approx(plain_height, abs=3)
    assert turned_height == pytest.approx(plain_width, abs=3)


@pytest.mark.parametrize("primitive_type", TURNABLE)
async def test_it_turns_about_the_middle_of_what_is_drawn(primitive_type: str) -> None:
    plain = ink_box(await render([element(primitive_type)]))
    turned = ink_box(await render([element(primitive_type, rotation=90)]))

    assert centre(turned)[0] == pytest.approx(centre(plain)[0], abs=2)
    assert centre(turned)[1] == pytest.approx(centre(plain)[1], abs=2)


async def test_turning_to_either_side_draws_something_different_about_one_middle() -> (
    None
):
    plain = ink_box(await render([element("text")]))
    clockwise = await render([element("text", rotation=30)])
    anticlockwise = await render([element("text", rotation=-30)])

    assert ImageChops.difference(clockwise, anticlockwise).getbbox() is not None
    for turned in (clockwise, anticlockwise):
        assert centre(ink_box(turned))[0] == pytest.approx(centre(plain)[0], abs=8)
        assert centre(ink_box(turned))[1] == pytest.approx(centre(plain)[1], abs=8)


def stored(primitive: dict[str, Any]) -> dict[str, Any]:
    item = {
        "id": "t",
        "kind": "primitive",
        "name": "text_1",
        "locked": False,
        "hidden": False,
        "primitive": primitive,
    }
    return validate_dashboard(dashboard_with([item]), DEFAULT_REGISTRY)["items"][0][
        "primitive"
    ]


def text_primitive(**fields: Any) -> dict[str, Any]:
    return {"type": "text", "value": "Hi", "x": 10, "y": 10, "size": 20, **fields}


def test_a_dashboard_saved_before_rotation_existed_loads_unchanged() -> None:
    primitive = stored(text_primitive())

    assert primitive["rotation"] is None


@pytest.mark.parametrize("rotation", [-360, -90, 0, 1, 45, 180, 360])
def test_a_rotation_in_range_is_kept(rotation: int) -> None:
    assert stored(text_primitive(rotation=rotation))["rotation"] == rotation


@pytest.mark.parametrize("rotation", [361, -361, 1000, "turn", True, [1]])
def test_a_rotation_that_makes_no_sense_is_refused(rotation: Any) -> None:
    with pytest.raises(DashboardValidationError, match="rotation"):
        stored(text_primitive(rotation=rotation))


def test_a_rotation_left_empty_is_the_same_as_none_at_all() -> None:
    assert stored(text_primitive(rotation=None))["rotation"] is None


def test_the_rotation_reaches_the_renderer_only_when_it_is_set() -> None:
    turned = DEFAULT_PRIMITIVES.normalize(text_primitive(rotation=15), WIDTH, HEIGHT)
    plain = deepcopy(turned)
    plain["rotation"] = None

    assert shift_primitive(turned, 5, 5)["rotation"] == 15
    assert "rotation" not in shift_primitive(plain, 5, 5)


def test_a_shifted_primitive_keeps_its_rotation() -> None:
    primitive = DEFAULT_PRIMITIVES.normalize(
        text_primitive(rotation=-20), WIDTH, HEIGHT
    )

    assert shift_primitive(primitive, 30, 40)["rotation"] == -20


RENDERER = OdlRenderService(cast("Any", None), concurrency=1)


async def pivot_of(element_with_turn: dict[str, Any]) -> dict[str, float]:
    turned = {"item": without_turn(element_with_turn)}
    pivots = await async_find_pivots(
        RENDERER,
        turned,
        width=WIDTH,
        height=HEIGHT,
        margin=0,
        accent_color="red",
    )
    return pivots["item"]


@pytest.mark.parametrize("primitive_type", sorted(set(TURNABLE) - UNMEASURED_TYPES))
async def test_the_frame_turns_about_the_point_the_picture_turns_about(
    primitive_type: str,
) -> None:
    upright = element(primitive_type)
    pivot = await pivot_of(upright)

    quarter = ink_box(await render([{**upright, "rotation": 90}]))
    half = ink_box(await render([{**upright, "rotation": 180}]))

    # A half turn about a point sends the drawing to the other side of it.
    plain = ink_box(await render([upright]))
    assert centre(half)[0] == pytest.approx(2 * pivot["x"] - centre(plain)[0], abs=2)
    assert centre(half)[1] == pytest.approx(2 * pivot["y"] - centre(plain)[1], abs=2)
    assert centre(quarter) == pytest.approx((pivot["x"], pivot["y"]), abs=2.5)


async def test_a_white_drawing_is_found_as_well_as_a_black_one() -> None:
    white_text = element("text", color="white")

    pivot = await pivot_of(white_text)

    plain = ink_box(await render([element("text", color="black")]))
    assert pivot["x"] == pytest.approx(centre(plain)[0], abs=1)
    assert pivot["y"] == pytest.approx(centre(plain)[1], abs=1)


async def test_nothing_is_reported_for_a_drawing_that_cannot_be_measured() -> None:
    pivots = await async_find_pivots(
        RENDERER,
        {"plot": {"type": "plot"}},
        width=WIDTH,
        height=HEIGHT,
        margin=0,
        accent_color="red",
    )

    assert pivots == {}


async def test_a_pivot_is_given_in_display_coordinates_whatever_the_margin() -> None:
    upright = without_turn(element("circle", rotation=10))
    kwargs = {"width": WIDTH, "height": HEIGHT, "accent_color": "red"}

    bare = await async_find_pivots(RENDERER, {"c": upright}, margin=0, **kwargs)
    framed = await async_find_pivots(RENDERER, {"c": upright}, margin=80, **kwargs)

    assert framed == bare


def one_text(**fields: Any) -> dict[str, Any]:
    item = {
        "id": "label",
        "kind": "primitive",
        "name": "text_1",
        "locked": False,
        "hidden": False,
        "primitive": text_primitive(x=200, y=150, size=40, **fields),
    }
    return validate_dashboard(dashboard_with([item]), DEFAULT_REGISTRY)


def use_services(hass: HomeAssistant) -> None:
    hass.data[DOMAIN] = SimpleNamespace(widgets=DEFAULT_REGISTRY, renderer=RENDERER)


async def test_the_preview_reports_what_a_turned_primitive_turns_about(
    hass: HomeAssistant,
) -> None:
    use_services(hass)

    turned = await async_render_dashboard(
        hass, one_text(rotation=30), for_device=False, with_margin=True
    )

    assert set(turned.item_pivots) == {"label"}
    box = turned.compiled.item_bounds["label"]
    assert turned.item_pivots["label"]["x"] == pytest.approx(
        box["x"] + box["width"] / 2, abs=12
    )


async def test_nothing_is_reported_for_a_dashboard_that_is_not_turned(
    hass: HomeAssistant,
) -> None:
    use_services(hass)

    plain = await async_render_dashboard(
        hass, one_text(), for_device=False, with_margin=True
    )

    assert plain.item_pivots == {}


async def test_what_a_display_receives_is_not_slowed_by_finding_pivots(
    hass: HomeAssistant,
) -> None:
    use_services(hass)

    delivered = await async_render_dashboard(
        hass, one_text(rotation=30), for_device=True
    )

    assert delivered.item_pivots == {}


def black_picture_url(width: int, height: int) -> str:
    buffer = BytesIO()
    Image.new("RGB", (width, height), "black").save(buffer, format="PNG")
    return "data:image/png;base64," + b64encode(buffer.getvalue()).decode()


async def test_an_image_turns_about_its_middle_like_the_rest() -> None:
    image = {
        "type": "dlimg",
        "url": black_picture_url(120, 40),
        "x": 300,
        "y": 200,
        "xsize": 120,
        "ysize": 40,
    }

    plain = ink_box(await render([image]))
    turned = ink_box(await render([{**image, "rotation": 90}]))

    assert size(turned) == (size(plain)[1], size(plain)[0])
    assert centre(turned) == pytest.approx(centre(plain), abs=1)
