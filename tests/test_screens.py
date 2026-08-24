"""Tests for the two hardcoded POC documents."""

from unittest.mock import patch

from custom_components.opendisplay_studio.screens import (
    SCREENS,
    build_dashboard_screen,
    build_test_screen,
)


def test_exactly_two_screens_are_exposed() -> None:
    assert list(SCREENS) == ["test", "dashboard"]


def test_test_screen_contains_fresh_time() -> None:
    with patch("custom_components.opendisplay_studio.screens.dt_util.now") as mock_now:
        mock_now.return_value.strftime.return_value = "14:32:07"
        html = build_test_screen()
    assert "14:32:07" in html
    assert "OpenDisplay Studio" in html


def test_dashboard_exercises_layout_regions() -> None:
    html = build_dashboard_screen()
    assert "display: grid" in html
    assert "21.4°C" in html
    assert "Production meeting" in html
    assert "overflow: hidden" in html
