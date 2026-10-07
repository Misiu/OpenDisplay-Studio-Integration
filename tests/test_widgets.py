"""Widget packages: loading, validation, data and what the built-in widgets draw."""

from __future__ import annotations

import json
from datetime import timedelta
from pathlib import Path
from typing import TYPE_CHECKING, Any

import pytest
import yaml
from homeassistant.core import ServiceCall, SupportsResponse
from homeassistant.util import dt as dt_util

from custom_components.opendisplay_studio.compiler import (
    CompiledDashboard,
    async_compile_dashboard,
)
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.validation import DashboardValidationError
from custom_components.opendisplay_studio.widget_reload import async_reload_widgets
from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
    WidgetRegistry,
)
from custom_components.opendisplay_studio.widgets.manifest import (
    ManifestError,
    parse_manifest,
)

from .test_items import dashboard

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

FRAME = {"x": 20, "y": 20, "width": 360, "height": 240}


def widget_item(
    widget_type: str,
    *,
    sources: dict[str, Any] | None = None,
    options: dict[str, Any] | None = None,
    frame: dict[str, int] | None = None,
    item_id: str = "w",
) -> dict[str, Any]:
    return {
        "id": item_id,
        "kind": "widget",
        "widget": {
            "type": widget_type,
            "version": "1.0.0",
            "sources": sources or {},
            "options": options or {},
        },
        "frame": frame or FRAME,
    }


async def compile_widget(
    hass: HomeAssistant, item: dict[str, Any], language: str = "en"
) -> CompiledDashboard:
    value = dashboard([item])
    value["language"] = language
    validated = validate_dashboard(value, DEFAULT_REGISTRY)
    return await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)


def texts(compiled: CompiledDashboard) -> list[str]:
    return [
        str(element["value"])
        for element in compiled.elements
        if element["type"] == "text"
    ]


def package(root: Path, folder: str, manifest: str, renderer: str) -> Path:
    """Write a minimal widget package under `root`."""
    directory = root / folder
    (directory / "translations").mkdir(parents=True, exist_ok=True)
    (directory / "widget.yml").write_text(manifest, encoding="utf-8")
    (directory / "renderer.py").write_text(renderer, encoding="utf-8")
    (directory / "translations" / "en.json").write_text("{}", encoding="utf-8")
    return directory


HELLO_MANIFEST = """
api: 1
id: {widget_id}
name: Hello
version: 1.0.0
description: Says hello.
icon: mdi:hand-wave
layout:
  defaultSize: {{ width: 200, height: 100 }}
  minSize: {{ width: 100, height: 50 }}
"""

HELLO_RENDERER = """
from opendisplay_studio.sdk import text


def render(context):
    return [text("{greeting}", x=context.box.x, y=context.box.y)]


RENDERER = render
"""


class TestBuiltInCatalog:
    def test_every_built_in_package_loads(self) -> None:
        assert DEFAULT_REGISTRY.errors == []
        assert DEFAULT_REGISTRY.widget_types == {"sensor-card", "agenda", "weather"}

    def test_labels_come_in_the_dashboard_language(self) -> None:
        english = {w["id"]: w for w in DEFAULT_REGISTRY.definitions("en")}
        polish = {w["id"]: w for w in DEFAULT_REGISTRY.definitions("pl")}

        assert english["agenda"]["name"] == "Agenda"
        assert polish["sensor-card"]["name"] == "Karta czujnika"
        assert polish["weather"]["sources"][0]["label"] == "Encja pogody"

    def test_german_labels_are_available(self) -> None:
        german = {w["id"]: w["name"] for w in DEFAULT_REGISTRY.definitions("de-AT")}

        assert german["sensor-card"] == "Sensorkarte"
        assert german["weather"] == "Wetter"

    def test_an_unknown_language_falls_back_to_english(self) -> None:
        names = {w["id"]: w["name"] for w in DEFAULT_REGISTRY.definitions("xx")}

        assert names["sensor-card"] == "Sensor card"

    @pytest.mark.parametrize("language", ["pl", "de"])
    @pytest.mark.parametrize("widget_id", ["sensor-card", "agenda", "weather"])
    def test_every_language_translates_everything_english_does(
        self, widget_id: str, language: str
    ) -> None:
        translations = DEFAULT_REGISTRY.package(widget_id).translations

        assert set(translations["en"]) <= set(translations[language])

    @pytest.mark.parametrize("widget_id", ["sensor-card", "agenda", "weather"])
    def test_every_label_the_panel_shows_is_translated(self, widget_id: str) -> None:
        manifest = DEFAULT_REGISTRY.definition(widget_id)
        translations = DEFAULT_REGISTRY.package(widget_id).translations["en"]
        keys = {"name", "description"}
        for source in manifest["sources"]:
            keys.add(f"sources.{source['key']}")
            keys |= {f"sources.{source['key']}.{x['key']}" for x in source["perSource"]}
        for section in manifest["options"]:
            keys.add(f"sections.{section['section']}")
            keys |= {f"options.{option['key']}" for option in section["fields"]}

        assert keys <= set(translations)


