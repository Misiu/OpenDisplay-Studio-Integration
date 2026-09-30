from __future__ import annotations

from io import BytesIO
from typing import Any, ClassVar, cast

import pytest
from PIL import Image

from custom_components.opendisplay_studio.compiler import async_compile_dashboard
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.odl import (
    Box,
    DisplayContext,
    WidgetRenderContext,
)
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from custom_components.opendisplay_studio.widgets.temperature.renderer import (
    render_temperature,
)


class FakeStates:
    def __init__(self, values: dict[str, Any]) -> None:
        self.values = values

    def get(self, entity_id: str) -> Any:
        return self.values.get(entity_id)


class FakeState:
    state = "21.4"
    attributes: ClassVar[dict[str, str]] = {
        "friendly_name": "Kitchen temperature",
        "unit_of_measurement": "°C",
    }


class FakeHass:
    states = FakeStates({"sensor.kitchen_temperature": FakeState()})


def dashboard() -> dict[str, Any]:
    return {
        "schemaVersion": 1,
        "name": "Kitchen",
        "status": "ready",
        "language": "en",
        "display": {
            "profileId": None,
            "width": 800,
            "height": 480,
            "palette": "bwr",
            "background": "white",
            "padding": 0,
            "snapSize": 5,
        },
        "items": [
            {
                "id": "temperature",
                "kind": "widget",
                "locked": False,
                "hidden": False,
                "widget": {
                    "type": "temperature",
                    "version": "1.0.0",
                    "config": {
                        "entity": "sensor.kitchen_temperature",
                        "title": "Kitchen",
                    },
                },
                "frame": {"x": 20, "y": 20, "width": 240, "height": 140},
            },
            {
                "id": "label",
                "kind": "primitive",
                "locked": False,
                "hidden": False,
                "primitive": {
                    "type": "text",
                    "value": "Home",
                    "x": 20,
                    "y": 430,
                    "size": 24,
                    "color": "black",
                },
            },
        ],
    }


def test_dashboard_accepts_freeform_widgets_and_raw_primitives() -> None:
    validated = validate_dashboard(dashboard(), DEFAULT_REGISTRY)
    assert validated["schemaVersion"] == 1
    assert [item["kind"] for item in validated["items"]] == [
        "widget",
        "primitive",
    ]
    assert validated["items"][0]["layout"] == {"padding": 0}


def test_dashboard_accepts_the_complete_spectra6_palette() -> None:
    value = dashboard()
    value["display"]["palette"] = "spectra6"
    value["items"][1]["primitive"]["color"] = "blue"
    value["items"].append(
        {
            "id": "green-circle",
            "kind": "primitive",
            "locked": False,
            "hidden": False,
            "primitive": {
                "type": "circle",
                "x": 400,
                "y": 240,
                "radius": 30,
                "fill": "green",
                "outline": "green",
                "width": 1,
            },
        }
    )

    validated = validate_dashboard(value, DEFAULT_REGISTRY)

    assert validated["display"]["palette"] == "spectra6"
    assert validated["items"][1]["primitive"]["color"] == "blue"
    assert validated["items"][2]["primitive"]["fill"] == "green"


def test_temperature_tile_keeps_title_icon_value_and_unit_aligned() -> None:
    context = WidgetRenderContext(
        instance_id="temperature",
        box=Box(11, 11, 224, 143),
        display=DisplayContext(800, 480, "bwr", "white", "red"),
        language="en",
        config={
            "title": "Living room",
            "showIcon": True,
            "showName": True,
            "showUnit": True,
            "accent": "black",
        },
        data={"entity": {"state": "22.4", "unit": "°C", "name": "Living room"}},
    )
    elements = render_temperature(context)
    icon = next(element for element in elements if element["type"] == "icon")
    labels = [element for element in elements if element["type"] == "text"]
    title, reading = labels

    assert title["x"] == context.box.x + context.box.width // 2
    assert reading["value"] == "22.4 °C"
    assert reading["y"] == icon["y"]
    assert reading["anchor"] == icon["anchor"] == "mm"
    assert "max_width" not in reading


