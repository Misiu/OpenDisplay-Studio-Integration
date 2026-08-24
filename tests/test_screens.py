"""Tests for Stage 2 TRMNL Framework documents."""

from unittest.mock import patch

from custom_components.opendisplay_studio.screens import (
    SCREENS,
    build_dashboard_screen,
    build_liquid_screen,
    build_test_screen,
)


def test_stage_two_screen_catalog_covers_profiles_and_palettes() -> None:
    assert len(SCREENS) == 10
    assert {(screen.width, screen.height) for screen in SCREENS.values()} >= {
        (296, 128),
        (800, 480),
        (1200, 825),
    }
    assert "screen--1bit" in SCREENS["trmnl_palette_bw"].builder().html
    assert "screen--color-3bwr" in SCREENS["trmnl_palette_bwr"].builder().html
    assert "screen--color-4bwry" in SCREENS["trmnl_palette_bwry"].builder().html


def test_test_screen_contains_fresh_time_and_polish_glyphs() -> None:
    with patch("custom_components.opendisplay_studio.screens.dt_util.now") as mock_now:
        mock_now.return_value.strftime.return_value = "14:32:07"
        html = build_test_screen()
    assert "14:32:07" in html
    assert "zażółć gęślą jaźń" in html
    assert "screen--1bit" in html


def test_dashboard_uses_framework_regions() -> None:
    html = build_dashboard_screen()
    assert "grid--cols-2" in html
    assert "21.4°C" in html
    assert "Production meeting" in html
    assert "title_bar" in html


def test_liquid_screen_is_dynamic_and_measured() -> None:
    with patch("custom_components.opendisplay_studio.screens.dt_util.now") as mock_now:
        mock_now.return_value.strftime.return_value = "09:41:03"
        built = build_liquid_screen()
    assert "09:41:03" in built.html
    assert "Liquid · Łódź" in built.html
    assert "Spotkanie produkcyjne" in built.html
    assert "{%" not in built.html
    assert built.liquid_ms >= 0
