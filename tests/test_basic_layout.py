"""A basic dashboard is a grid cut into regions, with a widget in each region."""

from __future__ import annotations

from copy import deepcopy
from typing import TYPE_CHECKING, Any

import pytest

from custom_components.opendisplay_studio.basic_layout import (
    grid_cells,
    region_frame,
    validate_layout,
    working_area,
)
from custom_components.opendisplay_studio.compiler import async_compile_dashboard
from custom_components.opendisplay_studio.dashboards import (
    DashboardValidationError,
    validate_dashboard,
)
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY

from .test_items import dashboard, text
from .test_widgets import widget_item

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def region(
    region_id: str, row: int, column: int, row_span: int = 1, column_span: int = 1
) -> dict[str, Any]:
    return {
        "id": region_id,
        "row": row,
        "column": column,
        "rowSpan": row_span,
        "columnSpan": column_span,
    }


def two_by_two(**overrides: Any) -> dict[str, Any]:
    return {
        "columns": 2,
        "rows": 2,
        "gap": 8,
        "regions": [
            region("a", 0, 0),
            region("b", 0, 1),
            region("c", 1, 0),
            region("d", 1, 1),
        ],
        **overrides,
    }


def in_region(region_id: str, **overrides: Any) -> dict[str, Any]:
    item = widget_item("sensor-card", item_id=f"w-{region_id}")
    return {**item, "region": region_id, **overrides}


def basic(items: list[dict[str, Any]], layout: dict[str, Any] | None = None) -> dict:
    return {
        **dashboard(items),
        "mode": "basic",
        "layout": layout if layout is not None else two_by_two(),
    }


def validated(value: dict[str, Any]) -> dict[str, Any]:
    return validate_dashboard(value, DEFAULT_REGISTRY)


def test_the_cells_of_a_grid_fill_the_working_area_with_the_gap_between_them() -> None:
    area = working_area(800, 480, 20)

    cells = grid_cells(area, 2, 2, 8)

    assert [(c.x, c.y, c.width, c.height) for c in cells] == [
        (20, 20, 376, 216),
        (404, 20, 376, 216),
        (20, 244, 376, 216),
        (404, 244, 376, 216),
    ]


def test_a_region_spans_from_its_first_cell_to_its_last() -> None:
    cells = grid_cells(working_area(800, 480, 0), 2, 2, 8)

    assert region_frame(cells, 2, region("wide", 0, 0, column_span=2)) == {
        "x": 0,
        "y": 0,
        "width": 800,
        "height": 236,
    }
    assert region_frame(cells, 2, region("tall", 0, 1, row_span=2)) == {
        "x": 404,
        "y": 0,
        "width": 396,
        "height": 480,
    }


def test_a_valid_layout_is_kept_as_it_is() -> None:
    assert validate_layout(two_by_two()) == two_by_two()


def test_a_layout_without_a_gap_gets_the_default_one() -> None:
    layout = two_by_two()
    del layout["gap"]

    assert validate_layout(layout)["gap"] == 8


@pytest.mark.parametrize(
    "layout",
    [
        two_by_two(columns=0),
        two_by_two(rows=13),
        two_by_two(gap=-1),
        two_by_two(regions=[]),
        two_by_two(
            regions=[
                region("a", 0, 0),
                region("a", 0, 1),
                region("c", 1, 0),
                region("d", 1, 1),
            ]
        ),
        # A cell with no region.
        two_by_two(regions=[region("a", 0, 0), region("b", 0, 1), region("c", 1, 0)]),
        # Two regions on one cell.
        two_by_two(
            regions=[
                region("a", 0, 0, 2, 2),
                region("b", 0, 1),
                region("c", 1, 0),
                region("d", 1, 1),
            ]
        ),
        # Beyond the grid.
        two_by_two(
            regions=[region("a", 0, 0, 1, 3), region("c", 1, 0), region("d", 1, 1)]
        ),
        "a grid",
    ],
    ids=[
        "no columns",
        "too many rows",
        "negative gap",
        "no regions",
        "same id",
        "a cell left out",
        "overlap",
        "beyond the grid",
        "not an object",
    ],
)
def test_a_layout_that_is_not_a_tiling_of_the_grid_is_refused(layout: Any) -> None:
    with pytest.raises(DashboardValidationError):
        validate_layout(layout)


def test_a_basic_dashboard_puts_each_widget_in_the_frame_of_its_region() -> None:
    sent = [in_region("a"), in_region("d")]
    for item in sent:
        item["frame"] = {"x": 3, "y": 3, "width": 10, "height": 10}

    result = validated(basic(sent))

    frames = {item["region"]: item["frame"] for item in result["items"]}
    assert frames["a"] == {"x": 0, "y": 0, "width": 396, "height": 236}
    assert frames["d"] == {"x": 404, "y": 244, "width": 396, "height": 236}
    assert result["mode"] == "basic"
    assert result["layout"] == two_by_two()


def test_a_basic_dashboard_follows_its_padding() -> None:
    value = basic([in_region("a")])
    value["display"]["padding"] = 20

    result = validated(value)

    assert result["items"][0]["frame"]["x"] == 20


