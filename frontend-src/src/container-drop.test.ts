import { describe, expect, it } from "vitest";
import {
  backgroundFormData,
  backgroundFromForm,
  backgroundFields,
} from "./container-fields";
import {
  insertOnDisplay,
  reparentByDrop,
  setContainerBackground,
} from "./container-ops";
import { moveLayer, renameItem, setItemNumber } from "./dashboard-ops";
import {
  circleItem,
  containerItem,
  dashboardWith,
  primitiveDefinitions,
  rectangleItem,
  textItem,
} from "./test-support";
import { containerAt, locate, replaceItem, withOffsets } from "./tree";
import type { StudioItem } from "./types";

const ids = (items: StudioItem[]) => items.map((item) => item.id);

const textPosition = (item: StudioItem | undefined) =>
  item?.kind === "primitive" && "x" in item.primitive
    ? { x: item.primitive.x, y: item.primitive.y }
    : undefined;

/** A panel at (100, 50) holding a text, a plain container at (30, 40) holding another. */
const nested = () =>
  dashboardWith([
    containerItem(
      "panel",
      [
        textItem("a"),
        containerItem("inner", [textItem("b")], { x: 30, y: 40 }),
      ],
      { x: 100, y: 50, width: 300, height: 200 }
    ),
    textItem("free"),
  ]);

describe("withOffsets", () => {
  it("lists every item with the origin of the list it is in", () => {
    const placed = withOffsets(nested().items);

    expect(
      placed.map((entry) => [entry.item.id, entry.offset, entry.depth])
    ).toEqual([
      ["panel", { x: 0, y: 0 }, 0],
      ["a", { x: 100, y: 50 }, 1],
      ["inner", { x: 100, y: 50 }, 1],
      ["b", { x: 130, y: 90 }, 2],
      ["free", { x: 0, y: 0 }, 0],
    ]);
  });
});

describe("containerAt", () => {
  it("finds the deepest container under a point", () => {
    expect(containerAt(nested().items, 150, 100, [], undefined)?.id).toBe(
      "inner"
    );
    expect(containerAt(nested().items, 350, 200, [], undefined)?.id).toBe(
      "panel"
    );
  });

  it("finds nothing outside every container", () => {
    expect(containerAt(nested().items, 10, 10, [], undefined)).toBeUndefined();
  });

  it("skips what is being dragged and everything inside it", () => {
    expect(
      containerAt(nested().items, 150, 100, ["inner"], undefined)?.id
    ).toBe("panel");
    expect(
      containerAt(nested().items, 150, 100, ["panel"], undefined)
    ).toBeUndefined();
  });

  it("skips hidden and locked containers", () => {
    const hidden = dashboardWith([containerItem("box", [], { hidden: true })]);
    const locked = dashboardWith([containerItem("box", [], { locked: true })]);

    expect(containerAt(hidden.items, 150, 100, [], undefined)).toBeUndefined();
    expect(containerAt(locked.items, 150, 100, [], undefined)).toBeUndefined();
  });

  it("skips a group unless it was entered", () => {
    const grouped = dashboardWith([
      containerItem("group", [], { grouped: true }),
    ]);

    expect(containerAt(grouped.items, 150, 100, [], undefined)).toBeUndefined();
    expect(containerAt(grouped.items, 150, 100, [], "group")?.id).toBe("group");
  });

  it("prefers the container drawn on top of another", () => {
    const overlapping = dashboardWith([
      containerItem("below"),
      containerItem("above"),
    ]);

    expect(containerAt(overlapping.items, 150, 100, [], undefined)?.id).toBe(
      "above"
    );
  });
});

describe("replaceItem", () => {
  it("puts an item back where the one with its id was, at any depth", () => {
    const dashboard = nested();
    const moved = structuredClone(locate(dashboard.items, "b")?.item);
    if (!moved) throw new Error("missing");
    moved.name = "renamed";

    replaceItem(dashboard, moved);

    expect(locate(dashboard.items, "b")?.item.name).toBe("renamed");
  });
});

describe("insertOnDisplay", () => {
  it("adds an item to the top level as it is", () => {
    const dashboard = dashboardWith();

    insertOnDisplay(dashboard, textItem("a"), undefined);

    expect(textPosition(dashboard.items[0])).toEqual({ x: 10, y: 10 });
  });

  it("adds an item to a container, converting its position to the container's", () => {
    const dashboard = nested();

    insertOnDisplay(dashboard, textItem("new"), "inner");

    const found = locate(dashboard.items, "new");
    expect(found?.parent?.id).toBe("inner");
    expect(textPosition(found?.item)).toEqual({ x: 10 - 130, y: 10 - 90 });
  });
});

