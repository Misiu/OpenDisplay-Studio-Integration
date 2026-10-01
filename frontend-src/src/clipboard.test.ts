import { describe, expect, it } from "vitest";
import {
  COPY_OFFSET,
  copyItems,
  duplicateItems,
  pasteItems,
  pasteTarget,
} from "./clipboard";
import { nudgeItems } from "./nudge";
import {
  circleItem,
  containerItem,
  dashboardWith,
  rectangleItem,
  textItem,
} from "./test-support";
import { allItems, bringToFront, locate, sendToBack, stepItems } from "./tree";
import type { Dashboard, StudioItem } from "./types";

const ids = (items: StudioItem[]) => items.map((item) => item.id);

const textAt = (item: StudioItem | undefined) =>
  item?.kind === "primitive" && "x" in item.primitive
    ? { x: item.primitive.x, y: item.primitive.y }
    : undefined;

const sample = (): Dashboard =>
  dashboardWith([
    textItem("a"),
    containerItem("panel", [textItem("inside")], { x: 100, y: 50 }),
    textItem("b"),
  ]);

describe("copyItems", () => {
  it("copies an element with its position on the display", () => {
    const data = copyItems(sample(), ["inside"]);

    expect(ids(data.items)).toEqual(["inside"]);
    expect(textAt(data.items[0])).toEqual({ x: 110, y: 60 });
  });

  it("copies a container with everything in it, once", () => {
    const data = copyItems(sample(), ["panel", "inside"]);

    expect(ids(data.items)).toEqual(["panel"]);
    const panel = data.items[0];
    expect(panel?.kind === "container" && ids(panel.children)).toEqual([
      "inside",
    ]);
  });

  it("keeps the drawing order, whatever order the elements were selected in", () => {
    expect(ids(copyItems(sample(), ["b", "a"]).items)).toEqual(["a", "b"]);
  });

  it("does not change the dashboard", () => {
    const dashboard = sample();
    const before = structuredClone(dashboard);

    copyItems(dashboard, ["a", "panel"]);

    expect(dashboard).toEqual(before);
  });
});

describe("pasteTarget", () => {
  it("is the selected plain container", () => {
    expect(pasteTarget(sample(), ["panel"])).toEqual({ parentId: "panel" });
  });

  it("is next to the selected element, in its container", () => {
    expect(pasteTarget(sample(), ["inside"])).toEqual({
      parentId: "panel",
      afterId: "inside",
    });
    expect(pasteTarget(sample(), ["a"])).toEqual({
      parentId: undefined,
      afterId: "a",
    });
  });

  it("is next to a selected group, not inside it", () => {
    const dashboard = dashboardWith([
      containerItem("g", [], { grouped: true }),
    ]);

    expect(pasteTarget(dashboard, ["g"])).toEqual({
      parentId: undefined,
      afterId: "g",
    });
  });

  it("is the top level when nothing is selected", () => {
    expect(pasteTarget(sample(), [])).toEqual({});
  });
});

describe("pasteItems", () => {
  it("adds copies with new ids and names, moved by the offset", () => {
    const dashboard = sample();
    const data = copyItems(dashboard, ["a"]);

    const [id] = pasteItems(
      dashboard,
      data,
      {},
      {
        delta: { x: COPY_OFFSET, y: COPY_OFFSET },
      }
    );

    const pasted = locate(dashboard.items, id ?? "")?.item;
    expect(id).not.toBe("a");
    expect(pasted?.name).toBe("text_4");
    expect(textAt(pasted)).toEqual({ x: 18, y: 18 });
    expect(dashboard.items.at(-1)?.id).toBe(id);
  });

  it("puts copies directly above the selected element", () => {
    const dashboard = sample();
    const data = copyItems(dashboard, ["a"]);

    pasteItems(dashboard, data, { afterId: "a" }, { delta: { x: 8, y: 8 } });

    expect(dashboard.items.map((item) => item.name)).toEqual([
      "a",
      "text_4",
      "panel",
      "b",
    ]);
  });

  it("puts copies inside a container, in its own coordinates, keeping the place on the display", () => {
    const dashboard = sample();
    const data = copyItems(dashboard, ["a"]);

    const [id] = pasteItems(
      dashboard,
      data,
      { parentId: "panel" },
      {
        delta: { x: 0, y: 0 },
      }
    );

    const found = locate(dashboard.items, id ?? "");
    expect(found?.parent?.id).toBe("panel");
    expect(textAt(found?.item)).toEqual({ x: 10 - 100, y: 10 - 50 });
  });

  it("gives everything in a pasted container a new id", () => {
    const dashboard = sample();
    const data = copyItems(dashboard, ["panel"]);

    const [id] = pasteItems(dashboard, data, {}, { delta: { x: 8, y: 8 } });

    const known = allItems(dashboard.items).map((item) => item.id);
    expect(new Set(known).size).toBe(known.length);
    const copy = locate(dashboard.items, id ?? "")?.item;
    expect(copy?.kind === "container" && copy.children).toHaveLength(1);
  });

  it("puts the box of the copies at a point for Paste Here", () => {
    const dashboard = sample();
    const data = copyItems(dashboard, ["a", "b"]);

    const pasted = pasteItems(
      dashboard,
      data,
      {},
      {
        anchor: { x: 300, y: 200 },
      }
    );

    expect(textAt(locate(dashboard.items, pasted[0] ?? "")?.item)).toEqual({
      x: 300,
      y: 200,
    });
  });

  it("can be pasted into another dashboard", () => {
    const source = sample();
    const target = dashboardWith([circleItem("c")]);
    const data = copyItems(source, ["a"]);

    pasteItems(target, data, {}, { delta: { x: 8, y: 8 } });

    expect(target.items).toHaveLength(2);
    expect(target.items[1]?.name).toBe("text_1");
  });

  it("pastes nothing from an empty clipboard", () => {
    expect(
      pasteItems(sample(), { items: [] }, {}, { delta: { x: 0, y: 0 } })
    ).toEqual([]);
  });
});

