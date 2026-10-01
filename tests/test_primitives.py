"""Primitive definitions: what they declare and how they validate dashboards."""

from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path
from typing import Any

import pytest

from custom_components.opendisplay_studio.primitives import (
    BUILTIN_PRIMITIVE_DIRECTORY,
    DEFAULT_PRIMITIVES,
    PrimitiveDefinitionError,
    PrimitiveRegistry,
)
from custom_components.opendisplay_studio.validation import DashboardValidationError

WIDTH = 800
HEIGHT = 480
EXPECTED_TYPES = [
    "text",
    "multiline",
    "line",
    "rectangle",
    "rectangle_pattern",
    "polygon",
    "circle",
    "ellipse",
    "arc",
    "icon",
    "icon_sequence",
    "dlimg",
    "qrcode",
    "progress_bar",
    "plot",
    "debug_grid",
]


def normalize(primitive: dict[str, Any]) -> dict[str, Any]:
    return DEFAULT_PRIMITIVES.normalize(primitive, WIDTH, HEIGHT)


def test_every_odl_primitive_offered_today_is_defined_in_library_order() -> None:
    types = [definition["type"] for definition in DEFAULT_PRIMITIVES.definitions]

    assert types == EXPECTED_TYPES


def test_definitions_can_be_sent_to_the_panel_as_json() -> None:
    encoded = json.dumps(DEFAULT_PRIMITIVES.definitions)

    decoded = json.loads(encoded)
    assert decoded[0]["type"] == "text"
    assert {"name", "description", "icon", "category", "geometry", "fields"} <= set(
        decoded[0]
    )


def test_every_field_is_placed_in_layout_or_appearance() -> None:
    for definition in DEFAULT_PRIMITIVES.definitions:
        sections = {field["section"] for field in definition["fields"]}

        assert sections <= {"layout", "appearance"}, definition["type"]


def test_returned_definitions_cannot_change_the_registry() -> None:
    definitions = DEFAULT_PRIMITIVES.definitions
    definitions[0]["name"] = "Changed"

    assert DEFAULT_PRIMITIVES.definitions[0]["name"] == "Text"


@pytest.mark.parametrize("primitive_type", EXPECTED_TYPES)
def test_defaults_alone_make_a_valid_primitive(primitive_type: str) -> None:
    definition = DEFAULT_PRIMITIVES.definition(primitive_type)
    required = {
        field["key"]: 10 if field["shape"] == "coordinate" else "value"
        for field in definition["fields"]
        if field.get("required")
    }
    if definition["geometry"] in {"box", "line"}:
        required.update({"x_end": 100, "y_end": 60})
    required.update(
        {
            field["key"]: field["default"]
            for field in definition["fields"]
            if field.get("required") and field["shape"] not in {"coordinate", "text"}
        }
    )

    normalized = normalize({"type": primitive_type, **required})

    assert normalized["type"] == primitive_type
    for field in definition["fields"]:
        assert field["key"] in normalized


def test_text_keeps_the_documented_field_order_and_fills_defaults() -> None:
    normalized = normalize({"type": "text", "value": " Hello ", "x": 5, "y": 6})

    assert list(normalized)[:6] == ["type", "value", "x", "y", "size", "color"]
    assert normalized["value"] == "Hello"
    assert (normalized["x"], normalized["y"]) == (5, 6)
    assert (normalized["size"], normalized["color"]) == (32, "black")
    assert normalized["anchor"] is None


def test_unknown_keys_are_dropped() -> None:
    normalized = normalize(
        {"type": "text", "value": "a", "x": 1, "y": 1, "shell": "rm -rf"}
    )

    assert "shell" not in normalized


def test_transparent_fill_is_stored_as_none() -> None:
    box = {"type": "rectangle", "x_start": 1, "y_start": 1, "x_end": 9, "y_end": 9}

    assert normalize({**box, "fill": "transparent"})["fill"] is None
    assert normalize(box)["fill"] is None
    assert normalize({**box, "fill": "red"})["fill"] == "red"


def test_accent_colour_is_accepted_where_colours_are() -> None:
    normalized = normalize(
        {"type": "text", "value": "a", "x": 1, "y": 1, "color": "accent"}
    )

    assert normalized["color"] == "accent"


@pytest.mark.parametrize(
    ("primitive", "message"),
    [
        ({"type": "hexagon"}, "Unsupported primitive type: hexagon"),
        (
            {"type": "text", "value": "a", "x": 2 * WIDTH + 1, "y": 0},
            "primitive.x must be",
        ),
        (
            {"type": "text", "value": "a", "x": 0, "y": 2 * HEIGHT + 1},
            "primitive.y must be",
        ),
        ({"type": "text", "value": "a", "x": True, "y": 0}, "primitive.x must be"),
        ({"type": "text", "value": "   ", "x": 0, "y": 0}, "primitive.value must"),
        ({"type": "text", "x": 0, "y": 0}, "primitive.value must be a string"),
        (
            {"type": "text", "value": "a", "x": 0, "y": 0, "size": 5},
            "primitive.size must be between 6 and 256",
        ),
        (
            {"type": "text", "value": "a", "x": 0, "y": 0, "color": "pink"},
            "primitive.color is not a supported palette color",
        ),
        (
            {"type": "circle", "x": 0, "y": 0, "radius": HEIGHT + 1},
            "primitive.radius must be between 1 and 480",
        ),
        (
            {
                "type": "progress_bar",
                "x_start": 0,
                "y_start": 0,
                "x_end": 9,
                "y_end": 9,
                "direction": "sideways",
            },
            "primitive.direction is invalid",
        ),
        (
            {"type": "line", "x_start": 4, "y_start": 4, "x_end": 4, "y_end": 4},
            "line must have two distinct points",
        ),
        (
            {"type": "rectangle", "x_start": 9, "y_start": 1, "x_end": 9, "y_end": 5},
            "rectangle must have positive width and height",
        ),
        (
            {
                "type": "line",
                "x_start": 0,
                "y_start": 0,
                "x_end": 1,
                "y_end": 1,
                "dashed": "yes",
            },
            "primitive.dashed must be a boolean",
        ),
    ],
)
def test_invalid_primitives_name_the_field(
    primitive: dict[str, Any], message: str
) -> None:
    with pytest.raises(DashboardValidationError, match=re.escape(message)):
        normalize(primitive)


