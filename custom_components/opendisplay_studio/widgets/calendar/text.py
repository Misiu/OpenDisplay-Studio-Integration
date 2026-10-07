"""Text that fits a box: wrapped at words, cut with three dots."""

from __future__ import annotations

from typing import Final

from custom_components.opendisplay_studio.sdk import text_width

ELLIPSIS: Final = "..."
NEWLINE: Final = chr(10)


def shorten(word: str, width: int, size: int) -> str:
    """Cut `word` so that it fits `width` with the dots after it."""
    while word and text_width(word + ELLIPSIS, size) > width:
        word = word[:-1]
    return word + ELLIPSIS


def one_line(text: str, width: int, size: int) -> str:
    """Return `text` on a single line: whole if it fits, else cut with three dots."""
    text = " ".join(text.split())
    if text_width(text, size) <= width:
        return text
    return shorten(text.removesuffix(ELLIPSIS), width, size)


def wrap(text: str, width: int, size: int) -> list[str]:
    """Break `text` into lines no wider than `width`; a longer word is cut short."""
    lines: list[str] = []
    line = ""
    for word in text.split():
        if text_width(word, size) > width:
            word = shorten(word, width, size)  # noqa: PLW2901 - the cut word replaces it
        candidate = f"{line} {word}".strip()
        if text_width(candidate, size) <= width:
            line = candidate
            continue
        lines.append(line)
        line = word
    if line:
        lines.append(line)
    return lines


def clip(text: str, width: int, size: int, max_lines: int) -> list[str]:
    """Return `text` as at most `max_lines` lines; the last one ends in three dots."""
    lines = wrap(text, width, size)
    if len(lines) <= max_lines:
        return lines
    last = lines[max_lines - 1].removesuffix(ELLIPSIS)
    return [*lines[: max_lines - 1], shorten(last, width, size)]
