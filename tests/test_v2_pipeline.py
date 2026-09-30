from __future__ import annotations

from io import BytesIO
from typing import TYPE_CHECKING, Any, cast

import pytest
from PIL import Image

from custom_components.opendisplay_studio.compiler import async_compile_dashboard
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.rendering import OdlRenderService
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def kitchen_temperature(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "sensor.kitchen_temperature",
        "21.4",
        {"friendly_name": "Kitchen temperature", "unit_of_measurement": "°C"},
    )


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
                    "type": "sensor-card",
                    "version": "1.0.0",
                    "sources": {"entities": [{"id": "sensor.kitchen_temperature"}]},
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


@pytest.mark.asyncio
async def test_native_odl_primitive_catalog_validates_and_renders(
    hass: HomeAssistant,
) -> None:
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
    compiled = await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)
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
async def test_compiler_and_local_renderer_produce_exact_size_png(
    hass: HomeAssistant,
) -> None:
    kitchen_temperature(hass)
    value = dashboard()
    value["items"][0]["layout"] = {"padding": 10}
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)
    assert compiled.item_bounds["temperature"] == {
        "x": 20,
        "y": 20,
        "width": 240,
        "height": 140,
    }
    assert any(element["type"] == "text" for element in compiled.elements)
    assert compiled.elements[0]["x_start"] == 30
    assert compiled.elements[0]["y_start"] == 30
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
async def test_hidden_layers_keep_bounds_but_do_not_render(
    hass: HomeAssistant,
) -> None:
    value = dashboard()
    value["items"][1]["hidden"] = True
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)
    assert compiled.item_bounds["label"]["x"] == 20
    assert "Home" not in compiled.yaml


@pytest.mark.asyncio
async def test_dashboard_item_order_is_render_layer_order(
    hass: HomeAssistant,
) -> None:
    value = dashboard()
    value["items"] = list(reversed(value["items"]))
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    compiled = await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)
    assert compiled.elements[0]["type"] == "text"
    assert compiled.elements[0]["value"] == "Home"
