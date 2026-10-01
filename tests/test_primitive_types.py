"""Every ODL draw type validates, renders and is measured where its ink lands."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.opendisplay_studio.flatten import shift_primitive
from custom_components.opendisplay_studio.measure import primitive_box
from custom_components.opendisplay_studio.primitives import DEFAULT_PRIMITIVES
from custom_components.opendisplay_studio.validation import DashboardValidationError
from tests.test_items import container, validated
from tests.test_measure import HEIGHT, WIDTH, ink_box, render

DRAWN_TYPES = {
    "text": {"value": "Kitchen", "x": 60, "y": 40, "size": 32},
    "multiline": {"value": "One|Two|Three", "x": 60, "y": 60, "size": 24},
    "rectangle": {"x_start": 50, "y_start": 40, "x_end": 200, "y_end": 120},
    "rectangle_pattern": {
        "x_start": 20,
        "y_start": 30,
        "x_size": 40,
        "y_size": 20,
        "x_offset": 10,
        "y_offset": 6,
        "x_repeat": 4,
        "y_repeat": 3,
    },
    "line": {"x_start": 10, "y_start": 20, "x_end": 200, "y_end": 90},
    "polygon": {"points": [[100, 40], [220, 60], [150, 150]]},
    "circle": {"x": 200, "y": 150, "radius": 50},
    "arc": {"x": 200, "y": 150, "radius": 60, "start_angle": 0, "end_angle": 359},
    "ellipse": {"x_start": 50, "y_start": 40, "x_end": 240, "y_end": 130},
    "icon": {"value": "home", "x": 100, "y": 60, "size": 64},
    "icon_sequence": {
        "icons": ["home", "water", "star"],
        "x": 40,
        "y": 60,
        "size": 40,
        "spacing": 12,
    },
    "qrcode": {"data": "opendisplay", "x": 40, "y": 30},
    "progress_bar": {"x_start": 30, "y_start": 30, "x_end": 230, "y_end": 60},
}


def normalized(primitive_type: str) -> dict[str, Any]:
    return DEFAULT_PRIMITIVES.normalize(
        {"type": primitive_type, **DRAWN_TYPES[primitive_type]}, WIDTH, HEIGHT
    )


def test_every_type_is_covered_or_drawn_by_another_path() -> None:
    types = {definition["type"] for definition in DEFAULT_PRIMITIVES.definitions}

    assert types - set(DRAWN_TYPES) == {"dlimg", "plot", "debug_grid"}


@pytest.mark.parametrize("primitive_type", sorted(DRAWN_TYPES))
async def test_ink_lies_inside_the_measured_box(primitive_type: str) -> None:
    element = shift_primitive(normalized(primitive_type), 0, 0)
    if primitive_type == "progress_bar":
        element["progress"] = 100

    left, top, right, bottom = ink_box(await render([element]))

    box = primitive_box(element, (WIDTH, HEIGHT))
    assert box.x - 1 <= left
    assert box.y - 1 <= top
    assert right <= box.x + box.width + 1
    assert bottom <= box.y + box.height + 1


@pytest.mark.parametrize("primitive_type", sorted(DRAWN_TYPES))
async def test_a_container_offset_moves_the_ink(primitive_type: str) -> None:
    primitive = normalized(primitive_type)

    before = ink_box(await render([shift_primitive(primitive, 0, 0)]))
    after = ink_box(await render([shift_primitive(primitive, 30, 20)]))

    assert (after[0] - before[0], after[1] - before[1]) == (30, 20)


async def test_optional_fields_left_unset_do_not_reach_the_renderer() -> None:
    element = shift_primitive(normalized("rectangle"), 0, 0)

    assert "radius" not in element
    assert "corners" not in element


async def test_rounded_corners_change_the_rendered_corner() -> None:
    plain = shift_primitive(normalized("rectangle"), 0, 0)
    rounded = {**plain, "radius": 20, "fill": "black"}

    image = await render([rounded])

    assert image.getpixel((plain["x_start"], plain["y_start"])) == (255, 255, 255)
    assert image.getpixel((plain["x_start"] + 40, plain["y_start"] + 20)) == (0, 0, 0)


async def test_an_anchor_places_the_text_around_the_point() -> None:
    primitive = {"type": "text", "value": "Middle", "x": 400, "y": 240, "size": 32}
    left = DEFAULT_PRIMITIVES.normalize({**primitive, "anchor": "lm"}, WIDTH, HEIGHT)
    middle = DEFAULT_PRIMITIVES.normalize({**primitive, "anchor": "mm"}, WIDTH, HEIGHT)

    left_ink = ink_box(await render([shift_primitive(left, 0, 0)]))
    middle_ink = ink_box(await render([shift_primitive(middle, 0, 0)]))

    assert 0 <= left_ink[0] - 400 <= 3
    assert abs((middle_ink[0] + middle_ink[2]) / 2 - 400) <= 2


async def test_the_polygon_is_shifted_point_by_point() -> None:
    primitive = normalized("polygon")

    shifted = shift_primitive(primitive, 10, 5)

    assert shifted["points"] == [[110, 45], [230, 65], [160, 155]]


@pytest.mark.parametrize("anchor", ["lt", "mm", "rb", "ms", "ra"])
async def test_the_box_of_anchored_text_contains_its_ink(anchor: str) -> None:
    primitive = DEFAULT_PRIMITIVES.normalize(
        {
            "type": "text",
            "value": "Hg 21.5",
            "x": 400,
            "y": 240,
            "size": 40,
            "anchor": anchor,
        },
        WIDTH,
        HEIGHT,
    )

    left, top, right, bottom = ink_box(await render([primitive]))

    box = primitive_box(primitive, (WIDTH, HEIGHT))
    assert box.x <= left
    assert box.y <= top
    assert right <= box.x + box.width + 1
    assert bottom <= box.y + box.height + 1


def polygon_item(**values: Any) -> dict[str, Any]:
    return {
        "id": "poly",
        "kind": "primitive",
        "primitive": {
            "type": "polygon",
            "points": [[10, 10], [50, 10], [30, 40]],
            **values,
        },
    }


class TestNestedAndListFields:
    def check(self, primitive: dict[str, Any]) -> dict[str, Any]:
        return DEFAULT_PRIMITIVES.normalize(primitive, WIDTH, HEIGHT)

    @pytest.mark.parametrize(
        "points", [[[1, 2], [3, 4]], [[1, 2], [3, 4], [5]], "1,2 3,4 5,6", []]
    )
    def test_a_polygon_needs_three_pairs(self, points: Any) -> None:
        with pytest.raises(DashboardValidationError, match=r"primitive\.points"):
            self.check({"type": "polygon", "points": points})

    def test_points_outside_the_display_are_rejected(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"points\[1\]"):
            self.check({"type": "polygon", "points": [[0, 0], [WIDTH, 0], [5, 5]]})

    @pytest.mark.parametrize("font", ["../secret.ttf", "a/b.ttf", "", "x" * 200])
    def test_a_font_is_a_name_never_a_path(self, font: str) -> None:
        with pytest.raises(DashboardValidationError, match=r"primitive\.font"):
            self.check({"type": "text", "value": "a", "x": 1, "y": 1, "font": font})

    def test_corners_are_kept_in_the_order_the_definition_lists_them(self) -> None:
        rectangle = self.check(
            {
                "type": "rectangle",
                "x_start": 1,
                "y_start": 1,
                "x_end": 50,
                "y_end": 50,
                "corners": "bottom_left, top_left",
            }
        )

        assert rectangle["corners"] == "top_left,bottom_left"

    def test_an_unknown_corner_is_rejected(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"primitive\.corners"):
            self.check(
                {
                    "type": "rectangle",
                    "x_start": 1,
                    "y_start": 1,
                    "x_end": 50,
                    "y_end": 50,
                    "corners": "middle",
                }
            )

    def plot(self, **values: Any) -> dict[str, Any]:
        return {
            "type": "plot",
            "x_start": 10,
            "y_start": 10,
            "x_end": 300,
            "y_end": 200,
            "data": [{"entity": "sensor.temperature"}],
            **values,
        }

    def test_series_take_the_defaults_of_their_definition(self) -> None:
        plot = self.check(self.plot())

        assert plot["data"] == [
            {
                "entity": "sensor.temperature",
                "color": "black",
                "width": 2,
                "smooth": False,
                "line_style": "linear",
                "show_points": False,
                "point_size": 3,
                "point_color": "black",
                "span_gaps": False,
            }
        ]

    @pytest.mark.parametrize(
        "data", [[], [{"entity": "sensor.a"}] * 5, [{"colour": "red"}], "sensor.a"]
    )
    def test_a_plot_needs_between_one_and_four_valid_series(self, data: Any) -> None:
        with pytest.raises(DashboardValidationError, match=r"primitive\.data"):
            self.check(self.plot(data=data))

    def test_axes_are_optional_and_validated_when_given(self) -> None:
        plot = self.check(self.plot(yaxis={"grid_style": "dashed"}))

        assert plot["xaxis"] is None
        assert plot["yaxis"]["grid_style"] == "dashed"
        assert plot["yaxis"]["tick_length"] == 4
        with pytest.raises(DashboardValidationError, match=r"yaxis\.grid_style"):
            self.check(self.plot(yaxis={"grid_style": "wavy"}))

    def test_unset_optional_fields_never_reach_the_renderer(self) -> None:
        element = DEFAULT_PRIMITIVES.element(self.check(self.plot()))

        for key in ("low", "high", "ylegend", "yaxis", "xlegend", "xaxis"):
            assert key not in element

    def test_a_partly_set_axis_keeps_only_what_is_set(self) -> None:
        element = DEFAULT_PRIMITIVES.element(
            self.check(self.plot(xlegend={"size": 12}))
        )

        assert "interval" not in element["xlegend"]
        assert element["xlegend"]["size"] == 12

    def test_an_arc_of_no_size_is_rejected(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"primitive\.radius"):
            self.check(
                {
                    "type": "arc",
                    "x": 5,
                    "y": 5,
                    "radius": 0,
                    "start_angle": 0,
                    "end_angle": 90,
                }
            )


class TestPointsInContainers:
    def compile_items(self, items: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return validated(items)

    def test_points_may_be_an_expression_at_the_root(self) -> None:
        item = polygon_item()
        item["expressions"] = {"points": "{{ [[1, 1], [9, 1], [5, 8]] }}"}

        assert self.compile_items([item])[0]["expressions"]["points"]

    def test_points_may_not_be_an_expression_inside_a_container(self) -> None:
        item = polygon_item()
        item["expressions"] = {"points": "{{ [[1, 1], [9, 1], [5, 8]] }}"}

        with pytest.raises(DashboardValidationError, match="inside a container"):
            self.compile_items([container(children=[item])])
