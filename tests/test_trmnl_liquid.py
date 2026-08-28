"""Integration contracts for the shared TRMNL-compatible Liquid package."""

import json
from pathlib import Path

import pytest
from trmnl_liquid import Environment, __version__, render

from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY


def test_manifest_pins_the_tested_trmnl_liquid_version() -> None:
    manifest_path = (
        Path(__file__).parents[1]
        / "custom_components"
        / "opendisplay_studio"
        / "manifest.json"
    )
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert manifest["requirements"] == [f"trmnl-liquid-py=={__version__}"]


def test_standard_liquid_constructs_and_trmnl_filters() -> None:
    html = render(
        "{% for item in items %}{% if item.show %}{{ item.value | number_with_delimiter: ' ' }}{% endif %}{% else %}empty{% endfor %}",
        items=[{"show": True, "value": 12345}, {"show": False, "value": 9}],
    )
    assert html == "12 345"


def test_trmnl_inline_templates_and_filters_are_available() -> None:
    html = render(
        "{% template card %}<p>{{ title }}</p>{% endtemplate %}{% render 'card', title: label %}|{{ values | map_to_i | join: ',' }}",
        label="Weather",
        values=["12px", "-4.5", "x"],
    )
    assert html == "<p>Weather</p>|12,-4,0"


def test_rendering_uses_trmnl_lax_and_unescaped_semantics() -> None:
    assert render("{{ missing }}|{{ value }}", value="<b>ready</b>") == "|<b>ready</b>"


def test_lax_parser_matches_trmnl_for_incomplete_template() -> None:
    assert render("{% if broken %}", broken=True) == ""


@pytest.mark.parametrize("widget_type", sorted(DEFAULT_REGISTRY.widget_types))
def test_every_bundled_widget_template_compiles(widget_type: str) -> None:
    Environment().from_string(DEFAULT_REGISTRY.template(widget_type))


def test_weather_template_has_no_remote_assets() -> None:
    template = DEFAULT_REGISTRY.template("weather")

    assert "http://" not in template
    assert "https://" not in template
    assert "mdi-weather" in template


@pytest.mark.parametrize("widget_type", sorted(DEFAULT_REGISTRY.widget_types))
def test_every_bundled_widget_renders_with_missing_provider_data(
    widget_type: str,
) -> None:
    definition = DEFAULT_REGISTRY.definition(widget_type)
    data = {requirement["key"]: None for requirement in definition["dataRequirements"]}

    html = render(
        DEFAULT_REGISTRY.template(widget_type),
        config=definition["defaults"],
        data=data,
        assets=DEFAULT_REGISTRY.assets(widget_type),
        region={"shape": "square"},
    )

    assert isinstance(html, str)
    assert html.strip()
