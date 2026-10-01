"""Field validators shared by dashboards and primitive definitions."""

from __future__ import annotations

from typing import NoReturn

from custom_components.opendisplay_studio.palette import SUPPORTED_COLORS

MAX_TEXT_LENGTH = 4096
MAX_EXPRESSION_LENGTH = 2048
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


ROTATIONS = (0, 90, 180, 270)
MAX_DEVICE_ID_LENGTH = 64


def rotation(value: object) -> int:
    """Return the clockwise turn, in degrees, a picture gets before it is sent."""
    if isinstance(value, bool) or value not in ROTATIONS:
        fail(f"display.rotation must be one of {', '.join(map(str, ROTATIONS))}")
    return int(value)


def device_id(value: object) -> str | None:
    """Return the id of the device a dashboard is sent to, or `None` for no device."""
    if value is None:
        return None
    return string(value, "display.deviceId", MAX_DEVICE_ID_LENGTH)


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


def is_expression(value: object) -> bool:
    """Return whether a value is a Home Assistant template (`{{ }}` or `{% %}`)."""
    return isinstance(value, str) and ("{{" in value or "{%" in value)


def expression(value: object, name: str) -> str:
    """Return a template unchanged; only its type and length are checked."""
    if not is_expression(value):
        fail(f"{name} must be a template ({{{{ … }}}} or {{% … %}})")
    assert isinstance(value, str)
    if len(value) > MAX_EXPRESSION_LENGTH:
        fail(f"{name} must be at most {MAX_EXPRESSION_LENGTH} characters")
    return value


def single_expression_body(value: str) -> str | None:
    """Return the inside of a lone `{{ ... }}` template, or None for anything else."""
    text = value.strip()
    if not (text.startswith("{{") and text.endswith("}}")):
        return None
    body = text[2:-2]
    if any(token in body for token in ("{{", "}}", "{%", "%}")):
        return None
    return body.strip()
