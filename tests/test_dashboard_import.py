"""Exporting a dashboard to a file and importing it into another one."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.opendisplay_studio.color_mapping import nearest_color
from custom_components.opendisplay_studio.dashboard_files import (
    FILE_FORMAT,
    DashboardFileError,
    export_file,
    read_file,
)
from custom_components.opendisplay_studio.dashboard_import import prepare_import
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.primitives import DEFAULT_PRIMITIVES
from custom_components.opendisplay_studio.validation import DashboardValidationError
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY


def display(palette: str) -> dict[str, Any]:
    return {
        "width": 800,
        "height": 480,
        "palette": palette,
        "background": "white",
        "padding": 0,
        "snapSize": 5,
        "deviceId": "kitchen",
    }


def dashboard(palette: str, items: list[dict[str, Any]]) -> dict[str, Any]:
    return validate_dashboard(
        {
            "schemaVersion": 1,
            "name": "Hall",
            "status": "draft",
            "language": "en",
            "display": display(palette),
            "items": items,
        },
        DEFAULT_REGISTRY,
    )


def rectangle(item_id: str, **fields: Any) -> dict[str, Any]:
    return {
        "id": item_id,
        "kind": "primitive",
        "primitive": {
            "type": "rectangle",
            "x_start": 10,
            "y_start": 10,
            "x_end": 90,
            "y_end": 50,
            **fields,
        },
    }


SIX_COLORS = dashboard(
    "spectra6",
    [
        rectangle("r", fill="red", outline="blue"),
        rectangle("y", fill="yellow", outline="black"),
        {
            "id": "plot",
            "kind": "primitive",
            "primitive": {
                "type": "plot",
                "x_start": 10,
                "y_start": 100,
                "x_end": 300,
                "y_end": 200,
                "data": [{"entity": "sensor.a", "color": "green"}],
            },
        },
        {
            "id": "agenda",
            "kind": "widget",
            "widget": {
                "type": "agenda",
                "version": "1.0.0",
                "sources": {"calendars": [{"id": "calendar.a", "color": "red"}]},
            },
            "frame": {"x": 0, "y": 250, "width": 300, "height": 200},
        },
        {
            "id": "box",
            "kind": "container",
            "x": 400,
            "y": 10,
            "width": 100,
            "height": 100,
            "background": {"fill": "yellow", "outline": "black", "width": 1},
            "children": [],
        },
    ],
)


def import_into(
    palette: str, color_map: dict[str, str] | None = None
) -> dict[str, Any]:
    return prepare_import(
        export_file(SIX_COLORS),
        display(palette),
        color_map or {},
        DEFAULT_REGISTRY,
        DEFAULT_PRIMITIVES,
    )


class TestFile:
    def test_a_file_carries_the_design_and_nothing_of_the_installation(self) -> None:
        file = export_file(SIX_COLORS)

        assert file["format"] == FILE_FORMAT
        assert file["version"] == 1
        assert "deviceId" not in file["dashboard"]["display"]
        assert "id" not in file["dashboard"]
        assert file["dashboard"]["name"] == "Hall"
        assert file["dashboard"]["items"] == SIX_COLORS["items"]

    def test_a_file_is_read_back(self) -> None:
        assert read_file(export_file(SIX_COLORS))["items"] == SIX_COLORS["items"]

    @pytest.mark.parametrize(
        ("raw", "code"),
        [
            ("text", "not_a_dashboard_file"),
            ({"format": "other", "version": 1}, "not_a_dashboard_file"),
            ({"format": FILE_FORMAT, "version": "1"}, "not_a_dashboard_file"),
            (
                {"format": FILE_FORMAT, "version": 1, "dashboard": {}},
                "not_a_dashboard_file",
            ),
            ({"format": FILE_FORMAT, "version": 99, "dashboard": {}}, "file_too_new"),
        ],
    )
    def test_a_file_that_cannot_be_read_is_refused_with_a_code(
        self, raw: object, code: str
    ) -> None:
        with pytest.raises(DashboardFileError) as raised:
            read_file(raw)

        assert raised.value.code == code


class TestImport:
    def test_a_file_for_the_same_colors_needs_no_mapping(self) -> None:
        result = import_into("spectra6")

        assert result["colorsToMap"] == []
        assert result["items"] == SIX_COLORS["items"]
        assert result["sourcePalette"] == "spectra6"

    def test_colors_the_palette_lacks_are_listed_once_with_a_suggestion(self) -> None:
        rows = import_into("bw")["colorsToMap"]

        assert rows == [
            {"source": "red", "suggestion": "black"},
            {"source": "blue", "suggestion": "black"},
            {"source": "yellow", "suggestion": "white"},
            {"source": "green", "suggestion": "black"},
        ]

    def test_only_colors_really_used_are_listed(self) -> None:
        only_black = dashboard("spectra6", [rectangle("r", fill="black")])

        result = prepare_import(
            export_file(only_black),
            display("bw"),
            {},
            DEFAULT_REGISTRY,
            DEFAULT_PRIMITIVES,
        )

        assert result["colorsToMap"] == []

    def test_a_mapping_recolors_primitives_nested_fields_widgets_and_containers(
        self,
    ) -> None:
        mapping = {"red": "black", "blue": "white", "yellow": "white", "green": "black"}

        result = import_into("bw", mapping)

        items = {item["id"]: item for item in result["items"]}
        assert result["colorsToMap"] == []
        assert items["r"]["primitive"]["fill"] == "black"
        assert items["r"]["primitive"]["outline"] == "white"
        assert items["y"]["primitive"]["fill"] == "white"
        assert items["plot"]["primitive"]["data"][0]["color"] == "black"
        assert items["agenda"]["widget"]["sources"]["calendars"][0]["color"] == "black"
        assert items["box"]["background"]["fill"] == "white"

    def test_colors_left_out_of_a_partial_mapping_are_still_asked_for(self) -> None:
        result = import_into("bw", {"red": "black"})

        assert [row["source"] for row in result["colorsToMap"]] == [
            "blue",
            "yellow",
            "green",
        ]

    def test_a_mapping_onto_a_color_the_palette_lacks_is_refused(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"colorMap\.red"):
            import_into("bw", {"red": "green"})

    def test_elements_that_are_not_valid_are_refused_with_their_field(self) -> None:
        file = export_file(SIX_COLORS)
        file["dashboard"]["items"][0]["primitive"]["type"] = "nonsense"

        with pytest.raises(DashboardValidationError, match="nonsense"):
            prepare_import(
                file, display("spectra6"), {}, DEFAULT_REGISTRY, DEFAULT_PRIMITIVES
            )


class TestOtherDisplaySize:
    def test_a_design_for_a_bigger_display_is_fitted_not_refused(self) -> None:
        file = export_file(SIX_COLORS)
        rectangle_fields = file["dashboard"]["items"][0]["primitive"]
        rectangle_fields["x_end"] = 2000
        file["dashboard"]["items"].append(
            {
                "id": "photo",
                "kind": "primitive",
                "primitive": {
                    "type": "dlimg",
                    "url": "/media/local/a.jpg",
                    "x": 0,
                    "y": 0,
                    "xsize": 480,
                    "ysize": 800,
                    "resize_method": "contain",
                    "rotate": 0,
                },
            }
        )
        smaller = {**display("spectra6"), "width": 480, "height": 480}

        result = prepare_import(file, smaller, {}, DEFAULT_REGISTRY, DEFAULT_PRIMITIVES)

        items = {item["id"]: item for item in result["items"]}
        assert result["adjusted"] is True
        assert items["r"]["primitive"]["x_end"] == 960
        assert items["photo"]["primitive"]["ysize"] == 480
        assert items["photo"]["primitive"]["xsize"] == 480

    def test_a_design_that_fits_is_not_marked_adjusted(self) -> None:
        assert import_into("spectra6")["adjusted"] is False

    def test_widgets_containers_and_points_are_fitted_too(self) -> None:
        file = export_file(SIX_COLORS)
        items = {item["id"]: item for item in file["dashboard"]["items"]}
        items["agenda"]["frame"].update(x=5000, width=3000)
        items["box"].update(y=-9000, height=9000)
        smaller = {**display("spectra6"), "width": 400, "height": 400}

        result = prepare_import(file, smaller, {}, DEFAULT_REGISTRY, DEFAULT_PRIMITIVES)

        fitted = {item["id"]: item for item in result["items"]}
        assert fitted["agenda"]["frame"]["x"] == 800
        assert fitted["agenda"]["frame"]["width"] == 400
        assert fitted["box"]["y"] == -400
        assert fitted["box"]["height"] == 400


@pytest.mark.parametrize(
    ("color", "palette", "expected"),
    [
        ("red", "bw", "black"),
        ("yellow", "bw", "white"),
        ("#ff8000", "bwry", "yellow"),
        ("blue", "bwr", "black"),
    ],
)
def test_the_nearest_color_of_a_palette(
    color: str, palette: str, expected: str
) -> None:
    assert nearest_color(color, palette) == expected
