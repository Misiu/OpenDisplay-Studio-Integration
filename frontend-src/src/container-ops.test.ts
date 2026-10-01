import { describe, expect, it } from "vitest";
import {
  boundingBox,
  canGroup,
  canUngroup,
  createContainerItem,
  groupItems,
  ungroupItem,
} from "./container-ops";
import {
  circleItem,
  containerItem,
  dashboardWith,
  rectangleItem,
  textItem,
} from "./test-support";
import { locate } from "./tree";
import type { Dashboard, StudioItem } from "./types";

const ids = (items: StudioItem[]) => items.map((item) => item.id);

const childrenOf = (item: StudioItem | undefined): string[] =>
  item?.kind === "container" ? ids(item.children) : [];

const rectangleLeft = (item: StudioItem | undefined): number | undefined => {
  if (item?.kind !== "primitive" || !("x_start" in item.primitive)) {
    return undefined;
  }
  return item.primitive.x_start;
};

/**
 * The rectangle covers (20,30)–(119,79); the circle is centred on (100,100) with
 * radius 20, so together they cover (20,30)–(120,120), which is 101 × 91 pixels.
 */
const flat = (): Dashboard =>
  dashboardWith([
    textItem("first"),
    rectangleItem("box"),
    circleItem("ring"),
    textItem("last"),
  ]);

describe("createContainerItem", () => {
  it("is 100 × 100 with a white fill and a black outline, centred on the point", () => {
    const item = createContainerItem(dashboardWith(), 200, 150);

    expect(item).toMatchObject({
      kind: "container",
      name: "container_1",
      x: 150,
      y: 100,
      width: 100,
      height: 100,
      grouped: false,
      background: { fill: "white", outline: "black", width: 1, radius: 0 },
      children: [],
    });
  });

  it("numbers its name after the containers already there, nested ones included", () => {
    const dashboard = dashboardWith([
      containerItem("a", [containerItem("b", [], { name: "container_1" })]),
    ]);

    expect(createContainerItem(dashboard, 0, 0).name).toBe("container_3");
  });
});

describe("boundingBox", () => {
  it("contains every box", () => {
    const box = boundingBox([
      { x: 20, y: 30, width: 100, height: 50 },
      { x: 80, y: 10, width: 10, height: 10 },
    ]);

    expect(box).toEqual({ x: 20, y: 10, width: 100, height: 70 });
  });
});

describe("groupItems", () => {
  it("wraps items of one parent in a group the size of their box", () => {
    const dashboard = flat();

    const id = groupItems(dashboard, ["box", "ring"]);

    const group = locate(dashboard.items, id ?? "")?.item;
    expect(group).toMatchObject({
      kind: "container",
      grouped: true,
      background: null,
      x: 20,
      y: 30,
      width: 101,
      height: 91,
    });
    expect(childrenOf(group)).toEqual(["box", "ring"]);
  });

  it("puts the group where the topmost member was", () => {
    const dashboard = flat();

    const id = groupItems(dashboard, ["first", "ring"]);

    expect(ids(dashboard.items)).toEqual(["box", id, "last"]);
  });

  it("keeps every member where it was on screen", () => {
    const dashboard = flat();

    groupItems(dashboard, ["box", "ring"]);

    const box = locate(dashboard.items, "box");
    expect(box?.offset).toEqual({ x: 20, y: 30 });
    expect((rectangleLeft(box?.item) ?? 0) + (box?.offset.x ?? 0)).toBe(20);
  });

  it("keeps the drawing order of the members, not the order they were picked in", () => {
    const dashboard = flat();

    const id = groupItems(dashboard, ["ring", "box"]);

    const group = locate(dashboard.items, id ?? "")?.item;
    expect(childrenOf(group)).toEqual(["box", "ring"]);
  });

  it("works inside a container", () => {
    const dashboard = dashboardWith([
      containerItem("outer", [textItem("a"), textItem("b")], { x: 50, y: 60 }),
    ]);

    const id = groupItems(dashboard, ["a", "b"]);

    const found = locate(dashboard.items, id ?? "");
    expect(found?.parent?.id).toBe("outer");
    expect(found?.offset).toEqual({ x: 50, y: 60 });
  });

  it("measures text and QR codes with what the backend reported", () => {
    const dashboard = dashboardWith([textItem("a")]);

    const id = groupItems(dashboard, ["a"], () => ({
      x: 10,
      y: 10,
      width: 300,
      height: 40,
    }));

    const group = locate(dashboard.items, id ?? "")?.item;
    expect(group).toMatchObject({ width: 300, height: 40 });
  });

  it("turns a single plain container into a group, which has no background", () => {
    const dashboard = dashboardWith([
      containerItem("box", [textItem("a")], {
        background: { fill: "white", outline: "black", width: 1, radius: 0 },
      }),
    ]);

    const id = groupItems(dashboard, ["box"]);

    expect(id).toBe("box");
    expect(dashboard.items[0]).toMatchObject({
      grouped: true,
      background: null,
    });
  });

  it("refuses items of different parents, locked items and unknown ids", () => {
    const dashboard = dashboardWith([
      containerItem("outer", [textItem("inside")]),
      textItem("free"),
      { ...textItem("locked"), locked: true },
    ]);

    expect(canGroup(dashboard, ["inside", "free"])).toBe(false);
    expect(canGroup(dashboard, ["locked", "free"])).toBe(false);
    expect(canGroup(dashboard, ["nothing"])).toBe(false);
    expect(groupItems(dashboard, ["inside", "free"])).toBeUndefined();
    expect(dashboard.items).toHaveLength(3);
  });

  it("does not group a group again", () => {
    const dashboard = dashboardWith([
      containerItem("g", [], { grouped: true }),
    ]);

    expect(canGroup(dashboard, ["g"])).toBe(false);
  });
});

