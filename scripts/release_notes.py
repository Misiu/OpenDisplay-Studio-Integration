"""Print the CHANGELOG entry of a release, for the description of its GitHub release."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

CHANGELOG = Path(__file__).resolve().parents[1] / "CHANGELOG.md"


def release_notes(tag: str, changelog: Path = CHANGELOG) -> str:
    """Return the text under `## <version>` of a tag such as v0.1.1; raise if empty."""
    version = tag.removeprefix("v")
    text = changelog.read_text(encoding="utf-8")
    match = re.search(
        rf"^## {re.escape(version)}\s*\n(.*?)(?=^## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    notes = match.group(1).strip() if match else ""
    if not notes:
        message = f"CHANGELOG.md has no entry for {version}"
        raise ValueError(message)
    return notes


def main(argv: list[str] | None = None) -> int:
    """Print the notes of a tag given on the command line."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tag")
    args = parser.parse_args(argv)
    try:
        notes = release_notes(args.tag)
    except ValueError as err:
        sys.stderr.write(f"Release notes failed: {err}\n")
        return 1
    # The changelog has symbols such as ⌘: write UTF-8 on any console code page.
    sys.stdout.buffer.write(f"{notes}\n".encode())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
