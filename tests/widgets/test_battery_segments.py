"""The segments of a battery are all of one size; a bare battery fills its widget."""

from __future__ import annotations

from itertools import pairwise
from typing import Any

import pytest

from tests.widgets.test_battery import (
    TALL,
    WIDE,
    captions,
    drawn,
    drawn_state,
    glyphs,
    with_level,
    with_options,
)

CORNER = (96, 40)


async def render(
    level: str, size: tuple[int, int] = (296, 128), **options: Any
) -> list[dict[str, Any]]:
    state = with_options(
        with_level(level, lowLevel=0), {"style": "segments", **options}
    )
    _, elements = await drawn_state(state, size)
    return elements


def segments_of(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """The rounded segments: the most numerous rectangles of one size."""
    by_size: dict[tuple[int, int], list[dict[str, Any]]] = {}
    for element in elements:
        if element["type"] == "rectangle" and element.get("radius"):
            key = (
                element["x_end"] - element["x_start"],
                element["y_end"] - element["y_start"],
            )
            by_size.setdefault(key, []).append(element)
    return max(by_size.values(), key=len, default=[])


def full_ones(segments: list[dict[str, Any]]) -> int:
    return sum(1 for segment in segments if segment.get("fill"))


def sizes(segments: list[dict[str, Any]]) -> set[tuple[int, int]]:
    return {(s["x_end"] - s["x_start"], s["y_end"] - s["y_start"]) for s in segments}


async def test_a_wide_battery_has_ten_segments() -> None:
    assert len(segments_of(await render("87"))) == 10
    assert len(segments_of(await render("87", (800, 480)))) == 10


async def test_a_shorter_battery_has_fewer_segments() -> None:
    counts = [
        len(segments_of(await render("87", (width, 100))))
        for width in (400, 200, 140, 100)
    ]

    assert counts == sorted(counts, reverse=True)
    assert counts[0] == 10
    assert 3 <= counts[-1] < counts[0]


@pytest.mark.parametrize("width", range(70, 421, 7))
@pytest.mark.parametrize("level", ["30", "87"])
async def test_every_segment_has_the_same_size_at_any_width(
    width: int, level: str
) -> None:
    segments = segments_of(await render(level, (width, 90)))

    assert len(sizes(segments)) == 1
    assert len(segments) >= 3


@pytest.mark.parametrize("height", range(120, 421, 17))
async def test_every_segment_has_the_same_size_at_any_height_standing_up(
    height: int,
) -> None:
    segments = segments_of(await render("60", (90, height), orientation="vertical"))

    assert len(sizes(segments)) == 1
    assert len(segments) >= 3


@pytest.mark.parametrize(
    "options",
    [
        {},
        {"showName": False},
        {"showPercentage": False},
        {"percentagePlacement": "inside"},
        {"showName": False, "showPercentage": False},
        {"showFrame": False},
    ],
)
@pytest.mark.parametrize("level", ["0", "5", "50", "99", "100"])
async def test_the_segments_are_equal_whatever_is_drawn_with_them(
    options: dict[str, Any], level: str
) -> None:
    segments = segments_of(await render(level, (296, 128), **options))

    assert len(sizes(segments)) == 1


async def test_the_gaps_between_segments_are_equal_too() -> None:
    segments = sorted(segments_of(await render("50")), key=lambda s: s["x_start"])

    gaps = {
        later["x_start"] - earlier["x_end"] for earlier, later in pairwise(segments)
    }
    assert len(gaps) == 1


async def test_the_segments_lie_inside_the_body() -> None:
    elements = await render("50", WIDE)

    segments = segments_of(elements)
    body = max(
        (e for e in elements if e["type"] == "rectangle" and e.get("radius")),
        key=lambda e: (e["x_end"] - e["x_start"]) * (e["y_end"] - e["y_start"]),
    )
    assert min(s["x_start"] for s in segments) > body["x_start"]
    assert max(s["x_end"] for s in segments) < body["x_end"]
    assert min(s["y_start"] for s in segments) > body["y_start"]
    assert max(s["y_end"] for s in segments) < body["y_end"]


async def test_a_standing_battery_has_segments_one_above_the_other() -> None:
    segments = segments_of(await render("60", TALL))

    assert 3 <= len(segments) <= 10
    assert len({segment["x_start"] for segment in segments}) == 1
    assert len({segment["y_start"] for segment in segments}) == len(segments)


@pytest.mark.parametrize(
    ("level", "full"),
    [("0", 0), ("4", 1), ("14", 1), ("15", 2), ("50", 5), ("87", 9), ("100", 10)],
)
async def test_the_full_segments_follow_the_charge(level: str, full: int) -> None:
    assert full_ones(segments_of(await render(level))) == full


async def test_the_full_segments_come_first_from_the_left() -> None:
    segments = sorted(segments_of(await render("40")), key=lambda s: s["x_start"])

    assert [bool(s.get("fill")) for s in segments] == [True] * 4 + [False] * 6


async def test_a_standing_battery_fills_from_the_bottom() -> None:
    segments = sorted(segments_of(await render("40", TALL)), key=lambda s: s["y_start"])
    flags = [bool(s.get("fill")) for s in segments]

    assert flags == sorted(flags)
    assert flags[-1]
    assert not flags[0]


async def test_the_segments_are_rounded_like_the_body() -> None:
    elements = await render("50")

    segments = segments_of(elements)
    body_radius = max(
        e["radius"] for e in elements if e["type"] == "rectangle" and e.get("radius")
    )
    assert all(0 < segment["radius"] <= body_radius for segment in segments)


async def test_a_low_charge_is_drawn_in_the_highlight_color() -> None:
    state = with_options(with_level("12", lowLevel=20), {"style": "segments"})
    _, elements = await drawn_state(state)

    filled = [s for s in segments_of(elements) if s.get("fill")]
    assert filled
    assert {s["fill"] for s in filled} == {"accent"}


async def test_the_percentage_can_be_hidden_with_segments() -> None:
    elements = await render("87", showName=False, showPercentage=False)

    assert captions(elements) == []
    assert len(segments_of(elements)) == 10


async def test_segments_and_the_percentage_inside_go_together() -> None:
    elements = await render("50", percentagePlacement="inside", showName=False)

    (caption,) = glyphs(elements)
    assert caption["value"] == "50%"
    assert caption["stroke_fill"] == "white"
    assert len(segments_of(elements)) == 10


async def test_segments_do_not_change_the_text() -> None:
    solid = await drawn("charged")

    assert captions(solid[1]) == captions(await render("87"))


def box_of(elements: list[dict[str, Any]]) -> tuple[int, int, int, int]:
    rectangles = [e for e in elements if e["type"] == "rectangle"]
    return (
        min(r["x_start"] for r in rectangles),
        min(r["y_start"] for r in rectangles),
        max(r["x_end"] for r in rectangles),
        max(r["y_end"] for r in rectangles),
    )


async def bare(size: tuple[int, int], **options: Any) -> list[dict[str, Any]]:
    state = with_options(
        with_level("60", lowLevel=0),
        {"showName": False, "showPercentage": False, "showFrame": False, **options},
    )
    _, elements = await drawn_state(state, size)
    return elements


@pytest.mark.parametrize("size", [(60, 30), CORNER, WIDE, (300, 60)])
async def test_without_name_and_percentage_the_battery_fills_the_whole_widget(
    size: tuple[int, int],
) -> None:
    left, top, right, bottom = box_of(await bare(size))

    assert (left, top) == (0, 0)
    assert right >= size[0] - 2
    assert bottom >= size[1] - 2


async def test_a_standing_battery_without_text_fills_the_widget_too() -> None:
    left, top, right, bottom = box_of(await bare((40, 90)))

    assert (left, top) == (0, 0)
    assert right >= 38
    assert bottom >= 88


async def test_the_corner_battery_with_segments_has_equal_segments() -> None:
    segments = segments_of(await bare(CORNER, style="segments"))

    assert 3 <= len(segments) <= 10
    assert len(sizes(segments)) == 1
    assert all(segment["radius"] > 0 for segment in segments)


async def test_the_percentage_inside_keeps_a_bare_battery_whole() -> None:
    elements = await bare((120, 48), percentagePlacement="inside", showPercentage=True)

    (caption,) = glyphs(elements)
    assert caption["value"] == "60%"
    left, top, right, _ = box_of(elements)
    assert (left, top) == (0, 0)
    assert right >= 118


async def test_a_body_too_short_for_segments_is_drawn_solid() -> None:
    elements = await render("60", (90, 70), orientation="vertical")

    assert len(segments_of(elements)) < 3
    assert captions(elements)