describe("duplicateItems", () => {
  it("puts a copy directly above the original, offset, and returns its id", () => {
    const dashboard = sample();

    const [id] = duplicateItems(dashboard, ["a"]);

    expect(dashboard.items.map((item) => item.name)).toEqual([
      "a",
      "text_4",
      "panel",
      "b",
    ]);
    expect(textAt(locate(dashboard.items, id ?? "")?.item)).toEqual({
      x: 18,
      y: 18,
    });
  });

  it("keeps a copy in the container of its original, in the same coordinates", () => {
    const dashboard = sample();

    const [id] = duplicateItems(dashboard, ["inside"]);

    const found = locate(dashboard.items, id ?? "");
    expect(found?.parent?.id).toBe("panel");
    expect(textAt(found?.item)).toEqual({ x: 18, y: 18 });
  });

  it("copies every selected element, each next to its own original", () => {
    const dashboard = sample();

    const copies = duplicateItems(dashboard, ["a", "b"]);

    expect(copies).toHaveLength(2);
    expect(dashboard.items).toHaveLength(5);
  });
});

describe("ordering", () => {
  const order = (dashboard: Dashboard) => ids(dashboard.items);
  const three = (): Dashboard =>
    dashboardWith([textItem("a"), textItem("b"), textItem("c"), textItem("d")]);

  it("brings elements to the front, keeping their order", () => {
    const dashboard = three();

    bringToFront(dashboard, ["b", "a"]);

    expect(order(dashboard)).toEqual(["c", "d", "a", "b"]);
  });

  it("sends elements to the back, keeping their order", () => {
    const dashboard = three();

    sendToBack(dashboard, ["c", "d"]);

    expect(order(dashboard)).toEqual(["c", "d", "a", "b"]);
  });

  it("moves an element one place up or down, and stops at the ends", () => {
    const dashboard = three();

    stepItems(dashboard, ["b"], "up");
    expect(order(dashboard)).toEqual(["a", "c", "b", "d"]);
    stepItems(dashboard, ["b"], "down");
    stepItems(dashboard, ["b"], "down");
    stepItems(dashboard, ["b"], "down");
    expect(order(dashboard)).toEqual(["b", "a", "c", "d"]);
    stepItems(dashboard, ["d"], "up");
    expect(order(dashboard)).toEqual(["b", "a", "c", "d"]);
  });

  it("moves a selection together without swapping its members with each other", () => {
    const dashboard = three();

    stepItems(dashboard, ["a", "b"], "up");

    expect(order(dashboard)).toEqual(["c", "a", "b", "d"]);
  });

  it("works inside a container", () => {
    const dashboard = dashboardWith([
      containerItem("box", [textItem("x"), textItem("y")]),
    ]);

    bringToFront(dashboard, ["x"]);

    const box = dashboard.items[0];
    expect(box?.kind === "container" && ids(box.children)).toEqual(["y", "x"]);
  });
});

describe("nudgeItems", () => {
  const area = { x: 0, y: 0, width: 400, height: 300 };
  const anyone = () => true;

  it("moves the selection by the step", () => {
    const dashboard = dashboardWith([textItem("a"), textItem("b")]);

    const moved = nudgeItems(dashboard, ["a", "b"], 1, 0, area, anyone);

    expect(moved).toBe(true);
    expect(textAt(dashboard.items[0])?.x).toBe(11);
    expect(textAt(dashboard.items[1])?.x).toBe(11);
  });

  it("stops at the edge of the working area", () => {
    const dashboard = dashboardWith([rectangleItem("r")]);

    nudgeItems(dashboard, ["r"], -50, 0, area, anyone);

    const rectangle = dashboard.items[0];
    expect(
      rectangle?.kind === "primitive" && "x_start" in rectangle.primitive
        ? rectangle.primitive.x_start
        : undefined
    ).toBe(0);
  });

  it("leaves locked items and items that are pinned where they are", () => {
    const dashboard = dashboardWith([
      { ...textItem("locked"), locked: true },
      textItem("pinned"),
      textItem("free"),
    ]);

    nudgeItems(
      dashboard,
      ["locked", "pinned", "free"],
      5,
      0,
      area,
      (item) => item.id !== "pinned"
    );

    expect(textAt(dashboard.items[0])?.x).toBe(10);
    expect(textAt(dashboard.items[1])?.x).toBe(10);
    expect(textAt(dashboard.items[2])?.x).toBe(15);
  });

  it("does nothing, and says so, when nothing can move", () => {
    const dashboard = dashboardWith([{ ...textItem("a"), locked: true }]);

    expect(nudgeItems(dashboard, ["a"], 1, 1, area, anyone)).toBe(false);
  });
});
