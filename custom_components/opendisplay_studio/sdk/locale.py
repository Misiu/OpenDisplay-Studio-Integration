"""
Names of days and months, date patterns and state words, read from `locales/`.

Nothing language specific lives in Python: a language is one JSON file in
`locales/`, and a language without a file is shown in English.
"""

from __future__ import annotations

import json
from datetime import date
from functools import cache
from pathlib import Path
from typing import Any, Final

LOCALE_DIRECTORY: Final = Path(__file__).parent / "locales"
DEFAULT_LANGUAGE: Final = "en"
NUMERIC_STYLE: Final = "numeric"
FULL_STYLE: Final = "full"


@cache
def _read(code: str) -> dict[str, Any]:
    path = LOCALE_DIRECTORY / f"{code}.json"
    data: dict[str, Any] = json.loads(path.read_text(encoding="utf-8"))
    return data


def locale(language: str) -> dict[str, Any]:
    """Return the words of `language`, or of English when it has no file."""
    code = language.split("-", maxsplit=1)[0]
    if (LOCALE_DIRECTORY / f"{code}.json").is_file():
        return _read(code)
    return _read(DEFAULT_LANGUAGE)


def weekday_name(day: date, language: str, *, full: bool = False) -> str:
    """Return the weekday name, short unless `full`."""
    names = locale(language)["weekday"]["full" if full else "short"]
    return str(names[day.weekday()])


def month_name(month: int, language: str, form: str = "alone") -> str:
    """Return a month's name: `alone` ("October"), `of` (after a day) or `short`."""
    return str(locale(language)["month"][form][month - 1])


def _pattern(language: str, key: str, **fields: object) -> str:
    return str(locale(language)["format"][key]).format(**fields)


def day_heading(day: date, language: str, style: str) -> str:
    """Return a day as a heading: "Wed, Aug 12", "Wednesday, 12 August" or "12.08"."""
    if style == NUMERIC_STYLE:
        return f"{day.day}.{day.month:02d}"
    full = style == FULL_STYLE
    return _pattern(
        language,
        "day_full" if full else "day_short",
        weekday=weekday_name(day, language, full=full),
        day=day.day,
        month=month_name(day.month, language, "of" if full else "short"),
    )


def short_date(day: date, language: str) -> str:
    """Return a day with its month in short: "Aug 12"."""
    return _pattern(
        language,
        "day_month",
        day=day.day,
        month=month_name(day.month, language, "short"),
    )


def long_date(day: date, language: str) -> str:
    """Return a day with its month in words: "28 September"."""
    return _pattern(
        language,
        "long_date",
        day=day.day,
        month=month_name(day.month, language, "of"),
    )


def month_year(day: date, language: str) -> str:
    """Return the month and year on their own: "October 2026"."""
    return _pattern(
        language,
        "month_year",
        month=month_name(day.month, language, "alone"),
        year=day.year,
    )


def state_word(raw_state: str, language: str) -> str | None:
    """Return the word for a state such as `on` or `home`; None if there is none."""
    word = locale(language)["states"].get(raw_state)
    return None if word is None else str(word)
