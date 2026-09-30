"""Templates beside an item's literals are resolved with Home Assistant's engine."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import yaml  # type: ignore[import-untyped]
from homeassistant.helpers.template import Template

from custom_components.opendisplay_studio.compiler import (
    CompiledDashboard,
    async_compile_dashboard,
)
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import container, dashboard, text

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def expressed(item: dict[str, Any], **expressions: str) -> dict[str, Any]:
    return {**item, "expressions": expressions}


async def compile_items(
    hass: HomeAssistant, items: list[dict[str, Any]]
) -> CompiledDashboard:
    validated = validate_dashboard(dashboard(items), DEFAULT_REGISTRY)
    return await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)


async def test_a_text_shows_the_state_of_an_entity(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.t", "21.5")

    compiled = await compile_items(
        hass, [expressed(text(), value="{{ states('sensor.t') }}")]
    )

    assert compiled.elements[0]["value"] == "21.5"
    assert compiled.warnings == []


async def test_the_literal_is_kept_when_there_is_no_template(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_items(hass, [text(value="Hello")])

    assert compiled.elements[0]["value"] == "Hello"


async def test_a_number_from_a_template_is_rounded_to_a_pixel(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("sensor.x", "40.6")

    compiled = await compile_items(
        hass, [expressed(text(), x="{{ states('sensor.x') | float }}")]
    )

    assert compiled.elements[0]["x"] == 41


async def test_an_expression_inside_a_container_is_relative_to_it(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_items(
        hass, [container("c", [expressed(text(), x="{{ 15 }}")], x=100, y=50)]
    )

    assert compiled.elements[0]["x"] == 115
    assert compiled.item_bounds["t"]["x"] == 115


async def test_a_broken_template_names_the_item_and_field_and_draws_nothing(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_items(hass, [expressed(text(), value="{{ 1 / 0 }}")])

    assert compiled.elements == []
    assert len(compiled.warnings) == 1
    assert compiled.warnings[0].startswith("text_1.value: ")


async def test_a_result_of_the_wrong_type_is_a_warning_not_a_guess(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("sensor.t", "unavailable")

    compiled = await compile_items(
        hass, [expressed(text(), size="{{ states('sensor.t') }}")]
    )

    assert compiled.elements == []
    assert compiled.warnings[0].startswith("text_1.size: ")
    assert "unavailable" in compiled.warnings[0]


async def test_a_color_outside_the_palette_is_rejected(hass: HomeAssistant) -> None:
    compiled = await compile_items(hass, [expressed(text(), color="{{ 'pink' }}")])

    assert compiled.elements == []
    assert compiled.warnings[0].startswith("text_1.color: ")


async def test_fields_that_are_fine_alone_but_draw_nothing_together_are_reported(
    hass: HomeAssistant,
) -> None:
    box = {
        "id": "b",
        "kind": "primitive",
        "primitive": {
            "type": "rectangle",
            "x_start": 10,
            "y_start": 10,
            "x_end": 90,
            "y_end": 90,
        },
    }

    compiled = await compile_items(hass, [expressed(box, x_end="{{ 5 }}")])

    assert compiled.elements == []
    assert compiled.warnings[0].startswith("rectangle_1.geometry: ")


async def test_one_broken_item_does_not_stop_the_others(hass: HomeAssistant) -> None:
    compiled = await compile_items(
        hass,
        [expressed(text("a"), value="{{ 1 / 0 }}"), text("b", value="Fine")],
    )

    assert [element["value"] for element in compiled.elements] == ["Fine"]


async def test_visible_hides_an_item_when_it_is_false(hass: HomeAssistant) -> None:
    hass.states.async_set("light.a", "off")

    compiled = await compile_items(
        hass, [expressed(text(), visible="{{ is_state('light.a', 'on') }}")]
    )
    hass.states.async_set("light.a", "on")
    shown = await compile_items(
        hass, [expressed(text(), visible="{{ is_state('light.a', 'on') }}")]
    )

    assert compiled.elements == []
    assert compiled.warnings == []
    assert len(shown.elements) == 1
    assert "t" in compiled.item_bounds


async def test_a_hidden_container_hides_its_subtree_without_resolving_it(
    hass: HomeAssistant,
) -> None:
    broken = expressed(text(), value="{{ 1 / 0 }}")

    compiled = await compile_items(
        hass, [expressed(container("c", [broken]), visible="{{ false }}")]
    )

    assert compiled.elements == []
    assert compiled.warnings == []


async def test_visible_must_produce_a_boolean(hass: HomeAssistant) -> None:
    compiled = await compile_items(hass, [expressed(text(), visible="{{ 'maybe' }}")])

    assert compiled.elements == []
    assert compiled.warnings[0].startswith("text_1.visible: ")


async def test_the_entities_a_dashboard_depends_on_are_collected(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("sensor.a", "1")
    hass.states.async_set("sensor.b", "2")

    compiled = await compile_items(
        hass,
        [
            expressed(text("x"), value="{{ states('sensor.a') }}"),
            expressed(text("y"), visible="{{ is_state('sensor.b', '2') }}"),
        ],
    )

    assert compiled.dependencies.entities == {"sensor.a", "sensor.b"}
    assert not compiled.dependencies.uses_time


async def test_a_template_that_reads_the_clock_asks_for_periodic_refresh(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_items(hass, [expressed(text(), value="{{ now().hour }}")])

    assert compiled.dependencies.uses_time


async def test_a_dashboard_without_templates_needs_no_home_assistant() -> None:
    validated = validate_dashboard(dashboard([text()]), DEFAULT_REGISTRY)

    compiled = await async_compile_dashboard(
        None,  # type: ignore[arg-type]
        validated,
        DEFAULT_REGISTRY,
    )

    assert compiled.dependencies.entities == set()


def code_elements(compiled: CompiledDashboard) -> list[dict[str, Any]]:
    elements: list[dict[str, Any]] = yaml.safe_load(compiled.yaml)
    return elements


async def test_the_code_view_keeps_expressions_as_written(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.t", "21.5")

    compiled = await compile_items(
        hass,
        [expressed(text(), value="{{ states('sensor.t') }}", y="{{ 7 }}")],
    )

    element = code_elements(compiled)[0]
    assert element["value"] == "{{ states('sensor.t') }}"
    assert element["y"] == "{{ 7 }}"
    assert compiled.elements[0]["value"] == "21.5"


async def test_the_code_view_of_a_container_position_evaluates_to_the_same_place(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("input_number.x", "25")
    compiled = await compile_items(
        hass,
        [
            container(
                "c",
                [expressed(text(), x="{{ states('input_number.x') | int }}")],
                x=40,
            )
        ],
    )

    emitted = code_elements(compiled)[0]["x"]

    assert Template(emitted, hass).async_render(parse_result=True) == 65
    assert compiled.elements[0]["x"] == 65


async def test_the_code_view_folds_container_visibility_into_its_children(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_items(
        hass,
        [
            expressed(
                container("c", [expressed(text(), visible="{{ 1 == 1 }}")]),
                visible="{{ true }}",
            )
        ],
    )

    visible = code_elements(compiled)[0]["visible"]

    assert Template(visible, hass).async_render(parse_result=True) is True


async def test_the_code_view_has_no_editor_metadata(hass: HomeAssistant) -> None:
    compiled = await compile_items(
        hass, [container("c", [text()], background={"fill": "white"})]
    )

    for element in code_elements(compiled):
        assert not {"id", "name", "hidden", "locked", "children", "expressions"} & set(
            element
        )