def test_a_region_may_be_empty() -> None:
    assert validated(basic([in_region("b")]))["items"][0]["region"] == "b"
    assert validated(basic([]))["items"] == []


@pytest.mark.parametrize(
    "items",
    [
        [{**in_region("a"), "region": "nowhere"}],
        [{k: v for k, v in in_region("a").items() if k != "region"}],
        [in_region("a"), {**in_region("a"), "id": "second"}],
        [text()],
    ],
    ids=["unknown region", "no region", "two widgets in one region", "not a widget"],
)
def test_a_basic_dashboard_holds_one_widget_in_each_region_and_nothing_else(
    items: list[dict[str, Any]],
) -> None:
    with pytest.raises(DashboardValidationError):
        validated(basic(items))


def test_a_basic_dashboard_needs_a_layout() -> None:
    value = basic([])
    del value["layout"]

    with pytest.raises(DashboardValidationError):
        validated(value)


def test_a_dashboard_without_a_mode_is_an_advanced_one_and_stays_as_it_was() -> None:
    stored = dashboard([text()])
    assert "mode" not in stored

    result = validated(stored)

    assert result["mode"] == "advanced"
    assert "layout" not in result
    assert result["items"] == validated({**stored, "mode": "advanced"})["items"]


def test_an_advanced_dashboard_refuses_what_belongs_to_a_basic_one() -> None:
    with pytest.raises(DashboardValidationError):
        validated({**dashboard([]), "layout": two_by_two()})
    with pytest.raises(DashboardValidationError):
        validated({**dashboard([in_region("a")])})


def test_an_unknown_mode_is_refused() -> None:
    with pytest.raises(DashboardValidationError):
        validated({**dashboard([]), "mode": "simple"})


def test_the_mode_survives_a_second_validation() -> None:
    first = validated(basic([in_region("a")]))

    assert validated(deepcopy(first)) == first


async def test_a_basic_dashboard_is_drawn_inside_the_frames_of_its_regions(
    hass: HomeAssistant,
) -> None:
    result = validated(basic([in_region("a"), in_region("d")]))

    compiled = await async_compile_dashboard(hass, result, DEFAULT_REGISTRY)

    assert compiled.item_bounds["w-a"] == {"x": 0, "y": 0, "width": 396, "height": 236}
    assert compiled.item_bounds["w-d"] == {
        "x": 404,
        "y": 244,
        "width": 396,
        "height": 236,
    }


async def test_the_panel_asks_the_backend_for_the_cells_and_regions_of_a_layout(
    call: Any,
) -> None:
    layout = {
        "columns": 2,
        "rows": 2,
        "gap": 8,
        "regions": [
            {"id": "top", "row": 0, "column": 0, "rowSpan": 1, "columnSpan": 2},
            {"id": "left", "row": 1, "column": 0, "rowSpan": 1, "columnSpan": 1},
            {"id": "right", "row": 1, "column": 1, "rowSpan": 1, "columnSpan": 1},
        ],
    }

    response = await call(
        "layout_frames", width=800, height=480, padding=20, layout=layout
    )

    assert response["success"]
    result = response["result"]
    assert [(cell["x"], cell["y"]) for cell in result["cells"]] == [
        (20, 20),
        (404, 20),
        (20, 244),
        (404, 244),
    ]
    assert result["regions"][0] == {
        "id": "top",
        "x": 20,
        "y": 20,
        "width": 760,
        "height": 216,
    }


async def test_a_layout_that_leaves_a_cell_empty_is_refused(call: Any) -> None:
    layout = {
        "columns": 2,
        "rows": 1,
        "gap": 8,
        "regions": [{"id": "a", "row": 0, "column": 0, "rowSpan": 1, "columnSpan": 1}],
    }

    response = await call(
        "layout_frames", width=800, height=480, padding=20, layout=layout
    )

    assert response["error"]["code"] == "invalid_layout"


def test_a_layout_may_mix_regions_of_any_size() -> None:
    """A tall region, a square one and single cells make a valid layout."""
    singles = [
        {"id": f"s{index}", "row": index, "column": 3, "rowSpan": 1, "columnSpan": 1}
        for index in range(4)
    ]
    leftover = [
        {
            "id": f"c{row}{column}",
            "row": row,
            "column": column,
            "rowSpan": 1,
            "columnSpan": 1,
        }
        for row in (2, 3)
        for column in (1, 2)
    ]
    layout = {
        "columns": 4,
        "rows": 4,
        "gap": 8,
        "regions": [
            {"id": "tall", "row": 0, "column": 0, "rowSpan": 4, "columnSpan": 1},
            {"id": "square", "row": 0, "column": 1, "rowSpan": 2, "columnSpan": 2},
            *leftover,
            *singles,
        ],
    }

    validated = validate_layout(layout)

    assert len(validated["regions"]) == 10
    assert validated["regions"][0]["rowSpan"] == 4


def test_a_region_as_wide_as_the_grid_is_valid() -> None:
    layout = {
        "columns": 4,
        "rows": 1,
        "gap": 8,
        "regions": [
            {"id": "all", "row": 0, "column": 0, "rowSpan": 1, "columnSpan": 4}
        ],
    }

    assert validate_layout(layout)["regions"][0]["columnSpan"] == 4
