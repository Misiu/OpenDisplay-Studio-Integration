import { describe, expect, it } from "vitest";
import { translateItem } from "./geometry";
import {
  circleItem,
  containerItem,
  dashboardWith,
  rectangleItem,
  textItem,
} from "./test-support";
import {
  allItems,
  ancestors,
  commonParent,
  countItems,
  findItem,
  inDrawingOrder,
  insertItem,
  isWithin,
  locate,
  moveItem,
  moveRelative,
  selectionTarget,
} from "./tree";
import type { StudioItem } from "./types";

/** outer (100,50) › inner (30,40) › leaf; a text and a circle at the top level. */
const sample = () => {
  const leaf = textItem("leaf");
  const inner = containerItem("inner", [leaf], { x: 30, y: 40 });
  const outer = containerItem("outer", [inner, rectangleItem("side")]);
  return dashboardWith([textItem("first"), outer, circleItem("last")]);
};

const ids = (items: StudioItem[]) => items.map((item) => item.id);

/** The stored X of a text item, which is where it sits inside its container. */
const textX = (item: StudioItem | undefined): number | undefined => {
  if (item?.kind !== "primitive" || !("x" in item.primitive)) return undefined;
  return item.primitive.x;
};

const childrenOf = (item: StudioItem | undefined): string[] =>
  item?.kind === "container" ? ids(item.children) : [];

describe("walking the tree", () => {
  it("lists every item, each container before its children", () => {
    expect(ids(allItems(sample().items))).toEqual([
      "first",
      "outer",
      "inner",
      "leaf",
      "side",
      "last",
    ]);
    expect(countItems(sample().items)).toBe(6);
  });

  it("finds an item at any depth", () => {
    expect(findItem(sample().items, "leaf")?.id).toBe("leaf");
    expect(findItem(sample().items, "nothing")).toBeUndefined();
  });

  it("adds up the offsets of the containers above an item", () => {
    const found = locate(sample().items, "leaf");

    expect(found?.offset).toEqual({ x: 130, y: 90 });
    expect(found?.parent?.id).toBe("inner");
    expect(found?.index).toBe(0);
  });

  it("names the containers above an item, nearest first", () => {
    expect(ids(ancestors(sample().items, "leaf"))).toEqual(["inner", "outer"]);
    expect(ancestors(sample().items, "first")).toEqual([]);
  });

  it("knows whether an item lies inside another", () => {
    const { items } = sample();

    expect(isWithin(items, "leaf", "outer")).toBe(true);
    expect(isWithin(items, "outer", "outer")).toBe(true);
    expect(isWithin(items, "outer", "leaf")).toBe(false);
  });
});

describe("moveItem", () => {
  it("re-parents an item and keeps it where it is on screen", () => {
    const dashboard = sample();
    const screenX = 130 + 10;

    moveItem(dashboard, "leaf", undefined, translateItem);

    const after = locate(dashboard.items, "leaf");
    expect(after?.parent).toBeUndefined();
    expect(after?.offset).toEqual({ x: 0, y: 0 });
    expect(textX(after?.item)).toBe(screenX);
  });

  it("puts it at the end of its new container by default, or at an index", () => {
    const dashboard = sample();

    moveItem(dashboard, "first", "outer", translateItem);
    moveItem(dashboard, "last", "outer", translateItem, 0);

    expect(childrenOf(findItem(dashboard.items, "outer"))).toEqual([
      "last",
      "inner",
      "side",
      "first",
    ]);
  });

  it("never puts a container inside itself", () => {
    const dashboard = sample();

    moveItem(dashboard, "outer", "leaf", translateItem);
    moveItem(dashboard, "outer", "inner", translateItem);

    expect(ids(dashboard.items)).toEqual(["first", "outer", "last"]);
  });
});

describe("moveRelative", () => {
  it("puts an item above or below another, as the layer list shows them", () => {
    const dashboard = sample();

    moveRelative(dashboard, "first", "last", "before", translateItem);
    expect(ids(dashboard.items)).toEqual(["outer", "last", "first"]);

    moveRelative(dashboard, "first", "outer", "after", translateItem);
    expect(ids(dashboard.items)).toEqual(["first", "outer", "last"]);
  });

  it("moves an item into the container of its target, keeping its place on screen", () => {
    const dashboard = sample();

    moveRelative(dashboard, "first", "side", "before", translateItem);

    const found = locate(dashboard.items, "first");
    expect(found?.parent?.id).toBe("outer");
    expect(ids(found?.siblings ?? [])).toEqual(["inner", "side", "first"]);
    expect(textX(found?.item)).toBe(10 - 100);
  });

  it("ignores a target inside the item", () => {
    const dashboard = sample();

    moveRelative(dashboard, "outer", "leaf", "before", translateItem);

    expect(ids(dashboard.items)).toEqual(["first", "outer", "last"]);
  });
});

describe("insertItem", () => {
  it("adds an item to a container or to the top level", () => {
    const dashboard = sample();

    insertItem(dashboard, textItem("a"), "inner");
    insertItem(dashboard, textItem("b"), undefined, 0);

    expect(locate(dashboard.items, "a")?.parent?.id).toBe("inner");
    expect(ids(dashboard.items)[0]).toBe("b");
  });
});

describe("commonParent", () => {
  it("says whether items share one parent", () => {
    const { items } = sample();

    expect(commonParent(items, ["first", "last"])).toEqual({
      parentId: undefined,
    });
    expect(commonParent(items, ["inner", "side"])).toEqual({
      parentId: "outer",
    });
    expect(commonParent(items, ["first", "leaf"])).toBe(false);
    expect(commonParent(items, [])).toBe(false);
    expect(commonParent(items, ["nothing"])).toBe(false);
  });

  it("orders items as they are drawn, whatever order they were picked in", () => {
    expect(inDrawingOrder(sample().items, ["last", "first"])).toEqual([
      "first",
      "last",
    ]);
  });
});

describe("selectionTarget", () => {
  const withGroup = (): StudioItem[] => {
    const leaf = textItem("leaf");
    const inner = containerItem("inner", [leaf], { grouped: true });
    const outer = containerItem("outer", [inner], { grouped: true });
    return [outer, textItem("free")];
  };

  it("selects the item itself when no group is above it", () => {
    expect(selectionTarget(sample().items, "leaf", undefined)).toBe("leaf");
  });

  it("selects the outermost group above an item", () => {
    expect(selectionTarget(withGroup(), "leaf", undefined)).toBe("outer");
  });

  it("selects inside a group that was entered, but still the next group down", () => {
    expect(selectionTarget(withGroup(), "leaf", "outer")).toBe("inner");
    expect(selectionTarget(withGroup(), "leaf", "inner")).toBe("leaf");
  });

  it("leaves items outside the entered group as they were", () => {
    expect(selectionTarget(withGroup(), "free", "outer")).toBe("free");
  });
});