@pytest.mark.asyncio
async def test_native_odl_primitive_catalog_validates_and_renders() -> None:
    value = dashboard()
    value["items"] = [
        {
            "id": "line",
            "kind": "primitive",
            "primitive": {
                "type": "line",
                "x_start": 20,
                "y_start": 30,
                "x_end": 180,
                "y_end": 80,
                "fill": "black",
                "width": 2,
                "dashed": False,
            },
        },
        {
            "id": "circle",
            "kind": "primitive",
            "primitive": {
                "type": "circle",
                "x": 250,
                "y": 70,
                "radius": 36,
                "fill": None,
                "outline": "black",
                "width": 2,
            },
        },
        {
            "id": "ellipse",
            "kind": "primitive",
            "primitive": {
                "type": "ellipse",
                "x_start": 320,
                "y_start": 30,
                "x_end": 460,
                "y_end": 100,
                "fill": None,
                "outline": "black",
                "width": 2,
            },
        },
        {
            "id": "icon",
            "kind": "primitive",
            "primitive": {
                "type": "icon",
                "value": "star-outline",
                "x": 500,
                "y": 30,
                "size": 48,
                "color": "black",
            },
        },
        {
            "id": "qrcode",
            "kind": "primitive",
            "primitive": {
                "type": "qrcode",
                "data": "ODX",
                "x": 580,
                "y": 20,
                "boxsize": 3,
                "border": 1,
                "color": "black",
                "bgcolor": "white",
            },
        },
        {
            "id": "progress",
            "kind": "primitive",
            "primitive": {
                "type": "progress_bar",
                "x_start": 20,
                "y_start": 150,
                "x_end": 300,
                "y_end": 185,
                "progress": 65,
                "direction": "right",
                "background": "white",
                "fill": "accent",
                "outline": "black",
                "width": 1,
                "show_percentage": True,
            },
        },
    ]
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(
        cast("Any", FakeHass()), validated, DEFAULT_REGISTRY
    )
    assert {element["type"] for element in compiled.elements} == {
        "line",
        "circle",
        "ellipse",
        "icon",
        "qrcode",
        "progress_bar",
    }
    rendered = await OdlRenderService(cast("Any", None), concurrency=1).async_render(
        width=800,
        height=480,
        elements=compiled.elements,
        background="white",
        accent_color="red",
    )
    with Image.open(BytesIO(rendered.png)) as image:
        assert image.size == (800, 480)


def test_dashboard_accepts_overlapping_semantic_widgets() -> None:
    value = dashboard()
    duplicate = dict(value["items"][0])
    duplicate["id"] = "overlap"
    value["items"].append(duplicate)
    duplicate["frame"] = {"x": 30, "y": 30, "width": 240, "height": 140}
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    assert [item["id"] for item in validated["items"][:2]] == ["temperature", "label"]
    assert validated["items"][-1]["frame"]["x"] == 30


@pytest.mark.asyncio
async def test_compiler_and_local_renderer_produce_exact_size_png() -> None:
    value = dashboard()
    value["items"][0]["layout"] = {"padding": 10}
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(
        cast("Any", FakeHass()), validated, DEFAULT_REGISTRY
    )
    assert compiled.item_bounds["temperature"] == {
        "x": 20,
        "y": 20,
        "width": 240,
        "height": 140,
    }
    assert any(element["type"] == "text" for element in compiled.elements)
    assert compiled.elements[0]["x_start"] == 33
    assert compiled.elements[0]["y_start"] == 33
    assert "21.4 °C" in compiled.yaml

    renderer = OdlRenderService(cast("Any", None), concurrency=1)
    rendered = await renderer.async_render(
        width=800,
        height=480,
        elements=compiled.elements,
        background="white",
        accent_color="red",
    )
    with Image.open(BytesIO(rendered.png)) as image:
        assert image.size == (800, 480)
    assert rendered.timings["total"] >= rendered.timings["render"]


@pytest.mark.asyncio
async def test_hidden_layers_keep_bounds_but_do_not_render() -> None:
    value = dashboard()
    value["items"][1]["hidden"] = True
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(
        cast("Any", FakeHass()), validated, DEFAULT_REGISTRY
    )
    assert compiled.item_bounds["label"]["x"] == 20
    assert "Home" not in compiled.yaml


@pytest.mark.asyncio
async def test_dashboard_item_order_is_render_layer_order() -> None:
    value = dashboard()
    value["items"] = list(reversed(value["items"]))
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(
        cast("Any", FakeHass()), validated, DEFAULT_REGISTRY
    )
    assert compiled.elements[0]["type"] == "text"
    assert compiled.elements[0]["value"] == "Home"
