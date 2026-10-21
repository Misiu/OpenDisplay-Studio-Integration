"""A renderer without TextMetrics gives a message a tester can act on."""

from __future__ import annotations

import importlib
from importlib.metadata import version

import odl_renderer  # type: ignore[import-untyped]
import pytest

from custom_components.opendisplay_studio import compat


def test_the_renderer_that_is_installed_is_new_enough() -> None:
    assert compat.renderer_problem() is None


def test_an_old_renderer_is_named_with_its_version_and_what_to_do(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delattr(odl_renderer, "TextMetrics")

    message = compat.renderer_problem()

    assert message is not None
    assert version("odl-renderer") in message
    assert "0.5.13 or newer" in message
    assert "restart Home Assistant" in message


def test_the_integration_does_not_import_next_to_an_old_renderer(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delattr(odl_renderer, "TextMetrics")

    with pytest.raises(ImportError, match=r"needs odl-renderer 0\.5\.13 or newer"):
        importlib.reload(compat)

    monkeypatch.undo()
    importlib.reload(compat)
