"""Tests for release/manifest version synchronization."""

import json
from pathlib import Path

import pytest

from custom_components.opendisplay_studio.const import INTEGRATION_VERSION
from scripts.validate_release import ReleaseValidationError, validate_release


def test_release_accepts_matching_v_tag(tmp_path) -> None:
    manifest = tmp_path / "manifest.json"
    manifest.write_text(json.dumps({"version": "0.1.0"}), encoding="utf-8")
    assert validate_release("v0.1.0", manifest) == "0.1.0"


def test_release_rejects_mismatch(tmp_path) -> None:
    manifest = tmp_path / "manifest.json"
    manifest.write_text(json.dumps({"version": "0.1.0"}), encoding="utf-8")
    with pytest.raises(ReleaseValidationError):
        validate_release("v0.2.0", manifest)


def test_panel_build_version_matches_release() -> None:
    assert INTEGRATION_VERSION == "0.9.5"


def test_panel_does_not_bundle_home_assistant_component_implementations() -> None:
    root = Path(__file__).parents[1]
    package = json.loads(
        (root / "frontend-src" / "package.json").read_text(encoding="utf-8")
    )
    package_lock = (root / "frontend-src" / "package-lock.json").read_text(
        encoding="utf-8"
    )
    bundle = (
        root
        / "custom_components"
        / "opendisplay_studio"
        / "frontend"
        / "opendisplay-studio.js"
    ).read_text(encoding="utf-8")
    assert "@home-assistant/webawesome" not in package.get("dependencies", {})
    assert "@home-assistant/webawesome" not in package_lock
    assert "node_modules/@home-assistant/webawesome" not in bundle
    assert "wa-icon" not in bundle
    assert 'customElements.define("wa-' not in bundle
    assert 'customElements.define("ha-' not in bundle
