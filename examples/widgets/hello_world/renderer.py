"""Hello world: a greeting that fits its frame."""

from __future__ import annotations

from typing import Any

from opendisplay_studio.sdk import WidgetContext, fit_text, rectangle, text


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw a border and the greeting, as large as the frame allows."""
    box = context.box
    greeting = context.t("greeting", who=context.options["who"])
    size = fit_text(greeting, box.width - 16, maximum=box.height // 2)
    return [
        rectangle(box, outline=context.options["color"]),
        text(
            greeting,
            x=box.x + box.width // 2,
            y=box.y + box.height // 2,
            size=size,
            color=context.options["color"],
            anchor="mm",
        ),
    ]


RENDERER = render
