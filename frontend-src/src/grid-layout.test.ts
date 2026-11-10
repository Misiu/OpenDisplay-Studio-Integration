import { describe, expect, it } from "vitest";
import {
  canMerge,
  cellsOf,
  evenLayout,
  mergeRegions,
  rectangleBetween,
  regionAt,
  regionIdAtPoint,
  regionLetter,
  regionsIn,
  resizeGrid,
  splitRegion,
} from "./grid-layout";

const ids = (regions: { id: string }[]): string[] =>
  regions.map((region) => region.id);

describe("evenLayout", () => {
  it("gives every cell a region of its own, in reading order", () => {
    const layout = evenLayout(3, 2, 8);

    expect(layout.regions).toHaveLength(6);
    expect(layout.regions.map((r) => [r.row, r.column])).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ]);
    expect(new Set(ids(layout.regions)).size).toBe(6);
  });
});

describe("rectangleBetween", () => {
  it("is the same whichever corner is given first", () => {
    const forwards = rectangleBetween(
      { row: 0, column: 1 },
      { row: 1, column: 2 }
    );
    const backwards = rectangleBetween(
      { row: 1, column: 2 },
      { row: 0, column: 1 }
    );

    expect(forwards).toEqual({ row: 0, column: 1, rowSpan: 2, columnSpan: 2 });
    expect(backwards).toEqual(forwards);
  });
});

describe("mergeRegions", () => {
  it("joins the regions in a rectangle into one that covers all their cells", () => {
    const layout = evenLayout(2, 2, 8);
    const rectangle = rectangleBetween(
      { row: 0, column: 0 },
      { row: 0, column: 1 }
    );

    const { layout: merged, removedRegionIds } = mergeRegions(
      layout,
      rectangle,
      new Set()
    );

    expect(merged.regions).toHaveLength(3);
    expect(regionAt(merged, { row: 0, column: 1 })).toEqual(
      regionAt(merged, { row: 0, column: 0 })
    );
    expect(removedRegionIds).toHaveLength(1);
  });

  it("keeps the region that holds a widget and releases the others", () => {
    const layout = evenLayout(2, 1, 8);
    const second = layout.regions[1].id;
    const rectangle = rectangleBetween(
      { row: 0, column: 0 },
      { row: 0, column: 1 }
    );

    const { layout: merged, removedRegionIds } = mergeRegions(
      layout,
      rectangle,
      new Set([second])
    );

    expect(ids(merged.regions)).toEqual([second]);
    expect(removedRegionIds).toEqual([layout.regions[0].id]);
  });

  it("refuses a rectangle that would cut a larger region in two", () => {
    const wide = mergeRegions(
      evenLayout(3, 1, 8),
      rectangleBetween({ row: 0, column: 0 }, { row: 0, column: 1 }),
      new Set()
    ).layout;

    const cutting = rectangleBetween(
      { row: 0, column: 1 },
      { row: 0, column: 2 }
    );

    expect(canMerge(wide, cutting)).toBe(false);
    expect(
      canMerge(
        wide,
        rectangleBetween({ row: 0, column: 0 }, { row: 0, column: 2 })
      )
    ).toBe(true);
  });

  it("does not merge a single cell with itself", () => {
    const layout = evenLayout(2, 2, 8);

    expect(
      canMerge(
        layout,
        rectangleBetween({ row: 1, column: 1 }, { row: 1, column: 1 })
      )
    ).toBe(false);
  });
});

describe("splitRegion", () => {
  it("cuts a region back into cells and leaves its id on the first one", () => {
    const layout = evenLayout(2, 2, 8);
    const merged = mergeRegions(
      layout,
      rectangleBetween({ row: 0, column: 0 }, { row: 1, column: 1 }),
      new Set()
    ).layout;
    const [only] = merged.regions;

    const split = splitRegion(merged, only.id);

    expect(split.regions).toHaveLength(4);
    expect(regionAt(split, { row: 0, column: 0 })?.id).toBe(only.id);
    expect(
      split.regions.every((r) => r.rowSpan === 1 && r.columnSpan === 1)
    ).toBe(true);
  });
});

