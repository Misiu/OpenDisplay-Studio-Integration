"""Validate that a release tag matches the integration manifest version."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "custom_components" / "opendisplay_studio" / "manifest.json"
SEMVER_PATTERN = re.compile(
    r"^(0|[1-9]\d*)\."
    r"(0|[1-9]\d*)\."
    r"(0|[1-9]\d*)"
    r"(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?"
    r"(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$"
)


class ReleaseValidationError(ValueError):
    """A tag or manifest cannot be used to create a release."""


def validate_release(tag: str, manifest_path: Path = DEFAULT_MANIFEST) -> str:
    """Return the normalized version when tag and manifest are consistent."""
    version = tag.removeprefix("v")
    if not SEMVER_PATTERN.fullmatch(version):
        message = f"unsupported semantic version tag: {tag}"
        raise ReleaseValidationError(message)
    try:
        manifest: Any = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as err:
        message = f"cannot read manifest: {err}"
        raise ReleaseValidationError(message) from err
    if not isinstance(manifest, dict) or not isinstance(
        manifest_version := manifest.get("version"), str
    ):
        raise ReleaseValidationError("manifest has no string version")
    if manifest_version != version:
        message = f"tag version {version} does not match manifest {manifest_version}"
        raise ReleaseValidationError(message)
    return version


def main(argv: list[str] | None = None) -> int:
    """Validate a command-line tag."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tag")
    args = parser.parse_args(argv)
    try:
        version = validate_release(args.tag)
    except ReleaseValidationError as err:
        sys.stderr.write(f"Release validation failed: {err}\n")
        return 1
    sys.stdout.write(f"{version}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
