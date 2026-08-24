"""Tests for safe and compatible Liquid processing."""

import pytest

from custom_components.opendisplay_studio.liquid_renderer import (
    TemplateRenderError,
    TrmnlLiquidRenderer,
)


def test_standard_liquid_constructs_and_trmnl_filters() -> None:
    result = TrmnlLiquidRenderer().render(
        "{% for item in items %}{% if item.show %}{{ item.value | number_with_delimiter: ' ' }}{% endif %}{% else %}empty{% endfor %}",
        {"items": [{"show": True, "value": 12345}, {"show": False, "value": 9}]},
    )
    assert result.html == "12 345"
    assert result.milliseconds >= 0


def test_selected_trmnl_filters_match_ruby_contracts() -> None:
    renderer = TrmnlLiquidRenderer()
    assert (
        renderer.render(
            "{{ values | map_to_i | join: ',' }}", {"values": ["12px", "-4.5", "x"]}
        ).html
        == "12,-4,0"
    )
    grouped = renderer.render(
        "{{ values | group_by: 'room' | json }}",
        {"values": [{"room": "kitchen", "value": 1}, {"room": "kitchen", "value": 2}]},
    )
    assert (
        grouped.html
        == "{&#34;kitchen&#34;:[{&#34;room&#34;:&#34;kitchen&#34;,&#34;value&#34;:1},{&#34;room&#34;:&#34;kitchen&#34;,&#34;value&#34;:2}]}"
    )


def test_missing_values_require_explicit_default() -> None:
    renderer = TrmnlLiquidRenderer()
    assert renderer.render("{{ missing | default: '—' }}", {}).html == "—"
    with pytest.raises(TemplateRenderError):
        renderer.render("{{ missing }}", {})


def test_empty_data_and_html_escaping() -> None:
    result = TrmnlLiquidRenderer().render(
        "{% for item in items %}{{ item }}{% else %}empty{% endfor %} {{ value }}",
        {"items": [], "value": "<script>bad</script>"},
    )
    assert result.html == "empty &lt;script&gt;bad&lt;/script&gt;"


def test_malformed_and_unbounded_templates_fail_cleanly() -> None:
    renderer = TrmnlLiquidRenderer()
    with pytest.raises(TemplateRenderError):
        renderer.render("{% if broken %}", {"broken": True})
    with pytest.raises(TemplateRenderError):
        renderer.render(
            "{% for i in (1..100) %}{% for j in (1..100) %}{{ i }}{{ j }}{% endfor %}{% endfor %}",
            {},
        )
