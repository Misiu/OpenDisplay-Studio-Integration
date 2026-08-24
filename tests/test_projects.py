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
                    "type": "entity-state",
                    "version": 1,
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


async def test_project_identity_survives_rename_and_ready(hass) -> None:
    store = ProjectStore(hass)
    with patch.object(store._store, "async_save", AsyncMock()):
        created = await store.async_create(project_payload())
        payload = project_payload()
        payload.update({"name": "Main kitchen", "status": "ready"})
        updated = await store.async_update(created["id"], payload)

    assert updated["id"] == created["id"]
    assert updated["createdAt"] == created["createdAt"]
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
    assert loaded["createdAt"] == "2026-08-24T08:00:00+00:00"