class TestManifest:
    def parse(self, text: str, folder: str = "hello") -> dict[str, Any]:
        return parse_manifest(yaml.safe_load(text), folder)

    def test_a_valid_manifest_gets_its_defaults(self) -> None:
        manifest = self.parse(HELLO_MANIFEST.format(widget_id="hello"))

        assert manifest["category"] == "General"
        assert manifest["sources"] == []
        assert manifest["renderer"] == "renderer.py"

    def test_an_unknown_api_major_is_rejected_with_the_file_and_field(self) -> None:
        text = HELLO_MANIFEST.format(widget_id="hello").replace("api: 1", "api: 2")

        with pytest.raises(ManifestError, match=r"hello/widget\.yml: api:"):
            self.parse(text)

    def test_an_error_inside_a_source_names_its_path(self) -> None:
        text = HELLO_MANIFEST.format(widget_id="hello") + (
            "sources:\n  - key: things\n    label: Things\n    selector: {}\n"
        )

        with pytest.raises(ManifestError, match=r"sources\[0\]\.selector"):
            self.parse(text)

    def test_a_data_parameter_may_only_point_at_an_option_that_exists(self) -> None:
        text = HELLO_MANIFEST.format(widget_id="hello") + (
            "data:\n  entity_state:\n    days: '@options.nothing'\n"
        )

        with pytest.raises(ManifestError, match=r"data\.entity_state\.days"):
            self.parse(text)

    def test_the_id_must_be_kebab_case(self) -> None:
        with pytest.raises(ManifestError, match=r"hello/widget\.yml: id:"):
            self.parse(HELLO_MANIFEST.format(widget_id="Hello_World"))


