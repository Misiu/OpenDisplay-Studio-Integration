"""Tests for release/manifest version synchronization."""

import json

import pytest

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
