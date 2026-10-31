"""Battery: the charge of a battery drawn as a battery that fills up."""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    fit_text,
    line_height,
    text_width,
)

MIN_TEXT: Final = 10
MAX_TEXT: Final = 72
GAP: Final = 6
FULL: Final = 100
# What a battery that only says "low" or "ok" is drawn as.
LOW_LEVEL_SHOWN: Final = 10
BINARY_STATES: Final = {"on": "low", "off": "ok"}
NO_VALUE: Final = "--"
HORIZONTAL, VERTICAL = "horizontal", "vertical"
WIDE_RATIO: Final = 0.9
BODY_SHARE: Final = 0.62
CAPTION_SHARE: Final = 0.3
CAPTION_HEIGHT_SHARE: Final = 0.2
INSIDE_BODY_SHARE: Final = 0.8
INSIDE_TEXT_SHARE: Final = 0.62
HALO: Final = 2
STANDING_SHARE: Final = 0.5
NUB_HEIGHT_SHARE: Final = 0.4
MIN_BODY: Final = 16
MAX_BODY: Final = 110
# Segments: as many as fit at this pitch, between the fewest and the most.
SEGMENT_PITCH: Final = 16
MIN_SEGMENTS: Final = 3
MIN_SEGMENT_LENGTH: Final = 4
MAX_SEGMENTS: Final = 10
SEGMENTS: Final = "segments"
MIN_FITTED_BODY: Final = 6
FRAME_GAP: Final = 3


@dataclass(frozen=True, slots=True)
class Charge:
    """What the entity says: how full the battery is, and the words to show for it."""

    level: int | None
    caption: str


@dataclass(frozen=True, slots=True)
class Segments:
    """The segments of the body: how many, how long each is, the gap and the total."""

    count: int
    length: int
    gap: int

    @property
    def span(self) -> int:
        """Return the length of all the segments and the gaps between them."""
        return self.count * self.length + (self.count - 1) * self.gap


@dataclass(frozen=True, slots=True)
class Shape:
    """How the battery is drawn: which way it points, in what color and how thick."""

    direction: str
    color: str
    size: int
    segments: Segments | None = None


def _charge(context: WidgetContext, data: dict[str, Any]) -> Charge:
    """Read the level from a percentage, or from a binary sensor that says low or ok."""
    state = str(data["state"])
    if state in BINARY_STATES:
        low = BINARY_STATES[state] == "low"
        return Charge(LOW_LEVEL_SHOWN if low else FULL, context.t(BINARY_STATES[state]))
    try:
        level = round(clamp(round(float(state)), 0, FULL))
    except ValueError:
        return Charge(None, NO_VALUE)
    return Charge(level, f"{level}%")


def _orientation(options: dict[str, Any], width: int, height: int) -> str:
    chosen: str = options["orientation"]
    if chosen != "auto":
        return chosen
    return HORIZONTAL if width >= height * WIDE_RATIO else VERTICAL


def _body_size(direction: str, width: int, height: int, share: float) -> int:
    """Return how thick the body is: its height lying down, its width standing up."""
    if direction == HORIZONTAL:
        return clamp(round(height * share), MIN_BODY, MAX_BODY)
    reach = min(width * share, height * STANDING_SHARE)
    return clamp(round(reach), MIN_BODY, MAX_BODY)


def _widest_caption(context: WidgetContext) -> str:
    """Return the caption that takes the most room, whichever one is shown."""
    return max(
        f"{FULL}%",
        context.t("low"),
        context.t("ok"),
        key=lambda word: text_width(word, 20),
    )


def _caption_size(
    context: WidgetContext, direction: str, width: int, height: int
) -> int:
    """Return one size for every caption: what the widest one needs, not this one."""
    widest = _widest_caption(context)
    if direction == HORIZONTAL:
        room, ceiling = round(width * CAPTION_SHARE), height * BODY_SHARE
    else:
        room, ceiling = width, height * CAPTION_HEIGHT_SHARE
    return fit_text(
        widest,
        max(room, MIN_TEXT),
        clamp(round(ceiling), MIN_TEXT, MAX_TEXT),
        MIN_TEXT,
        steady_digits=True,
    )


def _fill(charge: Charge, direction: str, color: str) -> dict[str, Any]:
    """Return the full part of the battery: as long as the level, from one end."""
    share = f"{charge.level}%"
    edge = (
        {"w": share, "align_self": "start"}
        if direction == HORIZONTAL
        else {"h": share, "valign_self": "end"}
    )
    return {"type": "column", "background": color, "children": [], **edge}


