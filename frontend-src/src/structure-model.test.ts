import { describe, expect, it } from "vitest";
import { dropZone, neighbour, visibleRows } from "./structure-model";
import {
  circleItem,
  containerItem,
  rectangleItem,
  textItem,
} from "./test-support";
import type { StudioItem } from "./types";

const items = (): StudioItem[] => [
  textItem("bottom"),
  containerItem("box", [rectangleItem("a"), circleItem("b")]),
  textItem("top"),
];

const shown = (rows: ReturnType<typeof visibleRows>) =>
  rows.map((row) => `${row.depth}:${row.item.id}`);

describe("visibleRows", () => {
  it("lists the top item first, each container followed by its children", () => {
    expect(shown(visibleRows(items(), new Set()))).toEqual([
      "0:top",
      "0:box",
      "1:b",
      "1:a",
      "0:bottom",
    ]);
  });

  it("leaves out the children of a collapsed container", () => {
    expect(shown(visibleRows(items(), new Set(["box"])))).toEqual([
      "0:top",
      "0:box",
      "0:bottom",
    ]);
  });

  it("keeps what matches a search, and the containers above it, open", () => {
    const rows = visibleRows(items(), new Set(["box"]), "rect");

    expect(shown(rows)).toEqual(["0:box", "1:a"]);
  });

  it("finds an item by its name or its type, whatever the case", () => {
    expect(shown(visibleRows(items(), new Set(), "TOP"))).toEqual(["0:top"]);
    expect(shown(visibleRows(items(), new Set(), "circle"))).toEqual([
      "0:box",
      "1:b",
    ]);
  });

  it("shows nothing when nothing matches", () => {
    expect(visibleRows(items(), new Set(), "zzz")).toEqual([]);
  });
});

describe("dropZone", () => {
  it("is before in the upper quarter and after in the lower quarter of a container", () => {
    expect(dropZone(0.1, true)).toBe("before");
    expect(dropZone(0.9, true)).toBe("after");
  });

  it("is inside the middle half of a container", () => {
    expect(dropZone(0.25, true)).toBe("inside");
    expect(dropZone(0.5, true)).toBe("inside");
    expect(dropZone(0.75, true)).toBe("inside");
  });

  it("splits an element that cannot hold others into two halves", () => {
    expect(dropZone(0.4, false)).toBe("before");
    expect(dropZone(0.6, false)).toBe("after");
  });
});

describe("neighbour", () => {
  const rows = visibleRows(items(), new Set());

  it("steps to the row below or above, and stops at the ends", () => {
    expect(neighbour(rows, "top", 1)?.item.id).toBe("box");
    expect(neighbour(rows, "box", -1)?.item.id).toBe("top");
    expect(neighbour(rows, "top", -1)?.item.id).toBe("top");
    expect(neighbour(rows, "bottom", 1)?.item.id).toBe("bottom");
  });

  it("starts at the first row when nothing is selected", () => {
    expect(neighbour(rows, "", 1)?.item.id).toBe("top");
  });
});
