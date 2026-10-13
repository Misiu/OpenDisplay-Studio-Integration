"""Text sizes chosen for a value depend on its length, not on which digits it has."""

from __future__ import annotations

import pytest

from custom_components.opendisplay_studio.sdk import fit_text, text_width
from custom_components.opendisplay_studio.sdk.fitting import widest_digits

VALUES = ("24.1", "25.4", "23.8", "11.1", "88.8", "10.0", "19.9")


def test_the_widest_digit_stands_for_every_digit() -> None:
    steady = widest_digits("24.1 °C", 60)

    digits = {character for character in steady if character.isdigit()}
    assert len(digits) == 1
    assert steady.replace(next(iter(digits)), "0") == "00.0 °C"


@pytest.mark.parametrize("width", [60, 100, 160, 240])
def test_every_value_of_one_length_gets_the_same_size(width: int) -> None:
    sizes = {fit_text(value, width, 96, 10, steady_digits=True) for value in VALUES}

    assert len(sizes) == 1


@pytest.mark.parametrize("width", [60, 100, 160, 240])
def test_the_steady_size_fits_every_value_of_that_length(width: int) -> None:
    size = fit_text(VALUES[0], width, 96, 10, steady_digits=True)

    if size > 10:
        assert all(text_width(value, size) <= width for value in VALUES)


def test_without_the_option_the_size_follows_the_digits() -> None:
    sizes = {fit_text(value, 100, 96, 10) for value in VALUES}

    assert len(sizes) > 1
