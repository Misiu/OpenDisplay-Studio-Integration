"""Guard: the word "project" must not appear anywhere we control."""

from __future__ import annotations

import os
from pathlib import Path

FORBIDDEN = "project"
ROOT = Path(__file__).resolve().parents[1]
SKIPPED_DIRS = {
    ".git",
    ".claude",
    ".venv",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    "__pycache__",
    "node_modules",
    "playwright-report",
    "test-results",
    "frontend",  # build output of frontend-src
    "licenses",  # third-party license texts
    "ha-frontend",  # vendored Home Assistant frontend guidance
}
# Names imposed by tools, and the two policy files that must name the word to forbid it.
SKIPPED_FILES = {
    "pyproject.toml",
    "package-lock.json",
    "playwright.config.ts",  # Playwright imposes `projects` and `{projectName}`
    "CLAUDE.md",
    "ROADMAP.md",
    "test_vocabulary.py",
}
TEXT_SUFFIXES = {
    ".py",
    ".ts",
    ".js",
    ".json",
    ".md",
    ".css",
    ".html",
    ".yml",
    ".yaml",
    ".toml",
    ".txt",
}


def _walk() -> list[Path]:
    """Every checked file and directory; skipped directories are never entered."""
    found: list[Path] = []
    for directory, subdirs, files in os.walk(ROOT):
        subdirs[:] = [name for name in subdirs if name not in SKIPPED_DIRS]
        found.extend(Path(directory, name) for name in (*subdirs, *files))
    return [path for path in found if path.name not in SKIPPED_FILES]


def test_source_tree_uses_dashboard_vocabulary() -> None:
    offenders = [
        f"{path.relative_to(ROOT)}:{number}"
        for path in _walk()
        if path.is_file() and path.suffix in TEXT_SUFFIXES
        for number, line in enumerate(
            path.read_text(encoding="utf-8", errors="ignore").splitlines(), start=1
        )
        if FORBIDDEN in line.casefold()
    ]
    assert not offenders, f"Use 'dashboard', not 'project': {offenders[:20]}"


def test_file_names_use_dashboard_vocabulary() -> None:
    offenders = [
        str(path.relative_to(ROOT))
        for path in _walk()
        if FORBIDDEN in path.name.casefold()
    ]
    assert not offenders, f"Rename files: {offenders}"
