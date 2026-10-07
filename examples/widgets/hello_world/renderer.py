"""Hello world: a greeting that fits its frame."""

from __future__ import annotations

from typing import Any

from opendisplay_studio.sdk import Look, WidgetContext, compose, fit_text

PADDING = 8


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Describe a framed column with the greeting centered; odl-layout draws it."""
    look = Look.of(context)
    box = context.box
    greeting = context.t("greeting", who=context.options["who"])
    size = fit_text(greeting, box.width - 4 * PADDING, maximum=box.height // 2)
    return compose(
        context,
        {
            "type": "column",
            "justify": "center",
            "padding": PADDING,
            **look.frame(),
            "children": [look.text(greeting, size=size, align="center", truncate=True)],
        },
    )


RENDERER = render