def test_a_line_may_run_in_any_direction() -> None:
    normalized = normalize(
        {"type": "line", "x_start": 90, "y_start": 80, "x_end": 10, "y_end": 20}
    )

    assert (normalized["x_start"], normalized["x_end"]) == (90, 10)


def test_qr_data_beyond_what_a_code_can_hold_is_rejected_by_bytes() -> None:
    fits = {"type": "qrcode", "x": 0, "y": 0, "data": "a" * 1273}
    overflows = {"type": "qrcode", "x": 0, "y": 0, "data": "é" * 700}

    assert normalize(fits)["data"] == "a" * 1273
    with pytest.raises(DashboardValidationError, match=r"primitive\.data"):
        normalize(overflows)


def test_icon_anchor_must_be_a_known_anchor() -> None:
    icon = {"type": "icon", "value": "home", "x": 1, "y": 1}

    assert normalize({**icon, "anchor": "mm"})["anchor"] == "mm"
    with pytest.raises(DashboardValidationError, match=r"primitive\.anchor"):
        normalize({**icon, "anchor": "zz"})


def test_the_input_is_never_modified() -> None:
    primitive = {"type": "text", "value": " a ", "x": 1, "y": 1}
    before = deepcopy(primitive)

    normalize(primitive)

    assert primitive == before


class TestLoader:
    def write(self, directory: Path, name: str, text: str) -> None:
        (directory / f"{name}.yml").write_text(text, encoding="utf-8")

    def valid(self, **overrides: Any) -> str:
        lines = {
            "type": "dot",
            "order": "10",
            "name": "Dot",
            "description": "A dot",
            "icon": "mdi:circle",
            "category": "shapes",
            "geometry": "point",
        }
        lines.update({key: str(value) for key, value in overrides.items()})
        header = "\n".join(f"{key}: {value}" for key, value in lines.items())
        return (
            f"{header}\nfields:\n  - key: x\n    label: X\n    shape: coordinate\n"
            "    axis: x\n    required: true\n    section: layout\n"
        )

    def test_loads_a_minimal_definition(self, tmp_path: Path) -> None:
        self.write(tmp_path, "dot", self.valid())

        registry = PrimitiveRegistry.from_directory(tmp_path)

        assert [d["type"] for d in registry.definitions] == ["dot"]

    def test_builtin_directory_holds_one_file_per_type(self) -> None:
        names = sorted(path.stem for path in BUILTIN_PRIMITIVE_DIRECTORY.glob("*.yml"))

        assert names == sorted(EXPECTED_TYPES)

    @pytest.mark.parametrize(
        ("overrides", "message"),
        [
            ({"geometry": "cube"}, "geometry"),
            ({"category": ""}, "category"),
            ({"type": "Other"}, "does not match"),
        ],
    )
    def test_rejects_a_malformed_header(
        self, tmp_path: Path, overrides: dict[str, Any], message: str
    ) -> None:
        self.write(tmp_path, "dot", self.valid(**overrides))

        with pytest.raises(PrimitiveDefinitionError, match=message):
            PrimitiveRegistry.from_directory(tmp_path)

    def test_rejects_an_unknown_field_shape(self, tmp_path: Path) -> None:
        text = self.valid().replace("shape: coordinate", "shape: hologram")
        self.write(tmp_path, "dot", text)

        with pytest.raises(PrimitiveDefinitionError, match="hologram"):
            PrimitiveRegistry.from_directory(tmp_path)

    def test_rejects_a_field_without_default_or_required(self, tmp_path: Path) -> None:
        text = self.valid().replace("    required: true\n", "")
        self.write(tmp_path, "dot", text)

        with pytest.raises(PrimitiveDefinitionError, match="default"):
            PrimitiveRegistry.from_directory(tmp_path)


def test_primitives_are_labelled_in_the_language_asked_for() -> None:
    polish = {d["type"]: d for d in DEFAULT_PRIMITIVES.localized("pl-PL")}
    english = {d["type"]: d for d in DEFAULT_PRIMITIVES.localized("xx")}

    assert polish["rectangle"]["name"] == "Prostokąt"
    assert polish["rectangle"]["fields"][0]["label"] == "Lewa"
    assert english["rectangle"]["name"] == "Rectangle"
    assert english["rectangle"]["fields"][0]["label"] == "Left"


@pytest.mark.parametrize("language", ["pl", "de"])
def test_every_translated_primitive_label_matches_a_real_field(language: str) -> None:
    path = Path(__file__).parent.parent / "custom_components/opendisplay_studio"
    translations = json.loads(
        (path / f"primitives/translations/{language}.json").read_text(encoding="utf-8")
    )
    expected = set()
    for definition in DEFAULT_PRIMITIVES.definitions:
        kind = definition["type"]
        expected |= {f"{kind}.name", f"{kind}.description"}
        expected |= {
            f"{kind}.{f['key']}" for f in definition["fields"] if f.get("visible", True)
        }

    assert set(translations) == expected
