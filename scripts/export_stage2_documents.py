"""Export final Stage 2 HTML to stdout for renderer visual verification."""

from __future__ import annotations

import json
import sys

from custom_components.opendisplay_studio.screens import SCREENS


def main() -> None:
    """Write the same final documents that Media Source sends to the App."""
    sys.stdout.write(
        json.dumps(
            [
                {
                    "id": identifier,
                    "html": screen.builder().html,
                    "width": screen.width,
                    "height": screen.height,
                }
                for identifier, screen in SCREENS.items()
            ],
            ensure_ascii=False,
        )
        + "\n"
    )


if __name__ == "__main__":
    main()
