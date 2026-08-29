"""Localized current-date provider owned by the Section Title widget."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, cast

from babel.core import UnknownLocaleError
from babel.dates import format_date
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

TRANSLATIONS_DIRECTORY = Path(__file__).with_name("translations")


def _load_labels(language: str) -> dict[str, str]:
    """Load English labels and overlay the requested widget locale."""
    labels = json.loads(
        (TRANSLATIONS_DIRECTORY / "en.json").read_text(encoding="utf-8")
    )
    for candidate in dict.fromkeys((language.partition("-")[0], language)):
        path = TRANSLATIONS_DIRECTORY / f"{candidate}.json"
        if candidate != "en" and path.is_file():
            localized = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(localized, dict):
                labels.update(localized)
    return {str(key): str(value) for key, value in labels.items()}


def _localized_date(language: str, labels: dict[str, str]) -> dict[str, str]:
    """Format the current Home Assistant-local date for the widget."""
    current = dt_util.now().date()
    locale = language.replace("-", "_")
    try:
        weekday = format_date(current, "EEEE", locale=locale)
        date_label = format_date(current, labels["date_format"], locale=locale)
    except UnknownLocaleError, ValueError:
        weekday = current.strftime("%A")
        date_label = f"{current.day} {current.strftime('%b %Y')}"
    return {"weekday": weekday.upper(), "date": date_label.upper()}


class SectionTitleDataProvider:
    """Resolve one localized current date per composition pass."""

    name = "section_title"

    def new_request(self) -> set[str]:
        """Create the provider request container."""
        return set()

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None:
        """Record that the current date is required."""
        del sources, config, requirement
        cast("set[str]", request).add("current")

    async def async_resolve(
        self, hass: HomeAssistant, request: object, language: str
    ) -> dict[str, str]:
        """Create the date value without widget data in integration core."""
        del request
        labels = await hass.async_add_executor_job(_load_labels, language)
        return _localized_date(language, labels)

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]:
        """Map the single composition value to one widget instance."""
        del sources, config, requirement
        return [dict(cast("dict[str, str]", resolved))]


PROVIDER = SectionTitleDataProvider()
