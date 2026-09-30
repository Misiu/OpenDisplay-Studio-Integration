"""Field validators shared by dashboards and primitive definitions."""

from __future__ import annotations

from typing import NoReturn

from custom_components.opendisplay_studio.palette import SUPPORTED_COLORS

MAX_TEXT_LENGTH = 4096
COLORS = SUPPORTED_COLORS | {"accent", "transparent"}


class DashboardValidationError(ValueError):
    """A dashboard submitted by the frontend is invalid."""


def fail(message: str) -> NoReturn:
    """Reject the dashboard with a message naming the field."""
    raise DashboardValidationError(message)


def integer(value: object, name: str, minimum: int, maximum: int) -> int:
    """Return `value` when it is an integer (not a bool) inside the range."""
    if isinstance(value, bool) or not isinstance(value, int):
        fail(f"{name} must be an integer")
    if not minimum <= value <= maximum:
        fail(f"{name} must be between {minimum} and {maximum}")
    return value


def string(value: object, name: str, maximum: int = MAX_TEXT_LENGTH) -> str:
    """Return `value` stripped, when it is a non-empty string of allowed length."""
    if not isinstance(value, str):
        fail(f"{name} must be a string")
    result = value.strip()
    if not result or len(result) > maximum:
        fail(f"{name} must contain 1-{maximum} characters")
    return result


def boolean(value: object, name: str) -> bool:
    """Return `value` when it is a bool."""
    if not isinstance(value, bool):
        fail(f"{name} must be a boolean")
    return value


def color(value: object, name: str, *, allow_none: bool = False) -> str | None:
    """Return a supported colour name; `None` and "transparent" only if allowed."""
    if allow_none and (value is None or value == "transparent"):
        return None
    if not isinstance(value, str) or value not in COLORS - {"transparent"}:
        fail(f"{name} is not a supported palette color")
    return value