class TestLoading:
    def test_a_broken_package_is_reported_and_the_others_still_load(
        self, tmp_path: Path
    ) -> None:
        package(
            tmp_path,
            "good",
            HELLO_MANIFEST.format(widget_id="good"),
            HELLO_RENDERER.format(greeting="Hi"),
        )
        package(
            tmp_path,
            "broken",
            HELLO_MANIFEST.format(widget_id="broken"),
            "def render(:\n",
        )

        registry = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)

        assert "good" in registry.widget_types
        assert "broken" not in registry.widget_types
        assert [error.folder for error in registry.errors] == ["broken"]
        assert "sensor-card" in registry.widget_types

    def test_a_manifest_error_names_the_folder(self, tmp_path: Path) -> None:
        package(tmp_path, "odd", "api: 1\nid: odd\n", "RENDERER = None\n")

        registry = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)

        assert registry.errors[0].folder == "odd"
        assert registry.errors[0].message.startswith("odd/widget.yml:")

    def test_a_user_package_cannot_take_a_built_in_id(self, tmp_path: Path) -> None:
        package(
            tmp_path,
            "weather",
            HELLO_MANIFEST.format(widget_id="weather"),
            HELLO_RENDERER.format(greeting="Mine"),
        )

        registry = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)

        assert registry.package("weather").builtin
        assert "already installed" in registry.errors[0].message

    def test_a_package_needs_english_translations(self, tmp_path: Path) -> None:
        directory = package(
            tmp_path,
            "quiet",
            HELLO_MANIFEST.format(widget_id="quiet"),
            HELLO_RENDERER.format(greeting="Hi"),
        )
        (directory / "translations" / "en.json").unlink()

        registry = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)

        assert "en.json" in registry.errors[0].message

    def test_changed_code_is_really_loaded_again(self, tmp_path: Path) -> None:
        directory = package(
            tmp_path,
            "hello",
            HELLO_MANIFEST.format(widget_id="hello"),
            HELLO_RENDERER.format(greeting="one"),
        )
        first = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)
        (directory / "renderer.py").write_text(
            HELLO_RENDERER.format(greeting="two"), encoding="utf-8"
        )

        second = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)

        def greeting(registry: WidgetRegistry) -> object:
            context = type("Context", (), {"box": type("Box", (), {"x": 0, "y": 0})()})
            return registry.renderer("hello")(context)[0]["value"]  # type: ignore[arg-type]

        assert greeting(first) == "one"
        assert greeting(second) == "two"

    def test_a_package_may_read_data_only_through_a_provider_that_exists(
        self, tmp_path: Path
    ) -> None:
        text = HELLO_MANIFEST.format(widget_id="reader") + (
            "sources:\n  - key: things\n    label: Things\n"
            "    selector: { entity: {} }\n    data: nothing\n"
        )
        package(tmp_path, "reader", text, HELLO_RENDERER.format(greeting="Hi"))

        registry = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)

        assert "unknown data provider nothing" in registry.errors[0].message


class TestStoredWidgets:
    def validated(self, item: dict[str, Any]) -> dict[str, Any]:
        result = validate_dashboard(dashboard([item]), DEFAULT_REGISTRY)
        widget: dict[str, Any] = result["items"][0]["widget"]
        return widget

    def test_missing_options_take_their_default(self) -> None:
        widget = self.validated(widget_item("agenda"))

        assert widget["options"]["maxEvents"] == 5
        assert widget["options"]["groupByDay"] is True
        assert widget["sources"] == {"calendars": []}

    def test_picks_keep_their_order_and_per_source_fields(self) -> None:
        picks = [
            {"id": "calendar.b", "label": "Ola", "color": "red"},
            {"id": "calendar.a", "label": "Ala", "color": "black"},
        ]

        widget = self.validated(widget_item("agenda", sources={"calendars": picks}))

        assert widget["sources"]["calendars"] == picks

    @pytest.mark.parametrize(
        ("options", "message"),
        [
            ({"maxEvents": 0}, r"widget\.options\.maxEvents"),
            ({"maxEvents": "many"}, r"widget\.options\.maxEvents"),
            ({"groupByDay": "yes"}, r"widget\.options\.groupByDay"),
            ({"nothing": 1}, r"widget\.options\.nothing"),
        ],
    )
    def test_invalid_options_name_the_option(
        self, options: dict[str, Any], message: str
    ) -> None:
        with pytest.raises(DashboardValidationError, match=message):
            self.validated(widget_item("agenda", options=options))

    def test_a_select_option_only_takes_its_choices(self) -> None:
        with pytest.raises(DashboardValidationError, match="forecastType"):
            self.validated(widget_item("weather", options={"forecastType": "monthly"}))

    def test_too_many_picks_are_rejected(self) -> None:
        picks = [{"id": f"calendar.c{index}"} for index in range(11)]

        with pytest.raises(DashboardValidationError, match=r"sources\.calendars"):
            self.validated(widget_item("agenda", sources={"calendars": picks}))

    def test_an_unknown_source_or_per_source_field_is_rejected(self) -> None:
        with pytest.raises(DashboardValidationError, match=r"sources\.things"):
            self.validated(widget_item("agenda", sources={"things": []}))
        picks = [{"id": "calendar.a", "weight": 3}]
        with pytest.raises(DashboardValidationError, match=r"\.weight"):
            self.validated(widget_item("agenda", sources={"calendars": picks}))

    def test_a_widget_that_is_not_installed_keeps_everything_it_had(self) -> None:
        stored = widget_item(
            "gone",
            sources={"things": [{"id": "sensor.a", "label": "A"}]},
            options={"shape": "round"},
        )

        widget = self.validated(stored)

        assert widget["sources"] == {"things": [{"id": "sensor.a", "label": "A"}]}
        assert widget["options"] == {"shape": "round"}


