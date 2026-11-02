"""A dashboard draws with the font it names, and with the default when it is gone."""

from __future__ import annotations

from contextlib import suppress
from copy import deepcopy
from pathlib import Path
from typing import TYPE_CHECKING, Any

import odl_renderer
import pytest

from custom_components.opendisplay_studio import measure
from custom_components.opendisplay_studio.compiler import (
    CompiledDashboard,
    async_compile_dashboard,
)
from custom_components.opendisplay_studio.dashboards import (
    DashboardValidationError,
    validate_dashboard,
)
from custom_components.opendisplay_studio.fonts import (
    DEFAULT_FONT,
    FONT_FOLDER,
    FontError,
    FontLibrary,
)
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from custom_components.opendisplay_studio.widgets.options import normalize_options

from .test_items import container, dashboard, text
from .test_widgets import texts, widget_item

if TYPE_CHECKING:
    from collections.abc import Iterator

    from homeassistant.core import HomeAssistant

FONT_FILE = Path(odl_renderer.__file__).parent / "assets" / "rbm.ttf"
GONE = "Gone.ttf"
ENTITY = {"entities": [{"id": "sensor.kitchen"}]}


@pytest.fixture
def mono(hass: HomeAssistant) -> Iterator[str]:
    """Install `Mono.ttf`, a copy of a bundled font, for the time of one test."""
    library = FontLibrary(Path(hass.config.path(*FONT_FOLDER)))
    with suppress(FontError):
        library.remove("Mono.ttf")
    library.install("Mono.ttf", FONT_FILE.read_bytes())
    measure.use_font_directories(library.directories)
    hass.states.async_set("sensor.kitchen", "21.4", {"friendly_name": "Kitchen"})
    yield "Mono.ttf"
    library.remove("Mono.ttf")
    measure.use_font_directories([])


async def compile_dashboard(
    hass: HomeAssistant, items: list[dict[str, Any]]
) -> CompiledDashboard:
    validated = validate_dashboard(dashboard(items), DEFAULT_REGISTRY)
    return await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)


def fonts_of(compiled: CompiledDashboard) -> set[str]:
    return {
        element.get("font", DEFAULT_FONT)
        for element in compiled.elements
        if element["type"] == "text"
    }


def sizes_of(compiled: CompiledDashboard) -> set[int]:
    return {
        element["size"] for element in compiled.elements if element["type"] == "text"
    }


async def test_a_text_is_drawn_with_the_installed_font_it_names(
    hass: HomeAssistant, mono: str
) -> None:
    compiled = await compile_dashboard(hass, [text(font=mono)])

    assert fonts_of(compiled) == {mono}
    assert compiled.warnings == []


async def test_a_text_whose_font_is_gone_is_drawn_with_the_default_and_a_warning(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_dashboard(hass, [text(font=GONE)])

    assert fonts_of(compiled) == {DEFAULT_FONT}
    assert compiled.warnings == [f"text_1: font {GONE} is not installed, using ppb.ttf"]


async def test_a_font_that_is_gone_stays_in_the_stored_dashboard(
    hass: HomeAssistant,
) -> None:
    items = [text(font=GONE)]
    before = deepcopy(items)

    await compile_dashboard(hass, items)

    assert items == before


async def test_a_hidden_text_with_a_missing_font_gives_no_warning(
    hass: HomeAssistant,
) -> None:
    hidden = {**text("h", font=GONE), "hidden": True}

    compiled = await compile_dashboard(hass, [text(font=GONE), hidden])

    assert len(compiled.warnings) == 1


async def test_a_font_in_a_container_is_checked_too(hass: HomeAssistant) -> None:
    compiled = await compile_dashboard(hass, [container("c", [text(font=GONE)])])

    assert fonts_of(compiled) == {DEFAULT_FONT}
    assert len(compiled.warnings) == 1


async def test_a_widget_draws_all_its_text_with_the_font_it_names(
    hass: HomeAssistant, mono: str
) -> None:
    item = widget_item("sensor-card", sources=ENTITY, options={"font": mono})

    compiled = await compile_dashboard(hass, [item])

    assert texts(compiled)
    assert fonts_of(compiled) == {mono}


async def test_a_widget_that_keeps_the_default_font_gives_the_odl_it_always_gave(
    hass: HomeAssistant, mono: str
) -> None:
    item = widget_item("sensor-card", sources=ENTITY)

    compiled = await compile_dashboard(hass, [item])

    assert all("font" not in e for e in compiled.elements if e["type"] == "text")


async def test_the_text_of_a_widget_is_measured_in_the_font_it_is_drawn_in(
    hass: HomeAssistant, mono: str
) -> None:
    sizes = {}
    for font in (DEFAULT_FONT, "rbm.ttf", mono):
        item = widget_item("sensor-card", sources=ENTITY, options={"font": font})
        sizes[font] = sizes_of(await compile_dashboard(hass, [item]))

    assert sizes["rbm.ttf"] != sizes[DEFAULT_FONT]
    # Mono.ttf is a copy of rbm.ttf, so it is measured like it.
    assert sizes[mono] == sizes["rbm.ttf"]


async def test_a_widget_whose_font_is_gone_is_drawn_with_the_default_and_a_warning(
    hass: HomeAssistant, mono: str
) -> None:
    item = widget_item("sensor-card", sources=ENTITY, options={"font": GONE})

    compiled = await compile_dashboard(hass, [item])

    assert fonts_of(compiled) == {DEFAULT_FONT}
    assert any(f"font {GONE} is not installed" in w for w in compiled.warnings)


async def test_a_text_size_caps_the_text_of_a_list(
    hass: HomeAssistant, mono: str
) -> None:
    frame = {"x": 0, "y": 0, "width": 300, "height": 100}

    def listing(options: dict[str, Any]) -> dict[str, Any]:
        return widget_item("sensor-list", sources=ENTITY, frame=frame, options=options)

    automatic = await compile_dashboard(hass, [listing({})])
    capped = await compile_dashboard(hass, [listing({"textSize": 12})])

    assert max(sizes_of(automatic)) > 12
    assert max(sizes_of(capped)) == 12


def test_the_text_size_may_be_left_automatic_and_is_then_none() -> None:
    manifest = DEFAULT_REGISTRY.package("agenda").manifest

    assert normalize_options(manifest, {})["textSize"] is None
    assert normalize_options(manifest, {"textSize": 14})["textSize"] == 14


@pytest.mark.parametrize("font", ["../x.ttf", "a/b.ttf", "", 3])
def test_a_font_option_must_be_the_name_of_a_file(font: object) -> None:
    manifest = DEFAULT_REGISTRY.package("agenda").manifest

    with pytest.raises(DashboardValidationError):
        normalize_options(manifest, {"font": font})
