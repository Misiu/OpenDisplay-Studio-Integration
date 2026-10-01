"""The item tree: names, containers and expression fields."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.validation import (
    DashboardValidationError,
    is_expression,
)
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

WIDTH = 800
HEIGHT = 480


def dashboard(items: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "schemaVersion": 1,
        "name": "Tree",
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
        "items": items,
    }


def text(item_id: str = "t", **overrides: Any) -> dict[str, Any]:
    return {
        "id": item_id,
        "kind": "primitive",
        "primitive": {"type": "text", "value": "Hi", "x": 10, "y": 20, **overrides},
    }


def container(
    item_id: str = "c", children: list[dict[str, Any]] | None = None, **overrides: Any
) -> dict[str, Any]:
    return {
        "id": item_id,
        "kind": "container",
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 120,
        **overrides,
        "children": children if children is not None else [],
    }


def validated(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    result = validate_dashboard(dashboard(items), DEFAULT_REGISTRY)
    items_out: list[dict[str, Any]] = result["items"]
    return items_out


def test_is_expression_only_matches_jinja_delimiters() -> None:
    assert is_expression("{{ states('sensor.t') }}")
    assert is_expression("{% if true %}1{% endif %}")
    assert not is_expression("plain")
    assert not is_expression("{ single brace }")
    assert not is_expression(12)
    assert not is_expression(None)


class TestNames:
    def test_a_missing_name_defaults_to_type_and_number(self) -> None:
        items = validated([text("a"), text("b"), {**text("c"), "kind": "primitive"}])

        assert [item["name"] for item in items] == ["text_1", "text_2", "text_3"]

    def test_each_type_counts_on_its_own(self) -> None:
        circle = {
            "id": "k",
            "kind": "primitive",
            "primitive": {"type": "circle", "x": 50, "y": 50},
        }

        items = validated([text("a"), circle, text("b")])

        assert [item["name"] for item in items] == ["text_1", "circle_1", "text_2"]

    def test_containers_are_named_after_their_kind(self) -> None:
        assert validated([container()])[0]["name"] == "container_1"

    def test_an_explicit_name_is_kept_and_a_default_skips_used_names(self) -> None:
        items = validated([{**text("a"), "name": "  title  "}, text("b")])

        assert items[0]["name"] == "title"
        assert items[1]["name"] == "text_1"

    def test_a_default_never_takes_an_explicit_name(self) -> None:
        items = validated([{**text("a"), "name": "text_1"}, text("b")])

        assert items[1]["name"] == "text_2"

    def test_names_nested_in_containers_are_numbered_together(self) -> None:
        items = validated([text("a"), container("c", [text("b")])])

        assert items[0]["name"] == "text_1"
        assert items[1]["children"][0]["name"] == "text_2"

    def test_a_name_that_is_too_long_is_rejected(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"item\.name"):
            validated([{**text(), "name": "x" * 101}])


class TestContainers:
    def test_children_are_kept_in_order_with_relative_coordinates(self) -> None:
        child = text("child", x=-30, y=5)

        items = validated([container("c", [child, text("second")])])

        children = items[0]["children"]
        assert [c["id"] for c in children] == ["child", "second"]
        assert children[0]["primitive"]["x"] == -30

    def test_a_container_defaults_to_no_background_and_not_grouped(self) -> None:
        item = validated([container()])[0]

        assert item["grouped"] is False
        assert item["background"] is None

    def test_a_background_is_validated_like_a_rectangle(self) -> None:
        item = validated(
            [container(background={"fill": "white", "outline": "black", "width": 1})]
        )[0]

        assert item["background"] == {
            "fill": "white",
            "outline": "black",
            "width": 1,
            "radius": 0,
        }

    def test_a_group_has_no_background(self) -> None:
        item = validated(
            [
                container(
                    grouped=True,
                    background={"fill": "white", "outline": "black", "width": 1},
                )
            ]
        )[0]

        assert item["grouped"] is True
        assert item["background"] is None

    @pytest.mark.parametrize(
        ("overrides", "message"),
        [
            ({"width": 0}, r"container\.width"),
            ({"height": 5000}, r"container\.height"),
            ({"x": 2 * WIDTH + 1}, r"container\.x"),
            ({"grouped": "yes"}, r"container\.grouped"),
            ({"background": {"fill": "pink"}}, r"background\.fill"),
            ({"background": "white"}, r"container\.background"),
        ],
    )
    def test_invalid_containers_name_the_field(
        self, overrides: dict[str, Any], message: str
    ) -> None:
        with pytest.raises(DashboardValidationError, match=message):
            validated([container(**overrides)])

    def test_ids_are_unique_across_the_whole_tree(self) -> None:
        with pytest.raises(DashboardValidationError, match="unique"):
            validated([text("same"), container("c", [text("same")])])

    def test_nesting_is_limited(self) -> None:
        deepest: dict[str, Any] = container("level9")
        for level in range(8, 0, -1):
            deepest = container(f"level{level}", [deepest])

        with pytest.raises(DashboardValidationError, match="nested"):
            validated([deepest])

    def test_the_item_limit_counts_nested_items(self) -> None:
        children = [text(f"t{index}") for index in range(200)]
        more = [text(f"u{index}") for index in range(100)]

        with pytest.raises(DashboardValidationError, match="at most"):
            validated([container("a", children), container("b", more)])

    def test_children_may_be_widgets(self) -> None:
        widget = {
            "id": "w",
            "kind": "widget",
            "widget": {"type": "weather", "version": "1.0.0"},
            "frame": {"x": 5, "y": 5, "width": 100, "height": 60},
        }

        items = validated([container("c", [widget])])

        assert items[0]["children"][0]["kind"] == "widget"

    def test_only_a_container_has_children(self) -> None:
        with pytest.raises(DashboardValidationError, match="children"):
            validated([{**text(), "children": []}])


class TestDebugGrid:
    @staticmethod
    def grid(item_id: str) -> dict[str, Any]:
        return {
            "id": item_id,
            "kind": "primitive",
            "primitive": {"type": "debug_grid"},
        }

    def test_one_grid_is_accepted_even_inside_a_container(self) -> None:
        items = validated([container("c", [self.grid("g")])])

        assert items[0]["children"][0]["primitive"]["type"] == "debug_grid"

    def test_a_second_grid_is_rejected_wherever_it_is(self) -> None:
        with pytest.raises(DashboardValidationError, match="only one debug_grid"):
            validated([self.grid("g1"), container("c", [self.grid("g2")])])


class TestExpressions:
    def test_an_expression_field_is_stored_verbatim_beside_its_literal(self) -> None:
        item = validated(
            [{**text(), "expressions": {"value": "{{ states('sensor.t') }}"}}]
        )[0]

        assert item["expressions"] == {"value": "{{ states('sensor.t') }}"}
        assert item["primitive"]["value"] == "Hi"

    def test_an_item_without_expressions_has_none_in_its_output(self) -> None:
        assert "expressions" not in validated([text()])[0]
        assert "expressions" not in validated([{**text(), "expressions": {}}])[0]

    def test_any_field_of_the_primitive_may_be_an_expression(self) -> None:
        expressions = {
            "value": "{{ 1 }}",
            "x": "{{ 10 }}",
            "y": "{{ 20 }}",
            "size": "{{ 24 }}",
            "color": "{{ 'red' }}",
        }

        item = validated([{**text(), "expressions": expressions}])[0]

        assert item["expressions"] == expressions

    def test_visible_may_be_an_expression_on_any_kind_of_item(self) -> None:
        visible = {"visible": "{{ is_state('light.a', 'on') }}"}

        for candidate in (text(), container()):
            item = validated([{**candidate, "expressions": visible}])[0]

            assert item["expressions"] == visible

    @pytest.mark.parametrize(
        ("expressions", "message"),
        [
            ({"nonsense": "{{ 1 }}"}, r"expressions\.nonsense"),
            ({"x": "12"}, r"expressions\.x"),
            ({"x": 12}, r"expressions\.x"),
            ({"x": "{{ " + "1" * 3000 + " }}"}, r"expressions\.x"),
            ({"type": "{{ 'circle' }}"}, r"expressions\.type"),
        ],
    )
    def test_invalid_expressions_name_the_field(
        self, expressions: dict[str, Any], message: str
    ) -> None:
        with pytest.raises(DashboardValidationError, match=message):
            validated([{**text(), "expressions": expressions}])

    def test_expressions_must_be_an_object(self) -> None:
        with pytest.raises(DashboardValidationError, match="expressions"):
            validated([{**text(), "expressions": ["{{ 1 }}"]}])

    def test_container_geometry_cannot_be_an_expression(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"expressions\.x"):
            validated([container(expressions={"x": "{{ 5 }}"})])

    def test_an_expression_field_is_exempt_from_the_geometry_checks(self) -> None:
        box = {
            "id": "b",
            "kind": "primitive",
            "primitive": {
                "type": "rectangle",
                "x_start": 50,
                "y_start": 10,
                "x_end": 50,
                "y_end": 90,
            },
            "expressions": {"x_end": "{{ 200 }}"},
        }

        assert validated([box])[0]["expressions"] == {"x_end": "{{ 200 }}"}

    def test_inside_a_container_a_position_must_be_a_single_expression(self) -> None:
        one = expressed_text(x="{{ states('input_number.x') | int }}")
        many = expressed_text(x="{% set a = 1 %}{{ a }}")

        assert validated([container("c", [one])])[0]["children"][0]["expressions"]
        with pytest.raises(DashboardValidationError, match=r"expressions\.x"):
            validated([container("c", [many])])

    def test_at_the_root_a_position_may_be_any_template(self) -> None:
        many = expressed_text(x="{% set a = 1 %}{{ a }}")

        assert validated([many])[0]["expressions"] == {"x": "{% set a = 1 %}{{ a }}"}

    def test_the_visibility_of_a_container_and_its_content_is_a_single_expression(
        self,
    ) -> None:
        block = "{% if true %}true{% endif %}"

        with pytest.raises(DashboardValidationError, match=r"expressions\.visible"):
            validated([container(expressions={"visible": block})])
        with pytest.raises(DashboardValidationError, match=r"expressions\.visible"):
            validated([container("c", [expressed_text(visible=block)])])
        assert validated([expressed_text(visible=block)])


def expressed_text(**expressions: str) -> dict[str, Any]:
    return {**text(), "expressions": expressions}


class TestGroupedContainers:
    def test_a_group_keeps_the_background_its_container_had(self) -> None:
        saved = {"fill": "white", "outline": "black", "width": 2, "radius": 0}

        [item] = validated(
            [container(grouped=True, background=None, savedBackground=saved)]
        )

        assert item["background"] is None
        assert item["savedBackground"] == saved

    def test_a_group_made_from_a_plain_container_without_background_remembers_none(
        self,
    ) -> None:
        [item] = validated([container(grouped=True, savedBackground=None)])

        assert "savedBackground" in item
        assert item["savedBackground"] is None

    def test_a_group_made_from_a_selection_remembers_nothing(self) -> None:
        [item] = validated([container(grouped=True)])

        assert "savedBackground" not in item

    def test_a_plain_container_drops_it(self) -> None:
        [item] = validated(
            [container(savedBackground={"fill": "white", "outline": "black"})]
        )

        assert "savedBackground" not in item

    def test_the_remembered_background_is_validated_like_any_other(self) -> None:
        with pytest.raises(DashboardValidationError, match="background"):
            validated([container(grouped=True, savedBackground={"fill": "pink"})])
