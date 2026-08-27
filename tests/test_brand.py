"""Tests for locally bundled Home Assistant brand images."""

from pathlib import Path
from struct import unpack

BRAND = Path(__file__).parents[1] / "custom_components" / "opendisplay_studio" / "brand"


def _png_size(path: Path) -> tuple[int, int]:
    payload = path.read_bytes()
    assert payload.startswith(b"\x89PNG\r\n\x1a\n")
    assert payload[12:16] == b"IHDR"
    return unpack(">II", payload[16:24])


def test_local_brand_icons_match_home_assistant_dimensions() -> None:
    assert _png_size(BRAND / "icon.png") == (256, 256)
    assert _png_size(BRAND / "icon@2x.png") == (512, 512)
