"""Tests for authoritative project validation and persistence."""

from unittest.mock import AsyncMock, patch

import pytest

from custom_components.opendisplay_studio.projects import (
    ProjectStore,
    ProjectValidationError,
    validate_project,
)


def project_payload() -> dict:
    return {
        "name": "Kitchen",
        "status": "draft",
        "displayId": "custom",
        "width": 800,
        "height": 480,
        "orientation": "landscape",
        "palette": "bw",
        "grid": {"columns": 2, "rows": 1},
        "regions": [
            {
                "id": "left",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "sensor",
                    "version": "0.6.0",
                    "config": {"entity": "sensor.office"},
                },
            },
            {
                "id": "right",
                "row": 1,
                "column": 2,
                "rowSpan": 1,
                "columnSpan": 1,
            },
        ],
    }


def test_validation_rejects_overlapping_regions() -> None:
    payload = project_payload()
    payload["regions"][1]["column"] = 1
    with pytest.raises(ProjectValidationError, match="overlap"):
        validate_project(payload)


def test_weather_widget_config_is_normalized() -> None:
    payload = project_payload()
    payload["regions"][0]["widget"] = {
        "type": "weather",
        "version": "0.5.0",
        "config": {
            "weather": "weather.home",
            "showHumidity": False,
            "showFeelsLike": True,
            "showForecast": True,
        },
    }

    result = validate_project(payload)

    assert result["regions"][0]["widget"] == {
        "type": "weather",
        "version": "0.5.0",
        "config": {
            "weather": "weather.home",
            "showHumidity": False,
            "showFeelsLike": True,
            "showForecast": True,
        },
    }


def test_widget_version_requires_semver() -> None:
    payload = project_payload()
    payload["regions"][0]["widget"]["version"] = 4

    with pytest.raises(ProjectValidationError, match="semantic version"):
        validate_project(payload)


def test_project_language_defaults_to_system_and_accepts_bcp47() -> None:
    payload = project_payload()

    assert validate_project(payload)["language"] == "system"

    payload["language"] = "pt-BR"
    assert validate_project(payload)["language"] == "pt-BR"


def test_display_preferences_have_safe_defaults() -> None:
    result = validate_project(project_payload())

    assert result["theme"] == "light"
    assert result["fontFamily"] == "default"
    assert result["textScale"] == "regular"


@pytest.mark.parametrize(
    ("key", "value"),
    [
        ("theme", "system"),
        ("fontFamily", "comic-sans"),
        ("textScale", "tiny"),
    ],
)
def test_display_preferences_reject_unknown_values(key: str, value: str) -> None:
    payload = project_payload()
    payload[key] = value

    with pytest.raises(ProjectValidationError, match=key):
        validate_project(payload)


@pytest.mark.parametrize("language", ["", "polish", "../pl", "pl_PL"])
def test_project_language_rejects_invalid_values(language: str) -> None:
    payload = project_payload()
    payload["language"] = language

    with pytest.raises(ProjectValidationError, match="language"):
        validate_project(payload)


def test_ready_weather_widget_requires_weather_entity() -> None:
    payload = project_payload()
    payload["status"] = "ready"
    payload["regions"][0]["widget"] = {
        "type": "weather",
        "version": "0.5.0",
        "config": {"weather": "sensor.outdoor_temperature"},
    }

    with pytest.raises(ProjectValidationError, match="weather entity"):
        validate_project(payload)


async def test_project_identity_survives_rename_and_ready(hass) -> None:
    store = ProjectStore(hass)
    with patch.object(store._store, "async_save", AsyncMock()):
        created = await store.async_create(project_payload())
        payload = project_payload()
        payload.update({"name": "Main kitchen", "status": "ready"})
        updated = await store.async_update(created["id"], payload)

    assert updated["id"] == created["id"]
    assert updated["createdAt"] == created["createdAt"]
    assert updated["language"] == hass.config.language
    assert [item["name"] for item in store.list(ready_only=True)] == ["Main kitchen"]


async def test_projects_reload_from_versioned_store(hass) -> None:
    raw = {
        **project_payload(),
        "id": "stable-id",
        "createdAt": "2026-08-24T08:00:00+00:00",
        "updatedAt": "2026-08-24T08:30:00+00:00",
    }
    store = ProjectStore(hass)
    with patch.object(
        store._store, "async_load", AsyncMock(return_value={"projects": [raw]})
    ):
        await store.async_load()

    loaded = store.get("stable-id")
    assert loaded is not None
    assert loaded["name"] == "Kitchen"
    assert loaded["language"] == hass.config.language
    assert loaded["createdAt"] == "2026-08-24T08:00:00+00:00"