def _segment_layout(shape: Shape, inside: tuple[int, int]) -> Segments | None:
    """
    Return the segments that fit along the inside of the body, all of one length.

    There are ten of them on a long body and fewer on a short one. The length is a whole
    number of pixels, so none is longer than another; the few pixels left over lie as
    empty space at the ends. A body too short for segments of a visible length is
    drawn solid instead.
    """
    room = inside[0] if shape.direction == HORIZONTAL else inside[1]
    gap = max(2, clamp(shape.size // 14, 1, 3))
    count = clamp(room // SEGMENT_PITCH, MIN_SEGMENTS, MAX_SEGMENTS)
    length = (room - (count - 1) * gap) // count
    return Segments(count, length, gap) if length >= MIN_SEGMENT_LENGTH else None


def _segments(look: Look, charge: Charge, shape: Shape, radius: int) -> dict[str, Any]:
    """
    Return the body's contents as rounded segments, the full ones in the color.

    The segments that are full are as many as the level asks for, rounded to the
    nearest, and at least one while there is any charge. A lying battery fills from the
    left, a standing one from the bottom.
    """
    segments = shape.segments
    assert segments is not None
    level = charge.level or 0
    count = segments.count
    full = min(count, max(1, round(level * count / FULL))) if level else 0
    empty = {"border": look.ink, "border_width": 1}
    horizontal = shape.direction == HORIZONTAL
    cells = [
        {
            "type": "column",
            "radius": radius,
            "children": [],
            "w" if horizontal else "h": segments.length,
            **({"background": shape.color} if index < full else empty),
        }
        for index in range(count)
    ]
    return {
        "type": "row" if horizontal else "column",
        "gap": segments.gap,
        "align": "stretch",
        "w" if horizontal else "h": segments.span,
        "align_self" if horizontal else "valign_self": "center",
        "children": cells if horizontal else cells[::-1],
    }


def _body(
    look: Look, charge: Charge, shape: Shape, caption: dict[str, Any] | None
) -> dict[str, Any]:
    """Return the body of the battery: a frame, the full part and maybe a caption."""
    thickness = clamp(shape.size // 14, 1, 3)
    radius = clamp(shape.size // 6, 2, 10)
    children = []
    if shape.segments is not None:
        children.append(_segments(look, charge, shape, max(0, radius - 2)))
    elif charge.level:
        fill = _fill(charge, shape.direction, shape.color)
        children.append({**fill, "radius": max(0, radius - 2)})
    if caption:
        children.append(caption)
    return {
        "type": "stack",
        "padding": thickness + 2,
        "border": look.ink,
        "border_width": thickness,
        "radius": radius,
        "children": children,
    }


def _nub(look: Look, direction: str, size: int) -> dict[str, Any]:
    """Return the small terminal at the end of the battery."""
    thick = max(4, size // 6)
    long = round(size * NUB_HEIGHT_SHARE)
    shape = (
        {"w": thick, "h": long} if direction == HORIZONTAL else {"w": long, "h": thick}
    )
    return {"type": "column", "background": look.ink, **shape, "children": []}


def _battery(
    look: Look, charge: Charge, shape: Shape, caption: dict[str, Any] | None
) -> dict[str, Any]:
    """Return the battery: its body, which takes the room there is, and its terminal."""
    body = {**_body(look, charge, shape, caption), "grow": 1}
    size, direction = shape.size, shape.direction
    if direction == HORIZONTAL:
        return {
            "type": "row",
            "grow": 1,
            "align": "center",
            "children": [{**body, "h": size}, _nub(look, direction, size)],
        }
    return {
        "type": "column",
        "grow": 1,
        "align": "center",
        "children": [_nub(look, direction, size), {**body, "w": size}],
    }


def _wall(size: int) -> int:
    """Return how far the inside of the body lies from its edge."""
    return clamp(size // 14, 1, 3) + 2


def _inside_room(shape: Shape, room: tuple[int, int]) -> tuple[int, int]:
    """Return the width and height inside the body, from the room around it."""
    wall = 2 * _wall(shape.size)
    terminal = max(4, shape.size // 6)
    if shape.direction == HORIZONTAL:
        return room[0] - terminal - wall, shape.size - wall
    return shape.size - wall, room[1] - terminal - wall


def _inside_caption(
    context: WidgetContext,
    look: Look,
    charge: Charge,
    shape: Shape,
    room: tuple[int, int],
) -> dict[str, Any]:
    """
    Return the caption drawn on the battery, outlined in the color of the background.

    The outline is always there, so the number reads on the fill and off it and looks
    the same at every charge. The size is the same for every caption, from the
    thickness of the body and the widest caption.
    """
    inside = _inside_room(shape, room)
    across = inside[1] if shape.direction == HORIZONTAL else inside[0]
    text_size = fit_text(
        _widest_caption(context),
        max(MIN_TEXT, inside[0]),
        clamp(round(across * INSIDE_TEXT_SHARE), MIN_TEXT, MAX_TEXT),
        MIN_TEXT,
        steady_digits=True,
    )
    return look.text(
        charge.caption,
        size=text_size,
        color=shape.color,
        stroke_width=HALO,
        stroke_fill=look.paper,
        align_self="center",
        valign_self="center",
    )


def _name_size(width: int, height: int) -> int:
    """Return the size of the name: small, and never wider than the frame allows."""
    return clamp(min(height // 6, width // 6), MIN_TEXT, 24)


def _name(look: Look, name: str, size: int) -> dict[str, Any]:
    """Return the line with the name of the battery, cut with … if too long."""
    return look.text(
        name, size=size, align="center", truncate=True, h=line_height(size)
    )


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the battery of the picked entity, or say that none is picked."""
    look = Look.of(context)
    if not context.sources["entities"]:
        return compose(context, look.message(context.box, context.t("choose_entity")))
    options = context.options
    pick = context.sources["entities"][0]
    data = context.data["entities"][0]
    charge = _charge(context, data)
    low = charge.level is not None and charge.level <= options["lowLevel"]
    color = options["alertColor"] if low else look.ink
    inside = options["percentagePlacement"] == "inside"
    beside = options["showPercentage"] and not inside
    # With no name and nothing beside it the battery is all there is: it fills it.
    bare = not options["showName"] and not beside
    padding = clamp(min(context.box.width, context.box.height) // 12, 4, 16)
    if bare:
        padding = FRAME_GAP if look.framed else 0
    inner_w = context.box.width - 2 * padding
    inner_h = context.box.height - 2 * padding
    direction = _orientation(options, context.box.width, context.box.height)

    children: list[dict[str, Any]] = []
    name_room = 0
    if options["showName"]:
        name_size = _name_size(inner_w, inner_h)
        name_room = line_height(name_size) + GAP
        children.append(_name(look, pick.get("label") or data["name"], name_size))
    room_h = inner_h - name_room
    caption_size = MIN_TEXT
    if beside:
        caption_size = _caption_size(context, direction, inner_w, room_h)
    # Beside a lying battery the caption takes width; under a standing one, height.
    under = line_height(caption_size) + GAP if beside and direction == VERTICAL else 0
    share = INSIDE_BODY_SHARE if inside else BODY_SHARE
    thickness = _body_size(direction, inner_w, room_h - under, share)
    if bare:
        reach = room_h if direction == HORIZONTAL else inner_w
        thickness = max(MIN_FITTED_BODY, reach)
    # The caption beside a lying battery has the width of the widest one, so the body
    # is as long for every charge and its segments as well.
    caption_width = 0
    if beside and direction == HORIZONTAL:
        caption_width = text_width(_widest_caption(context), caption_size)
    room = (inner_w - (GAP + caption_width if caption_width else 0), room_h - under)
    shape = Shape(direction, color, thickness)
    if options["style"] == SEGMENTS:
        shape = replace(
            shape, segments=_segment_layout(shape, _inside_room(shape, room))
        )
    caption = None
    if options["showPercentage"] and inside:
        caption = _inside_caption(context, look, charge, shape, room)
    parts: list[dict[str, Any]] = [_battery(look, charge, shape, caption)]
    if beside:
        sized = {"w": caption_width, "align": "center"} if caption_width else {}
        parts.append(look.text(charge.caption, size=caption_size, color=color, **sized))
    layout = "row" if direction == HORIZONTAL else "column"
    children.append(
        {
            "type": layout,
            "grow": 1,
            "gap": GAP,
            "align": "center",
            "justify": "center",
            "children": parts,
        }
    )
    return compose(
        context,
        {
            "type": "column",
            "padding": padding,
            "gap": GAP,
            **look.frame(),
            "children": children,
        },
    )


RENDERER = render
