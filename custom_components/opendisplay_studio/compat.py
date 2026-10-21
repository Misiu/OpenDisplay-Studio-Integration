"""Fail with a clear message when another integration has loaded an old odl-renderer."""

from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version

import odl_renderer  # type: ignore[import-untyped]

MINIMUM_RENDERER = "0.5.13"


def renderer_problem() -> str | None:
    """
    Return what is wrong with the loaded odl-renderer, or None when it is new enough.

    Home Assistant keeps one copy of a package for every integration. The OpenDisplay
    integration from HACS pins an older odl-renderer, and whichever copy was imported
    first stays in memory, so the layout library of Studio can find itself next to a
    renderer without `TextMetrics`, which first shipped in 0.5.13.
    """
    if hasattr(odl_renderer, "TextMetrics"):
        return None
    try:
        installed = version("odl-renderer")
    except PackageNotFoundError:
        installed = "an unknown version"
    return (
        f"OpenDisplay Studio needs odl-renderer {MINIMUM_RENDERER} or newer, "
        f"but {installed} is loaded. The OpenDisplay integration from HACS pins an "
        "older odl-renderer and shares it with every integration: update it to a "
        f"version that uses odl-renderer {MINIMUM_RENDERER} or newer, "
        "then restart Home Assistant."
    )


if problem := renderer_problem():
    raise ImportError(problem)