describe("ungroupItem", () => {
  const grouped = (): { dashboard: Dashboard; groupId: string } => {
    const dashboard = flat();
    const groupId = groupItems(dashboard, ["box", "ring"]) ?? "";
    return { dashboard, groupId };
  };

  it("puts the children where the group was, in order, keeping their place on screen", () => {
    const { dashboard, groupId } = grouped();

    const moved = ungroupItem(dashboard, groupId);

    expect(moved).toEqual(["box", "ring"]);
    expect(ids(dashboard.items)).toEqual(["first", "box", "ring", "last"]);
    expect(rectangleLeft(dashboard.items[1])).toBe(20);
  });

  it("is the reverse of making a group", () => {
    const dashboard = flat();
    const original = structuredClone(dashboard);

    const id = groupItems(dashboard, ["box", "ring"]);
    ungroupItem(dashboard, id ?? "");

    expect(dashboard.items).toEqual(original.items);
  });

  it("gives a container back, as it was, when it was a container before it was a group", () => {
    const background = { fill: "white", outline: "black", width: 2, radius: 4 };
    const dashboard = dashboardWith([
      containerItem("box", [textItem("a")], { background }),
    ]);
    const original = structuredClone(dashboard);

    groupItems(dashboard, ["box"]);
    const moved = ungroupItem(dashboard, "box");

    expect(moved).toEqual(["box"]);
    expect(dashboard.items).toEqual(original.items);
  });

  it("remembers a container that had no background too", () => {
    const dashboard = dashboardWith([
      containerItem("box", [textItem("a")], { background: null }),
    ]);

    groupItems(dashboard, ["box"]);
    ungroupItem(dashboard, "box");

    expect(dashboard.items[0]).toMatchObject({
      grouped: false,
      background: null,
    });
    expect(dashboard.items[0]).not.toHaveProperty("savedBackground");
  });

  it("dissolves a group made from a container and a selection around it", () => {
    const dashboard = dashboardWith([
      containerItem("box", [textItem("a")]),
      textItem("b"),
    ]);

    const id = groupItems(dashboard, ["box", "b"]);
    ungroupItem(dashboard, id ?? "");

    expect(ids(dashboard.items)).toEqual(["box", "b"]);
  });

  it("only dissolves groups", () => {
    const dashboard = dashboardWith([containerItem("plain", [textItem("a")])]);

    expect(canUngroup(dashboard, "plain")).toBe(false);
    expect(ungroupItem(dashboard, "plain")).toEqual([]);
    expect(dashboard.items).toHaveLength(1);
  });
});
