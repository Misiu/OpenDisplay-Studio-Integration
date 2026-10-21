"""The description of a release is its CHANGELOG entry."""

from __future__ import annotations

from pathlib import Path

import pytest

from custom_components.opendisplay_studio.const import INTEGRATION_VERSION
from scripts.release_notes import release_notes

CHANGELOG = """# Changelog

## Unreleased

## 0.2.0

- Newer change.

## 0.1.1

- First fix.
- Second fix.

## 0.1.0

The first release.
"""


@pytest.fixture
def changelog(tmp_path: Path) -> Path:
    path = tmp_path / "CHANGELOG.md"
    path.write_text(CHANGELOG, encoding="utf-8")
    return path


def test_the_notes_are_the_entry_of_that_version_only(changelog: Path) -> None:
    assert release_notes("v0.1.1", changelog) == "- First fix.\n- Second fix."


def test_the_last_entry_runs_to_the_end_of_the_file(changelog: Path) -> None:
    assert release_notes("v0.1.0", changelog) == "The first release."


def test_a_tag_without_the_v_prefix_works_too(changelog: Path) -> None:
    assert release_notes("0.2.0", changelog) == "- Newer change."


@pytest.mark.parametrize("tag", ["v9.9.9", "v0.1", "vUnreleased"])
def test_a_version_without_an_entry_is_refused(changelog: Path, tag: str) -> None:
    with pytest.raises(ValueError, match="no entry"):
        release_notes(tag, changelog)


def test_the_real_changelog_describes_the_current_release() -> None:
    assert release_notes(INTEGRATION_VERSION)