describe("reparentByDrop", () => {
  it("moves an item into the container it was dropped on, at the end", () => {
    const dashboard = nested();

    reparentByDrop(dashboard, "free", "inner");

    const found = locate(dashboard.items, "free");
    expect(ids(found?.siblings ?? [])).toEqual(["b", "free"]);
    expect(textPosition(found?.item)).toEqual({ x: 10 - 130, y: 10 - 90 });
  });

  it("puts an item taken out of a container directly above the container it left", () => {
    const dashboard = nested();

    reparentByDrop(dashboard, "b", undefined);

    expect(ids(dashboard.items)).toEqual(["panel", "b", "free"]);
    expect(textPosition(locate(dashboard.items, "b")?.item)).toEqual({
      x: 10 + 130,
      y: 10 + 90,
    });
  });

  it("puts an item taken out of an inner container directly above the one it moved to", () => {
    const dashboard = nested();

    reparentByDrop(dashboard, "b", "panel");

    const found = locate(dashboard.items, "b");
    expect(found?.parent?.id).toBe("panel");
    expect(ids(found?.siblings ?? [])).toEqual(["a", "inner", "b"]);
  });

  it("does nothing when the item is dropped where it already is", () => {
    const dashboard = nested();
    const before = structuredClone(dashboard);

    reparentByDrop(dashboard, "a", "panel");

    expect(dashboard).toEqual(before);
  });
});

describe("setItemNumber inside a container", () => {
  it("reads a position as relative to the container and limits it on the display", () => {
    const dashboard = nested();

    setItemNumber(dashboard, "b", "x", 25, primitiveDefinitions);

    expect(textPosition(locate(dashboard.items, "b")?.item)?.x).toBe(25);
  });

  it("keeps an item within reach of the working area whatever container it is in", () => {
    const dashboard = dashboardWith(
      [containerItem("panel", [rectangleItem("box")], { x: 300, y: 100 })],
      { width: 400, height: 300 }
    );

    setItemNumber(dashboard, "box", "x", 5000, primitiveDefinitions);

    const found = locate(dashboard.items, "box");
    const box = found?.item;
    const left =
      box?.kind === "primitive" && "x_start" in box.primitive
        ? box.primitive.x_start
        : 0;
    // The box starts at the far edge at most: 400 on the display, 100 in the container.
    expect(left + 300).toBeLessThanOrEqual(400);
  });

  it("edits the box of a container itself", () => {
    const dashboard = nested();

    setItemNumber(dashboard, "panel", "width", 250, primitiveDefinitions);

    expect(locate(dashboard.items, "panel")?.item).toMatchObject({
      width: 250,
    });
  });
});

describe("moveLayer", () => {
  it("drops an item inside a container as its last child, or onto the root", () => {
    const dashboard = nested();

    moveLayer(dashboard, "free", "inner", "inside");
    expect(locate(dashboard.items, "free")?.parent?.id).toBe("inner");

    moveLayer(dashboard, "free", "", "inside");
    expect(locate(dashboard.items, "free")?.parent).toBeUndefined();
  });
});

describe("renameItem", () => {
  it("renames at any depth, trimming, and ignores an empty name", () => {
    const dashboard = nested();

    renameItem(dashboard, "b", "  Label  ");
    renameItem(dashboard, "a", "   ");

    expect(locate(dashboard.items, "b")?.item.name).toBe("Label");
    expect(locate(dashboard.items, "a")?.item.name).toBe("a");
  });
});

describe("the background of a container", () => {
  it("is edited only on a plain container", () => {
    const dashboard = dashboardWith([
      containerItem("plain"),
      containerItem("group", [], { grouped: true }),
    ]);
    const background = { fill: "red", outline: "black", width: 3, radius: 4 };

    setContainerBackground(dashboard, "plain", background);
    setContainerBackground(dashboard, "group", background);

    expect(locate(dashboard.items, "plain")?.item).toMatchObject({
      background,
    });
    expect(locate(dashboard.items, "group")?.item).toMatchObject({
      background: null,
    });
  });

  it("shows a form of its values, or of the defaults when there is none", () => {
    const withBackground = containerItem("a", [], {
      background: { fill: null, outline: "red", width: 2, radius: 1 },
    });

    expect(backgroundFormData(withBackground)).toEqual({
      enabled: true,
      fill: null,
      outline: "red",
      width: 2,
      radius: 1,
    });
    expect(backgroundFormData(containerItem("b"))).toMatchObject({
      enabled: false,
      fill: "white",
      outline: "black",
    });
  });

  it("turns what the form reports back into a background, or none", () => {
    expect(backgroundFromForm({ enabled: false })).toBeNull();
    expect(
      backgroundFromForm({
        enabled: true,
        fill: null,
        outline: "red",
        width: 3.6,
        radius: 9999,
      })
    ).toEqual({ fill: null, outline: "red", width: 4, radius: 256 });
    expect(backgroundFromForm({ enabled: true })).toEqual({
      fill: "white",
      outline: "black",
      width: 1,
      radius: 0,
    });
  });

  it("describes its fields like those of a primitive, with a fill that may be empty", () => {
    const fields = backgroundFields();

    expect(fields.map((field) => field.key)).toEqual([
      "enabled",
      "fill",
      "outline",
      "width",
      "radius",
    ]);
    expect(fields.map((field) => field.shape)).toEqual([
      "boolean",
      "color",
      "color",
      "number",
      "number",
    ]);
    expect(fields[1].nullable).toBe(true);
    expect(fields[2].nullable).toBeUndefined();
  });
});

describe("a circle in a container", () => {
  it("moves with its container when only the container's box is edited", () => {
    const dashboard = dashboardWith([
      containerItem("panel", [circleItem("ring")], { x: 100, y: 50 }),
    ]);

    setItemNumber(dashboard, "panel", "x", 200, primitiveDefinitions);

    const ring = locate(dashboard.items, "ring");
    expect(ring?.offset).toEqual({ x: 200, y: 50 });
  });
});
