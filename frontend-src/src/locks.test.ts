import { describe, expect, it } from "vitest";
import { itemLocks } from "./locks";
import {
  circleItem,
  primitiveDefinitions,
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
    expect(locks(rectangleItem())).toEqual({ position: [], handles: [] });
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

    expect(locks(item)).toEqual({ position: [], handles: [] });
  });

  it("does not lock geometry for visibility", () => {
    const item = withExpressions(rectangleItem(), { visible: "{{ true }}" });

    expect(locks(item)).toEqual({ position: [], handles: [] });
  });

  it("has nothing to lock on a widget", () => {
    expect(locks(widgetItem())).toEqual({ position: [], handles: [] });
  });
});
