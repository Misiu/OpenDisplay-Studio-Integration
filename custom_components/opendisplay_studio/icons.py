"""The Material Design icons the renderer can draw, from its own icon index."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Final

import odl_renderer  # type: ignore[import-untyped]

MDI_PREFIX: Final = "mdi:"

_INDEX: Final[dict[str, str]] = json.loads(
    (
        Path(odl_renderer.__file__).parent
        / "assets"
        / "materialdesignicons-webfont_meta.json"
    ).read_text(encoding="utf-8")
)

ICON_NAMES: Final[frozenset[str]] = frozenset(_INDEX)
SORTED_ICON_NAMES: Final[list[str]] = sorted(_INDEX)


def icon_name(value: str) -> str:
    """Return an icon name without the `mdi:` prefix the renderer also accepts."""
    return value.removeprefix(MDI_PREFIX)
