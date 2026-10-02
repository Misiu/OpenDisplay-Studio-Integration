"""
The file a dashboard is exported to and imported from.

One JSON object holds the design of a dashboard: its name, display and elements. It
carries nothing of the installation it came from (no store id, no timestamps, no
device), so it can be imported into any dashboard of any installation.
"""

from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime
from typing import Any, Final

FILE_FORMAT: Final = "opendisplay-studio-dashboard"
FILE_VERSION: Final = 1
# What belongs to an installation, not to a design.
INSTALLATION_DISPLAY_KEYS: Final = frozenset({"deviceId"})


class DashboardFileError(ValueError):
    """A file is not a dashboard this version can read."""

    def __init__(self, code: str, message: str) -> None:
        """Keep the stable `code` the panel shows a message for."""
        super().__init__(message)
        self.code = code


def export_file(dashboard: dict[str, Any]) -> dict[str, Any]:
    """Return the file for a validated dashboard."""
    display = {
        key: value
        for key, value in dashboard["display"].items()
        if key not in INSTALLATION_DISPLAY_KEYS
    }
    return {
        "format": FILE_FORMAT,
        "version": FILE_VERSION,
        "exportedAt": datetime.now(UTC).isoformat(),
        "dashboard": {
            "name": dashboard["name"],
            "display": display,
            "items": deepcopy(dashboard["items"]),
        },
    }


def read_file(raw: object) -> dict[str, Any]:
    """Return the `dashboard` of a file, or refuse the file with a reason."""
    if not isinstance(raw, dict) or raw.get("format") != FILE_FORMAT:
        raise DashboardFileError(
            "not_a_dashboard_file", "This is not an OpenDisplay Studio dashboard file"
        )
    version = raw.get("version")
    if not isinstance(version, int) or isinstance(version, bool) or version < 1:
        raise DashboardFileError("not_a_dashboard_file", "The file has no version")
    if version > FILE_VERSION:
        raise DashboardFileError(
            "file_too_new",
            "The file was made by a newer version of OpenDisplay Studio; update the "
            "integration to import it",
        )
    dashboard = raw.get("dashboard")
    if not isinstance(dashboard, dict) or not isinstance(dashboard.get("items"), list):
        raise DashboardFileError("not_a_dashboard_file", "The file has no elements")
    if not isinstance(dashboard.get("display"), dict):
        raise DashboardFileError("not_a_dashboard_file", "The file has no display")
    return deepcopy(dashboard)