describe("resizeGrid", () => {
  it("keeps the regions that still fit and fills the new cells", () => {
    const layout = evenLayout(2, 2, 8);

    const { layout: grown, removedRegionIds } = resizeGrid(layout, 3, 2);

    expect(grown.regions).toHaveLength(6);
    expect(removedRegionIds).toEqual([]);
    expect(ids(grown.regions)).toEqual(
      expect.arrayContaining(ids(layout.regions))
    );
  });

  it("takes away the regions the new edge would cut", () => {
    const merged = mergeRegions(
      evenLayout(2, 1, 8),
      rectangleBetween({ row: 0, column: 0 }, { row: 0, column: 1 }),
      new Set()
    ).layout;

    const { layout: shrunk, removedRegionIds } = resizeGrid(merged, 1, 1);

    expect(removedRegionIds).toEqual([merged.regions[0].id]);
    expect(shrunk.regions).toHaveLength(1);
    expect(cellsOf(shrunk.regions[0])).toEqual([{ row: 0, column: 0 }]);
  });

  it("covers every cell of the new grid exactly once", () => {
    const { layout } = resizeGrid(evenLayout(3, 3, 8), 2, 4);

    const covered = layout.regions.flatMap((region) => cellsOf(region));
    expect(covered).toHaveLength(8);
    expect(
      regionsIn(layout, { row: 0, column: 0, rowSpan: 4, columnSpan: 2 })
    ).toHaveLength(8);
  });
});

describe("regionIdAtPoint", () => {
  const frames = {
    cells: [],
    regions: [
      { id: "left", x: 0, y: 0, width: 100, height: 100 },
      { id: "right", x: 108, y: 0, width: 100, height: 100 },
    ],
  };

  it("finds the region a point lies in", () => {
    expect(regionIdAtPoint(frames, { x: 150, y: 50 })).toBe("right");
  });

  it("finds nothing in the gap between regions", () => {
    expect(regionIdAtPoint(frames, { x: 104, y: 50 })).toBeUndefined();
  });
});

describe("regionLetter", () => {
  it("names regions A to Z and then AA, AB …", () => {
    expect(regionLetter(0)).toBe("A");
    expect(regionLetter(25)).toBe("Z");
    expect(regionLetter(26)).toBe("AA");
    expect(regionLetter(27)).toBe("AB");
    expect(regionLetter(51)).toBe("AZ");
    expect(regionLetter(52)).toBe("BA");
  });
});

describe("the order regions are named in", () => {
  type Layout = ReturnType<typeof evenLayout>;
  type Corner = [number, number];

  const join = (layout: Layout, from: Corner, to: Corner) =>
    mergeRegions(
      layout,
      rectangleBetween(
        { row: from[0], column: from[1] },
        { row: to[0], column: to[1] }
      ),
      new Set()
    ).layout;

  const firstCells = (layout: Layout): string[] =>
    layout.regions.map((region) => `${region.row},${region.column}`);

  it("follows the order the regions were made in, not where they lie", () => {
    let layout = evenLayout(4, 2, 8);
    layout = join(layout, [1, 0], [1, 1]);
    layout = join(layout, [0, 0], [0, 1]);
    layout = join(layout, [0, 3], [1, 3]);
    layout = join(layout, [0, 2], [1, 2]);

    expect(firstCells(layout)).toEqual(["1,0", "0,0", "0,3", "0,2"]);
  });

  it("keeps a region in its place when another is made", () => {
    let layout = evenLayout(3, 1, 8);
    layout = join(layout, [0, 1], [0, 2]);
    const first = layout.regions[0].id;

    layout = evenLayout(4, 1, 8);
    layout = join(layout, [0, 2], [0, 3]);
    const joined = layout.regions[0].id;
    layout = join(layout, [0, 0], [0, 1]);

    expect(first).toBeDefined();
    expect(layout.regions[0].id).toBe(joined);
  });

  it("puts the cells nobody joined after the joined regions, in reading order", () => {
    let layout = evenLayout(3, 2, 8);
    layout = join(layout, [1, 1], [1, 2]);

    expect(firstCells(layout)).toEqual(["1,1", "0,0", "0,1", "0,2", "1,0"]);
  });
});