async def test_a_missing_widget_is_drawn_as_a_placeholder_with_a_warning(
    hass: HomeAssistant,
) -> None:
    compiled = await compile_widget(hass, widget_item("gone"))

    assert "gone" in texts(compiled)
    assert any(element["type"] == "line" for element in compiled.elements)
    assert compiled.warnings == ["gone_1: widget gone is not installed"]
    assert compiled.item_bounds["w"] == FRAME


async def test_reloading_swaps_the_registry_for_every_user(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    hass.config.config_dir = str(tmp_path)

    class Data:
        widgets = DEFAULT_REGISTRY
        dashboards = type("Store", (), {"registry": DEFAULT_REGISTRY})()

    hass.data[DOMAIN] = Data()
    installed = Path(hass.config.path(DOMAIN, "widgets"))
    package(
        installed,
        "hello",
        HELLO_MANIFEST.format(widget_id="hello"),
        HELLO_RENDERER.format(greeting="Hi"),
    )

    registry = await async_reload_widgets(hass)

    assert "hello" in registry.widget_types
    assert hass.data[DOMAIN].widgets is registry
    assert hass.data[DOMAIN].dashboards.registry is registry


class TestSensorCard:
    def states(self, hass: HomeAssistant) -> None:
        hass.states.async_set(
            "sensor.kitchen",
            "21.456",
            {"friendly_name": "Kitchen", "unit_of_measurement": "°C"},
        )
        hass.states.async_set(
            "sensor.hall",
            "48",
            {"friendly_name": "Hall", "unit_of_measurement": "%"},
        )

    async def test_one_entity_is_a_tile_with_its_value_and_unit(
        self, hass: HomeAssistant
    ) -> None:
        self.states(hass)
        item = widget_item(
            "sensor-card", sources={"entities": [{"id": "sensor.kitchen"}]}
        )

        compiled = await compile_widget(hass, item)

        assert texts(compiled) == ["Kitchen", "21.456 °C"]
        assert compiled.warnings == []

    async def test_decimals_and_unit_options_change_what_is_shown(
        self, hass: HomeAssistant
    ) -> None:
        self.states(hass)
        item = widget_item(
            "sensor-card",
            sources={"entities": [{"id": "sensor.kitchen"}]},
            options={"decimals": "1", "showUnit": False, "showName": False},
        )

        compiled = await compile_widget(hass, item)

        assert texts(compiled) == ["21.5"]

    async def test_a_label_overrides_the_entity_name(self, hass: HomeAssistant) -> None:
        self.states(hass)
        picks = [{"id": "sensor.kitchen", "label": "Cooking"}]

        compiled = await compile_widget(
            hass, widget_item("sensor-card", sources={"entities": picks})
        )

        assert texts(compiled)[0] == "Cooking"

    async def test_a_value_beyond_a_threshold_takes_the_alert_color(
        self, hass: HomeAssistant
    ) -> None:
        self.states(hass)
        item = widget_item(
            "sensor-card",
            sources={"entities": [{"id": "sensor.hall"}]},
            options={"alertAbove": "40", "alertColor": "red"},
        )

        compiled = await compile_widget(hass, item)

        value = next(
            e for e in compiled.elements if e["type"] == "text" and "%" in e["value"]
        )
        assert value["color"] == "red"

    async def test_a_list_has_one_row_per_entity(self, hass: HomeAssistant) -> None:
        self.states(hass)
        picks = [{"id": "sensor.kitchen"}, {"id": "sensor.hall"}]
        item = widget_item(
            "sensor-card",
            sources={"entities": picks},
            options={"layout": "list"},
        )

        compiled = await compile_widget(hass, item)

        assert texts(compiled) == ["Kitchen", "21.456 °C", "Hall", "48 %"]

    async def test_a_grid_has_one_tile_per_entity(self, hass: HomeAssistant) -> None:
        self.states(hass)
        picks = [{"id": "sensor.kitchen"}, {"id": "sensor.hall"}]
        item = widget_item(
            "sensor-card",
            sources={"entities": picks},
            options={"layout": "grid"},
        )

        compiled = await compile_widget(hass, item)

        assert sum(e["type"] == "rectangle" for e in compiled.elements) == 2

    async def test_an_unknown_entity_shows_as_unavailable(
        self, hass: HomeAssistant
    ) -> None:
        item = widget_item("sensor-card", sources={"entities": [{"id": "sensor.gone"}]})

        compiled = await compile_widget(hass, item)

        assert "—" in " ".join(texts(compiled))

    async def test_without_entities_it_says_what_to_do(
        self, hass: HomeAssistant
    ) -> None:
        compiled = await compile_widget(hass, widget_item("sensor-card"))
        polish = await compile_widget(hass, widget_item("sensor-card"), "pl")

        assert texts(compiled) == ["Choose entities"]
        assert texts(polish) == ["Wybierz encje"]

    async def test_the_entities_are_reported_for_live_refresh(
        self, hass: HomeAssistant
    ) -> None:
        self.states(hass)
        item = widget_item("sensor-card", sources={"entities": [{"id": "sensor.hall"}]})

        compiled = await compile_widget(hass, item)

        assert compiled.dependencies.entities == {"sensor.hall"}


def calendar_event(
    summary: str, start_offset: timedelta, length: timedelta, **extra: Any
) -> dict[str, Any]:
    start = dt_util.now().replace(microsecond=0) + start_offset
    return {
        "summary": summary,
        "start": start.isoformat(),
        "end": (start + length).isoformat(),
        **extra,
    }


def serve_calendars(
    hass: HomeAssistant, events: dict[str, list[dict[str, Any]]]
) -> list[ServiceCall]:
    calls: list[ServiceCall] = []

    async def get_events(call: ServiceCall) -> dict[str, Any]:
        calls.append(call)
        entity_id = call.data["entity_id"]
        return {entity_id: {"events": events.get(entity_id, [])}}

    hass.services.async_register(
        "calendar", "get_events", get_events, supports_response=SupportsResponse.ONLY
    )
    return calls


class TestAgenda:
    def picks(self) -> dict[str, Any]:
        return {
            "calendars": [
                {"id": "calendar.ola", "label": "Ola", "color": "red"},
                {"id": "calendar.jan", "label": "Jan", "color": "black"},
            ]
        }

    async def test_events_of_all_calendars_are_merged_into_one_sorted_list(
        self, hass: HomeAssistant
    ) -> None:
        serve_calendars(
            hass,
            {
                "calendar.ola": [
                    calendar_event("Piano", timedelta(hours=5), timedelta(hours=1)),
                    calendar_event("Swimming", timedelta(hours=2), timedelta(hours=1)),
                ],
                "calendar.jan": [
                    calendar_event("Football", timedelta(hours=3), timedelta(hours=1)),
                ],
            },
        )
        options = {"groupByDay": False, "showTime": False}

        compiled = await compile_widget(
            hass, widget_item("agenda", sources=self.picks(), options=options)
        )

        titles = [t for t in texts(compiled) if t not in {"Ola", "Jan"}]
        assert titles == ["Swimming", "Football", "Piano"]

    async def test_each_row_carries_the_label_of_its_calendar(
        self, hass: HomeAssistant
    ) -> None:
        serve_calendars(
            hass,
            {
                "calendar.jan": [
                    calendar_event("Football", timedelta(hours=1), timedelta(hours=1))
                ]
            },
        )

        compiled = await compile_widget(
            hass, widget_item("agenda", sources=self.picks())
        )

        title = next(e for e in compiled.elements if e.get("value") == "Football")
        label = next(e for e in compiled.elements if e.get("value") == "Jan")
        assert label["x"] > title["x"]

    async def test_only_the_first_events_up_to_the_limit_are_shown(
        self, hass: HomeAssistant
    ) -> None:
        events = [
            calendar_event(f"Event {n}", timedelta(hours=n + 1), timedelta(hours=1))
            for n in range(8)
        ]
        serve_calendars(hass, {"calendar.ola": events})
        options = {"maxEvents": 3, "groupByDay": False, "showTime": False}
        picks = {"calendars": [{"id": "calendar.ola"}]}

        compiled = await compile_widget(
            hass, widget_item("agenda", sources=picks, options=options)
        )

        assert texts(compiled) == ["Event 0", "Event 1", "Event 2"]

    async def test_finished_events_are_left_out(self, hass: HomeAssistant) -> None:
        serve_calendars(
            hass,
            {
                "calendar.ola": [
                    calendar_event("Done", timedelta(hours=-3), timedelta(hours=1)),
                    calendar_event("Now", timedelta(minutes=-10), timedelta(hours=1)),
                ]
            },
        )
        options = {"groupByDay": False, "showTime": False}
        picks = {"calendars": [{"id": "calendar.ola"}]}

        compiled = await compile_widget(
            hass, widget_item("agenda", sources=picks, options=options)
        )

        assert texts(compiled) == ["Now"]

    async def test_all_day_events_come_first_within_their_day(
        self, hass: HomeAssistant
    ) -> None:
        today = dt_util.now().date()
        serve_calendars(
            hass,
            {
                "calendar.ola": [
                    calendar_event("Late", timedelta(hours=1), timedelta(minutes=30)),
                    {
                        "summary": "Holiday",
                        "start": today.isoformat(),
                        "end": (today + timedelta(days=1)).isoformat(),
                    },
                ]
            },
        )
        options = {"groupByDay": False, "showTime": False}
        picks = {"calendars": [{"id": "calendar.ola"}]}

        compiled = await compile_widget(
            hass, widget_item("agenda", sources=picks, options=options)
        )

        assert texts(compiled) == ["Holiday", "Late"]

    async def test_days_get_a_header_in_the_dashboard_language(
        self, hass: HomeAssistant
    ) -> None:
        serve_calendars(
            hass,
            {
                "calendar.ola": [
                    calendar_event(
                        "Later", timedelta(days=1, hours=12), timedelta(hours=1)
                    )
                ]
            },
        )
        picks = {"calendars": [{"id": "calendar.ola"}]}

        english = await compile_widget(hass, widget_item("agenda", sources=picks))
        polish = await compile_widget(hass, widget_item("agenda", sources=picks), "pl")

        assert "Tomorrow" in texts(english) or len(texts(english)) > 1
        assert "Jutro" in texts(polish) or len(texts(polish)) > 1

    async def test_the_look_ahead_option_reaches_the_calendar_request(
        self, hass: HomeAssistant
    ) -> None:
        calls = serve_calendars(hass, {})
        picks = {"calendars": [{"id": "calendar.ola"}]}

        await compile_widget(
            hass, widget_item("agenda", sources=picks, options={"days": 3})
        )

        span = calls[0].data["end_date_time"] - calls[0].data["start_date_time"]
        assert span == timedelta(days=3)

    async def test_the_same_calendar_is_asked_once_for_several_widgets(
        self, hass: HomeAssistant
    ) -> None:
        calls = serve_calendars(hass, {})
        picks = {"calendars": [{"id": "calendar.ola"}]}
        value = dashboard(
            [
                widget_item("agenda", sources=picks, item_id="a"),
                widget_item("agenda", sources=picks, item_id="b"),
            ]
        )
        validated = validate_dashboard(value, DEFAULT_REGISTRY)

        await async_compile_dashboard(hass, validated, DEFAULT_REGISTRY)

        assert len(calls) == 1

    async def test_no_events_shows_the_empty_text(self, hass: HomeAssistant) -> None:
        serve_calendars(hass, {})
        picks = {"calendars": [{"id": "calendar.ola"}]}

        default = await compile_widget(hass, widget_item("agenda", sources=picks))
        custom = await compile_widget(
            hass,
            widget_item("agenda", sources=picks, options={"emptyText": "Free day"}),
        )

        assert texts(default) == ["No upcoming events"]
        assert texts(custom) == ["Free day"]

    async def test_without_calendars_it_says_what_to_do(
        self, hass: HomeAssistant
    ) -> None:
        compiled = await compile_widget(hass, widget_item("agenda"))

        assert texts(compiled) == ["Choose calendars"]

    async def test_a_failing_calendar_becomes_a_warning_not_a_crash(
        self, hass: HomeAssistant
    ) -> None:
        picks = {"calendars": [{"id": "calendar.ola"}]}

        compiled = await compile_widget(hass, widget_item("agenda", sources=picks))

        assert texts(compiled) == ["No upcoming events"]
        assert compiled.warnings

    async def test_long_titles_are_cut_to_the_row(self, hass: HomeAssistant) -> None:
        serve_calendars(
            hass,
            {
                "calendar.ola": [
                    calendar_event("Very " * 40, timedelta(hours=1), timedelta(hours=1))
                ]
            },
        )
        picks = {"calendars": [{"id": "calendar.ola"}]}
        options = {"groupByDay": False}

        compiled = await compile_widget(
            hass, widget_item("agenda", sources=picks, options=options)
        )

        title = max(texts(compiled), key=len)
        assert len(title) < len("Very " * 40)
        assert title.endswith(("…", "..."))


def weather_state(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "weather.home",
        "partlycloudy",
        {
            "friendly_name": "Home",
            "temperature": 18.4,
            "apparent_temperature": 16.0,
            "humidity": 62,
            "wind_speed": 12.0,
            "wind_speed_unit": "km/h",
            "temperature_unit": "°C",
        },
    )


def serve_forecast(hass: HomeAssistant, kinds: list[str]) -> None:
    async def get_forecasts(call: ServiceCall) -> dict[str, Any]:
        kinds.append(call.data["type"])
        start = dt_util.start_of_local_day()
        step = (
            timedelta(hours=1) if call.data["type"] == "hourly" else timedelta(days=1)
        )
        forecast = [
            {
                "datetime": (start + step * n).isoformat(),
                "condition": "sunny",
                "temperature": 20 + n,
                "templow": 10 + n,
            }
            for n in range(1, 30)
        ]
        return {call.data["entity_id"]: {"forecast": forecast}}

    hass.services.async_register(
        "weather",
        "get_forecasts",
        get_forecasts,
        supports_response=SupportsResponse.ONLY,
    )


class TestWeather:
    async def test_current_conditions_are_shown_in_words(
        self, hass: HomeAssistant
    ) -> None:
        weather_state(hass)
        serve_forecast(hass, [])

        compiled = await compile_widget(
            hass, widget_item("weather", sources={"weather": [{"id": "weather.home"}]})
        )

        assert "18°C" in texts(compiled)
        assert "Partly cloudy" in texts(compiled)
        assert "Humidity 62%" in texts(compiled)

    async def test_the_forecast_type_reaches_the_service_and_the_count_is_honoured(
        self, hass: HomeAssistant
    ) -> None:
        weather_state(hass)
        kinds: list[str] = []
        serve_forecast(hass, kinds)
        item = widget_item(
            "weather",
            sources={"weather": [{"id": "weather.home"}]},
            options={"forecastType": "hourly", "forecastItems": 3},
            frame={"x": 0, "y": 0, "width": 700, "height": 200},
        )

        compiled = await compile_widget(hass, item)

        assert kinds == ["hourly"]
        icons = [e for e in compiled.elements if e["type"] == "icon"]
        assert len(icons) == 1 + 3

    async def test_a_wide_frame_lays_the_forecast_out_in_columns(
        self, hass: HomeAssistant
    ) -> None:
        weather_state(hass)
        serve_forecast(hass, [])
        picks = {"weather": [{"id": "weather.home"}]}
        wide = widget_item(
            "weather",
            sources=picks,
            frame={"x": 0, "y": 0, "width": 640, "height": 200},
        )
        tall = widget_item(
            "weather",
            sources=picks,
            frame={"x": 0, "y": 0, "width": 240, "height": 400},
        )

        wide_icons = [
            e
            for e in (await compile_widget(hass, wide)).elements
            if e["type"] == "icon"
        ]
        tall_icons = [
            e
            for e in (await compile_widget(hass, tall)).elements
            if e["type"] == "icon"
        ]

        wide_rows = [e["y"] for e in wide_icons[1:]]
        assert max(wide_rows) - min(wide_rows) <= 1
        tall_columns = [e["x"] for e in tall_icons[1:]]
        assert max(tall_columns) - min(tall_columns) <= 1

    async def test_the_detail_options_add_lines(self, hass: HomeAssistant) -> None:
        weather_state(hass)
        serve_forecast(hass, [])
        item = widget_item(
            "weather",
            sources={"weather": [{"id": "weather.home"}]},
            options={"showFeelsLike": True, "showWind": True},
            frame={"x": 0, "y": 0, "width": 400, "height": 300},
        )

        compiled = await compile_widget(hass, item)

        assert "Feels like 16°C" in texts(compiled)
        assert "Wind 12 km/h" in texts(compiled)

    async def test_polish_words_are_used_for_a_polish_dashboard(
        self, hass: HomeAssistant
    ) -> None:
        weather_state(hass)
        serve_forecast(hass, [])
        item = widget_item(
            "weather",
            sources={"weather": [{"id": "weather.home"}]},
            frame={"x": 0, "y": 0, "width": 700, "height": 240},
        )

        compiled = await compile_widget(hass, item, "pl")

        assert "Częściowe zachmurzenie" in texts(compiled)

    async def test_a_missing_entity_says_the_weather_is_unavailable(
        self, hass: HomeAssistant
    ) -> None:
        item = widget_item("weather", sources={"weather": [{"id": "weather.gone"}]})

        compiled = await compile_widget(hass, item)

        assert texts(compiled) == ["Weather unavailable"]

    async def test_without_an_entity_it_says_what_to_do(
        self, hass: HomeAssistant
    ) -> None:
        compiled = await compile_widget(hass, widget_item("weather"))

        assert texts(compiled) == ["Choose a weather entity"]


def test_service_metadata_is_declared() -> None:
    root = BUILTIN_WIDGET_DIRECTORY.parent
    strings = json.loads((root / "strings.json").read_text(encoding="utf-8"))

    assert "reload_widgets" in strings["services"]
    assert (
        (root / "services.yaml")
        .read_text(encoding="utf-8")
        .startswith("reload_widgets:")
    )


PROVIDER_MANIFEST = """
api: 1
id: shelf
name: Shelf
version: 1.0.0
description: Reads books.
icon: mdi:book
provider: provider.py
layout:
  defaultSize: { width: 200, height: 100 }
  minSize: { width: 100, height: 50 }
sources:
  - key: books
    label: Books
    selector: { text: {} }
    data: "shelf:books"
"""

PROVIDER_CODE = """
from opendisplay_studio.data_providers import DataProvider


class Books(DataProvider):
    name = "books"

    async def async_fetch(self, hass, source_id, params, language):
        return {"title": source_id.upper()}


PROVIDER = Books()
"""

PROVIDER_RENDERER = """
from opendisplay_studio.sdk import text


def render(context):
    titles = [book["title"] for book in context.data["books"]]
    return [text(", ".join(titles), x=context.box.x, y=context.box.y)]


RENDERER = render
"""


async def test_a_package_can_ship_its_own_provider(
    hass: HomeAssistant, tmp_path: Path
) -> None:
    directory = package(tmp_path, "shelf", PROVIDER_MANIFEST, PROVIDER_RENDERER)
    (directory / "provider.py").write_text(PROVIDER_CODE, encoding="utf-8")
    registry = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY, tmp_path)
    item = widget_item("shelf", sources={"books": [{"id": "dune"}, {"id": "emma"}]})

    validated = validate_dashboard(dashboard([item]), registry)
    compiled = await async_compile_dashboard(hass, validated, registry)

    assert registry.errors == []
    assert texts(compiled) == ["DUNE, EMMA"]
