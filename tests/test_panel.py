from pathlib import Path

from custom_components.opendisplay_studio.panel import _frontend_revision


def test_frontend_revision_changes_with_bundle_content(tmp_path: Path) -> None:
    bundle = tmp_path / "opendisplay-studio.js"
    bundle.write_text("first build", encoding="utf-8")
    first = _frontend_revision(bundle)

    bundle.write_text("second build", encoding="utf-8")
    second = _frontend_revision(bundle)

    assert len(first) == 12
    assert first != second
