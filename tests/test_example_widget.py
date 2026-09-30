"""The example package in `examples/widgets/hello_world` works when dropped in."""

from __future__ import annotations

import shutil
from pathlib import Path
from typing import TYPE_CHECKING

from custom_components.opendisplay_studio.compiler import async_compile_dashboard
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    WidgetRegistry,
)

from .test_items import dashboard
from .test_widgets import widget_item

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

EXAMPLE = Path(__file__).parent.parent / "examples" / "widgets" / "hello_world"


def install(tmp_path: Path) -> WidgetRegistry:
    shutil.copytree(EXAMPLE, tmp_path / "hello_world")
    return WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)


def test_the_example_is_listed_as_a_user_widget_after_a_reload(
    tmp_path: Path,
) -> None:
    registry = install(tmp_path)

    hello = next(w for w in registry.definitions("en") if w["id"] == "hello-world")

    assert registry.errors == []
    assert hello["builtin"] is False
    assert hello["category"] == "Examples"


async def test_the_example_renders_in_the_language_of_the_dashboard(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    registry = install(tmp_path)
    value = dashboard([widget_item("hello-world", options={"who": "Ola"})])
    value["language"] = "pl"

    validated = validate_dashboard(value, registry)
    compiled = await async_compile_dashboard(hass, validated, registry)

    greeting = next(e for e in compiled.elements if e["type"] == "text")
    assert greeting["value"] == "Witaj, Ola!"
    assert compiled.warnings == []
