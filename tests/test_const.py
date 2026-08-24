"""Tests for the verified current Supervisor slug mapping."""

from hashlib import sha1

from custom_components.opendisplay_studio.const import (
    ADDON_SLUG,
    APP_CONFIG_SLUG,
    APP_REPOSITORY_URL,
)


def test_addon_slug_matches_current_supervisor_algorithm() -> None:
    repository_slug = sha1(  # noqa: S324 - reproduces Supervisor identifier
        APP_REPOSITORY_URL.lower().encode()
    ).hexdigest()[:8]
    assert f"{repository_slug}_{APP_CONFIG_SLUG}" == ADDON_SLUG
