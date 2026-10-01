import { describe, expect, it } from "vitest";
import { itemLocks } from "./locks";
import {
  circleItem,
  containerItem,
  primitiveDefinitions,
  primitiveItem,
  rectangleItem,
  textItem,
  widgetItem,
} from "./test-support";
import type { StudioItem } from "./types";

const withExpressions = <T extends StudioItem>(
  item: T,
  expressions: Record<string, string>
): T => ({ ...item, expressions });

const locks = (item: StudioItem) => itemLocks(item, primitiveDefinitions);

describe("itemLocks", () => {
  it("locks nothing for an item without expressions", () => {
    expect(locks(rectangleItem())).toEqual({
      position: [],
      handles: [],
      scalingBlockedBy: [],
    });
  });

  it("locks moving a point whose position is an expression", () => {
    const item = withExpressions(textItem(), { x: "{{ 5 }}" });

    expect(locks(item).position).toEqual(["x"]);
    expect(locks(item).handles).toEqual([]);
  });

  it("locks every handle of a point whose size is an expression, but not moving it", () => {
    const item = withExpressions(circleItem(), { radius: "{{ 9 }}" });

    expect(locks(item).position).toEqual([]);
    expect(locks(item).handles).toHaveLength(8);
  });

  it("locks only the handles that would write an expression-driven edge", () => {
    const item = withExpressions(rectangleItem(), { x_end: "{{ 300 }}" });

    expect(locks(item).handles.sort()).toEqual(["e", "ne", "se"]);
  });

  it("pins the position of a box when any corner is an expression", () => {
    const item = withExpressions(rectangleItem(), { y_start: "{{ 30 }}" });

    expect(locks(item).position).toEqual(["y_start"]);
    expect(locks(item).handles.sort()).toEqual(["n", "ne", "nw"]);
  });

  it("follows a box that was drawn from right to left", () => {
    const flipped = rectangleItem("r", { x_start: 100, x_end: 20 });
    const item = withExpressions(flipped, { x_start: "{{ 100 }}" });

    expect(locks(item).handles.sort()).toEqual(["e", "ne", "se"]);
  });

  it("does not lock geometry for a field that only changes how it looks", () => {
    const item = withExpressions(textItem(), {
      value: "{{ 1 }}",
      color: "{{ 'red' }}",
    });

    expect(locks(item)).toEqual({
      position: [],
      handles: [],
      scalingBlockedBy: [],
    });
  });

  it("does not lock geometry for visibility", () => {
    const item = withExpressions(rectangleItem(), { visible: "{{ true }}" });

    expect(locks(item)).toEqual({
      position: [],
      handles: [],
      scalingBlockedBy: [],
    });
  });

  it("has nothing to lock on a widget", () => {
    expect(locks(widgetItem())).toEqual({
      position: [],
      handles: [],
      scalingBlockedBy: [],
    });
  });
});

describe("a group", () => {
  it("can be resized when nothing in it is driven by an expression", () => {
    const group = containerItem("g", [textItem("t"), rectangleItem("r")], {
      grouped: true,
    });

    expect(locks(group)).toEqual({
      position: [],
      handles: [],
      scalingBlockedBy: [],
    });
  });

  it("cannot be resized when an element in it has an expression for its size or position", () => {
    const driven = withExpressions(textItem("t"), { x: "{{ 5 }}" });
    const group = containerItem("g", [driven, rectangleItem("r")], {
      grouped: true,
    });

    expect(locks(group).handles).toHaveLength(8);
    expect(locks(group).scalingBlockedBy).toEqual(["t"]);
  });

  it("looks inside the groups and containers it holds", () => {
    const driven = withExpressions(circleItem("c"), { radius: "{{ 9 }}" });
    const inner = containerItem("inner", [driven]);
    const group = containerItem("g", [inner], { grouped: true });

    expect(locks(group).scalingBlockedBy).toEqual(["c"]);
  });

  it("is not blocked by an expression that only changes how an element looks", () => {
    const styled = withExpressions(textItem("t"), { color: "{{ 'red' }}" });
    const group = containerItem("g", [styled], { grouped: true });

    expect(locks(group).handles).toEqual([]);
  });

  it("is not affected when it is only a plain container", () => {
    const driven = withExpressions(textItem("t"), { x: "{{ 5 }}" });
    const plain = containerItem("p", [driven]);

    expect(locks(plain).handles).toEqual([]);
  });

  it("pins a polygon whose points are an expression, and locks its handles", () => {
    const item = withExpressions(primitiveItem("polygon", "p"), {
      points: "{{ [[0, 0], [5, 5], [9, 1]] }}",
    });

    expect(locks(item).position).toEqual(["points"]);
    expect(locks(item).handles).toHaveLength(8);
  });

  it("locks the handles of a pattern whose cell size is an expression", () => {
    const item = withExpressions(primitiveItem("rectangle_pattern", "r"), {
      x_size: "{{ 30 }}",
    });

    expect(locks(item).position).toEqual([]);
    expect(locks(item).handles).toHaveLength(8);
  });
});
