import { describe, expect, it } from "vitest";
import {
  applyMoves,
  planAlign,
  planDistribute,
  type AlignEdge,
  type AlignTarget,
  type ArrangeOptions,
  type DistributeAxis,
} from "./align-selection";
import { itemBounds } from "./geometry";
import { findItem } from "./tree";
import {
  containerItem,
  dashboardWith,
  rectangleItem,
  textItem,
  widgetItem,
} from "./test-support";
import type { Dashboard, ItemBounds, StudioItem } from "./types";

const box = (id: string, x: number, y: number, width: number, height: number) =>
  rectangleItem(id, {
    x_start: x,
    y_start: y,
    x_end: x + width - 1,
    y_end: y + height - 1,
  });

const widget = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number
): StudioItem => ({ ...widgetItem(id), frame: { x, y, width, height } });

const options = (
  target: AlignTarget = "selection",
  overrides: Partial<ArrangeOptions> = {}
): ArrangeOptions => ({
  target,
  measure: () => undefined,
  movable: () => true,
  ...overrides,
});

const board = (items: StudioItem[], padding = 0): Dashboard =>
  dashboardWith(items, { width: 800, height: 480, padding });

const idsOf = (dashboard: Dashboard): string[] =>
  dashboard.items.map((item) => item.id);

const align = (
  dashboard: Dashboard,
  edge: AlignEdge,
  target: AlignTarget = "selection",
  ids = idsOf(dashboard)
): Dashboard => {
  applyMoves(dashboard, planAlign(dashboard, ids, edge, options(target)));
  return dashboard;
};

const distribute = (
  dashboard: Dashboard,
  direction: DistributeAxis,
  target: AlignTarget = "selection",
  ids = idsOf(dashboard)
): Dashboard => {
  applyMoves(
    dashboard,
    planDistribute(dashboard, ids, direction, options(target))
  );
  return dashboard;
};

const boundsOf = (dashboard: Dashboard, id: string): ItemBounds => {
  const item = findItem(dashboard.items, id);
  if (!item) throw new Error(`No item ${id}`);
  return itemBounds(item);
};

const lefts = (dashboard: Dashboard) =>
  idsOf(dashboard).map((id) => boundsOf(dashboard, id).x);

const tops = (dashboard: Dashboard) =>
  idsOf(dashboard).map((id) => boundsOf(dashboard, id).y);

const rights = (dashboard: Dashboard) =>
  idsOf(dashboard).map((id) => {
    const bounds = boundsOf(dashboard, id);
    return bounds.x + bounds.width;
  });

const rightEdge = (bounds: ItemBounds) => bounds.x + bounds.width;

const bottoms = (dashboard: Dashboard) =>
  idsOf(dashboard).map((id) => {
    const bounds = boundsOf(dashboard, id);
    return bounds.y + bounds.height;
  });

/** The empty space between each item and the next one along an axis, in order. */
const gaps = (dashboard: Dashboard, axis: "x" | "y"): number[] => {
  const boxes = idsOf(dashboard)
    .map((id) => boundsOf(dashboard, id))
    .sort((first, second) => first[axis] - second[axis]);
  const size = axis === "x" ? "width" : "height";
  return boxes
    .slice(1)
    .map(
      (next, index) => next[axis] - (boxes[index][axis] + boxes[index][size])
    );
};

describe("align to the selection", () => {
  const row = () => [
    box("a", 10, 20, 40, 30),
    box("b", 70, 100, 60, 50),
    box("c", 200, 60, 20, 10),
  ];

  it("puts the left edges on the leftmost one", () => {
    expect(lefts(align(board(row()), "left"))).toEqual([10, 10, 10]);
  });

  it("puts the right edges on the rightmost one", () => {
    const aligned = align(board(row()), "right");

    // The rightmost edge is 220 (x 200 + width 20).
    expect(rights(aligned)).toEqual([220, 220, 220]);
  });

  it("centres the items on the middle of the selection", () => {
    const aligned = align(board(row()), "center");

    // The selection spans 10..220, so its middle is x = 115.
    const middles = idsOf(aligned).map((id) => {
      const bounds = boundsOf(aligned, id);
      return bounds.x + bounds.width / 2;
    });
    expect(middles).toEqual([115, 115, 115]);
  });

  it("puts the top edges on the highest one", () => {
    expect(tops(align(board(row()), "top"))).toEqual([20, 20, 20]);
  });

  it("puts the bottom edges on the lowest one", () => {
    const aligned = align(board(row()), "bottom");

    // The lowest edge is 150 (y 100 + height 50).
    expect(bottoms(aligned)).toEqual([150, 150, 150]);
  });

  it("centres vertically, so entity widgets of different heights share a middle line", () => {
    const aligned = align(
      board([
        widget("a", 0, 0, 100, 40),
        widget("b", 150, 70, 100, 100),
        widget("c", 300, 20, 100, 60),
      ]),
      "middle"
    );

    // The selection spans y 0..170, so its middle is y = 85.
    const middles = idsOf(aligned).map((id) => {
      const bounds = boundsOf(aligned, id);
      return bounds.y + bounds.height / 2;
    });
    expect(middles).toEqual([85, 85, 85]);
  });

  it("does not change the other axis or the size of anything", () => {
    const aligned = align(board(row()), "left");

    expect(tops(aligned)).toEqual([20, 100, 60]);
    expect(idsOf(aligned).map((id) => boundsOf(aligned, id).width)).toEqual([
      40, 60, 20,
    ]);
  });

  it("needs two items", () => {
    const dashboard = board([box("a", 10, 20, 40, 30)]);

    expect(planAlign(dashboard, ["a"], "left", options())).toEqual([]);
  });

  it("plans nothing when the items are already aligned", () => {
    const dashboard = board([
      box("a", 10, 20, 40, 30),
      box("b", 10, 90, 60, 50),
    ]);

    expect(planAlign(dashboard, ["a", "b"], "left", options())).toEqual([]);
  });

  it("only touches the items in the selection", () => {
    const dashboard = board([...row(), box("other", 500, 300, 10, 10)]);

    align(dashboard, "left", "selection", ["a", "b", "c"]);

    expect(boundsOf(dashboard, "other")).toMatchObject({ x: 500, y: 300 });
  });

  it("leaves a locked item where it is and ignores it", () => {
    const locked = { ...box("a", 300, 20, 40, 30), locked: true };
    const dashboard = board([
      locked,
      box("b", 70, 100, 60, 50),
      box("c", 120, 60, 20, 10),
    ]);

    align(dashboard, "left");

    expect(boundsOf(dashboard, "a").x).toBe(300);
    // Aligned to the leftmost of the two items that can move, not to the locked one.
    expect(boundsOf(dashboard, "b").x).toBe(70);
    expect(boundsOf(dashboard, "c").x).toBe(70);
  });

  it("leaves an item that an expression places", () => {
    const dashboard = board(row());
    const pinned = options("selection", { movable: (item) => item.id !== "a" });

    applyMoves(
      dashboard,
      planAlign(dashboard, ["a", "b", "c"], "left", pinned)
    );

    expect(lefts(dashboard)).toEqual([10, 70, 70]);
  });

  it("uses the size the backend measured for text", () => {
    const dashboard = board([textItem("t"), box("r", 300, 100, 50, 20)]);
    const measure = (item: StudioItem) =>
      item.id === "t" ? { x: 10, y: 10, width: 100, height: 40 } : undefined;

    applyMoves(
      dashboard,
      planAlign(
        dashboard,
        ["t", "r"],
        "right",
        options("selection", { measure })
      )
    );

    // The text is 100 wide, so its right edge reaches the rectangle's at 350.
    const text = findItem(dashboard.items, "t");
    if (!text) throw new Error("no text");
    const bounds = itemBounds(text, { x: 0, y: 0, width: 100, height: 40 });
    expect(bounds.x + bounds.width).toBe(350);
  });
});

describe("align to the parent", () => {
  it("centres a single item on the working area", () => {
    const aligned = align(
      board([box("a", 0, 0, 100, 50)], 20),
      "center",
      "parent"
    );

    // The working area is 20..780 wide, so a box of 100 starts at 20 + (760 - 100) / 2.
    expect(boundsOf(aligned, "a").x).toBe(350);
    expect(boundsOf(aligned, "a").y).toBe(0);
  });

  it("puts a single item on the bottom of the working area", () => {
    const aligned = align(
      board([box("a", 0, 0, 100, 50)], 20),
      "bottom",
      "parent"
    );

    expect(boundsOf(aligned, "a").y).toBe(410);
  });

  it("aligns each item to its own container", () => {
    const first = containerItem("one", [box("a", 5, 5, 20, 20)], {
      x: 100,
      y: 50,
      width: 200,
      height: 100,
    });
    const second = containerItem("two", [box("b", 5, 5, 40, 40)], {
      x: 400,
      y: 200,
      width: 100,
      height: 100,
    });
    const dashboard = board([first, second]);

    applyMoves(
      dashboard,
      planAlign(dashboard, ["a", "b"], "right", options("parent"))
    );

    // Children store coordinates inside their container: 200 - 20 and 100 - 40.
    expect(boundsOf(dashboard, "a").x).toBe(180);
    expect(boundsOf(dashboard, "b").x).toBe(60);
  });

  it("does not move the container along with its own child twice", () => {
    const inner = box("a", 10, 10, 20, 20);
    const container = containerItem("c", [inner], {
      x: 100,
      y: 100,
      width: 200,
      height: 100,
    });
    const dashboard = board([container]);

    applyMoves(
      dashboard,
      planAlign(dashboard, ["c", "a"], "left", options("parent"))
    );

    // Only the container moved, to the working area's left edge; the child went with it.
    expect(boundsOf(dashboard, "c").x).toBe(0);
    expect(boundsOf(dashboard, "a").x).toBe(10);
  });
});

describe("distribute", () => {
  it("makes the two gaps between three items equal", () => {
    const distributed = distribute(
      board([
        box("a", 0, 0, 40, 20),
        box("b", 70, 0, 60, 20),
        box("c", 200, 0, 20, 20),
      ]),
      "horizontal"
    );

    // 220 wide, 120 taken by the items: 100 left, so two gaps of 50.
    expect(lefts(distributed)).toEqual([0, 90, 200]);
    expect(gaps(distributed, "x")).toEqual([50, 50]);
  });

  it("keeps the outermost items where they are", () => {
    const distributed = distribute(
      board([
        box("a", 10, 0, 40, 20),
        box("b", 60, 0, 40, 20),
        box("c", 300, 0, 40, 20),
      ]),
      "horizontal"
    );

    expect(boundsOf(distributed, "a").x).toBe(10);
    expect(boundsOf(distributed, "c").x).toBe(300);
    expect(boundsOf(distributed, "b").x).toBe(155);
  });

  it("does not depend on the order the items were selected in", () => {
    const items = () => [
      box("a", 0, 0, 40, 20),
      box("b", 70, 0, 40, 20),
      box("c", 300, 0, 40, 20),
    ];

    const forwards = distribute(board(items()), "horizontal", "selection", [
      "a",
      "b",
      "c",
    ]);
    const backwards = distribute(board(items()), "horizontal", "selection", [
      "c",
      "a",
      "b",
    ]);

    expect(lefts(backwards)).toEqual(lefts(forwards));
  });

  it("spaces out items one below the other", () => {
    const distributed = distribute(
      board([
        box("a", 0, 0, 20, 40),
        box("b", 0, 50, 20, 40),
        box("c", 0, 260, 20, 40),
      ]),
      "vertical"
    );

    expect(tops(distributed)).toEqual([0, 130, 260]);
    expect(gaps(distributed, "y")).toEqual([90, 90]);
  });

  it("works on widgets of different sizes", () => {
    const distributed = distribute(
      board([
        widget("a", 20, 0, 100, 60),
        widget("b", 160, 0, 180, 60),
        widget("c", 600, 0, 120, 60),
      ]),
      "horizontal"
    );

    expect(gaps(distributed, "x")).toEqual([
      gaps(distributed, "x")[0],
      gaps(distributed, "x")[0],
    ]);
    expect(boundsOf(distributed, "a").x).toBe(20);
    expect(
      boundsOf(distributed, "c").x + boundsOf(distributed, "c").width
    ).toBe(720);
  });

  it("does nothing for two items", () => {
    const dashboard = board([box("a", 0, 0, 40, 20), box("b", 70, 0, 40, 20)]);

    expect(
      planDistribute(dashboard, ["a", "b"], "horizontal", options())
    ).toEqual([]);
  });

  it("plans nothing when the gaps are already equal", () => {
    const dashboard = board([
      box("a", 0, 0, 40, 20),
      box("b", 80, 0, 40, 20),
      box("c", 160, 0, 40, 20),
    ]);

    expect(
      planDistribute(dashboard, ["a", "b", "c"], "horizontal", options())
    ).toEqual([]);
  });

  it("keeps the gaps within a pixel of each other when they cannot be equal", () => {
    const distributed = distribute(
      board([
        box("a", 0, 0, 10, 10),
        box("b", 20, 0, 10, 10),
        box("c", 40, 0, 10, 10),
        box("d", 106, 0, 10, 10),
      ]),
      "horizontal"
    );

    // 116 wide, 40 taken by items: 76 left for 3 gaps, 25.33 each.
    const spaces = gaps(distributed, "x");
    expect(Math.max(...spaces) - Math.min(...spaces)).toBeLessThanOrEqual(1);
    expect(spaces.reduce((sum, space) => sum + space, 0)).toBe(76);
    expect(boundsOf(distributed, "a").x).toBe(0);
    expect(boundsOf(distributed, "d").x).toBe(106);
  });

  it("measures in display pixels for items in a container", () => {
    const container = containerItem(
      "box",
      [
        box("a", 0, 0, 20, 20),
        box("b", 30, 0, 20, 20),
        box("c", 140, 0, 20, 20),
      ],
      { x: 100, y: 50, width: 200, height: 100 }
    );
    const dashboard = board([container]);

    applyMoves(
      dashboard,
      planDistribute(dashboard, ["a", "b", "c"], "horizontal", options())
    );

    const inside = (id: string) => boundsOf(dashboard, id).x;
    expect([inside("a"), inside("b"), inside("c")]).toEqual([0, 70, 140]);
  });

  it("ignores locked items", () => {
    const locked = { ...box("c", 300, 0, 40, 20), locked: true };
    const dashboard = board([
      box("a", 0, 0, 40, 20),
      box("b", 50, 0, 40, 20),
      locked,
    ]);

    expect(
      planDistribute(dashboard, ["a", "b", "c"], "horizontal", options())
    ).toEqual([]);
  });
});

describe("distribute to the parent", () => {
  it("spreads items from one edge of the working area to the other", () => {
    const distributed = distribute(
      board(
        [
          box("a", 100, 0, 40, 20),
          box("b", 150, 0, 40, 20),
          box("c", 170, 0, 40, 20),
        ],
        20
      ),
      "horizontal",
      "parent"
    );

    expect(boundsOf(distributed, "a").x).toBe(20);
    expect(boundsOf(distributed, "c").x + 40).toBe(780);
    expect(gaps(distributed, "x")[0]).toBe(gaps(distributed, "x")[1]);
  });

  it("works with two items", () => {
    const distributed = distribute(
      board([box("a", 100, 0, 40, 20), box("b", 150, 0, 40, 20)]),
      "horizontal",
      "parent"
    );

    expect(boundsOf(distributed, "a").x).toBe(0);
    expect(boundsOf(distributed, "b").x).toBe(760);
  });

  it("spreads items over the container they are in", () => {
    const container = containerItem(
      "c",
      [
        box("a", 20, 0, 20, 20),
        box("b", 30, 0, 20, 20),
        box("d", 40, 0, 20, 20),
      ],
      { x: 100, y: 50, width: 200, height: 100 }
    );
    const dashboard = board([container]);

    applyMoves(
      dashboard,
      planDistribute(
        dashboard,
        ["a", "b", "d"],
        "horizontal",
        options("parent")
      )
    );

    expect([
      boundsOf(dashboard, "a").x,
      boundsOf(dashboard, "b").x,
      boundsOf(dashboard, "d").x,
    ]).toEqual([0, 90, 180]);
  });
});

describe("a grid of nine", () => {
  const scattered = () =>
    board([
      box("1", 13, 17, 50, 30),
      box("2", 140, 9, 50, 30),
      box("3", 333, 41, 50, 30),
      box("4", 20, 200, 50, 30),
      box("5", 190, 177, 50, 30),
      box("6", 350, 230, 50, 30),
      box("7", 5, 400, 50, 30),
      box("8", 210, 380, 50, 30),
      box("9", 300, 421, 50, 30),
    ]);

  it("is made by aligning and spacing each row, then each column", () => {
    const dashboard = scattered();
    const rows = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ];
    for (const row of rows) {
      align(dashboard, "middle", "selection", row);
      distribute(dashboard, "horizontal", "selection", row);
    }
    const columns = [
      ["1", "4", "7"],
      ["2", "5", "8"],
      ["3", "6", "9"],
    ];
    for (const column of columns) {
      align(dashboard, "center", "selection", column);
      distribute(dashboard, "vertical", "selection", column);
    }

    const at = (id: string) => boundsOf(dashboard, id);
    // Every row has one top, every column one left edge, and the spacing is the same.
    const xs = columns.map((column) => column.map((id) => at(id).x));
    for (const column of xs) expect(new Set(column).size).toBe(1);
    const ys = rows.map((row) => row.map((id) => at(id).y));
    for (const row of ys) expect(new Set(row).size).toBe(1);
    const columnLefts = xs.map((column) => column[0]);
    const rowTops = ys.map((row) => row[0]);
    expect(columnLefts[1] - columnLefts[0]).toBe(
      columnLefts[2] - columnLefts[1]
    );
    expect(rowTops[1] - rowTops[0]).toBe(rowTops[2] - rowTops[1]);
  });
});

describe("any selection", () => {
  /** A small deterministic generator, so a failure can be reproduced. */
  const generator = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  it("is spaced evenly, in order, and without changing sizes or the outer edges", () => {
    const random = generator(7);
    let checked = 0;
    for (let round = 0; round < 200; round += 1) {
      const count = 3 + Math.floor(random() * 7);
      const items = Array.from({ length: count }, (_, index) =>
        box(
          `i${index}`,
          Math.floor(random() * 700),
          Math.floor(random() * 400),
          5 + Math.floor(random() * 60),
          5 + Math.floor(random() * 40)
        )
      );
      const dashboard = board(items);
      const before = idsOf(dashboard).map((id) => boundsOf(dashboard, id));
      const left = Math.min(...before.map((bounds) => bounds.x));
      const right = Math.max(...before.map(rightEdge));
      const widths = before.reduce((sum, bounds) => sum + bounds.width, 0);
      // Items wider together than their span overlap, and spacing them out has no gaps to measure.
      if (widths > right - left) continue;
      checked += 1;

      distribute(dashboard, "horizontal");

      const after = idsOf(dashboard).map((id) => boundsOf(dashboard, id));
      const ordered = [...after].sort((first, second) => first.x - second.x);
      expect(
        Math.min(...after.map((bounds) => bounds.x)),
        `round ${round}`
      ).toBe(left);
      expect(Math.max(...after.map(rightEdge)), `round ${round}`).toBe(right);
      expect(after.map((bounds) => bounds.width)).toEqual(
        before.map((bounds) => bounds.width)
      );
      expect(after.map((bounds) => bounds.y)).toEqual(
        before.map((bounds) => bounds.y)
      );
      const spaces = ordered
        .slice(1)
        .map((next, index) => next.x - rightEdge(ordered[index]));
      expect(
        Math.max(...spaces) - Math.min(...spaces),
        `round ${round}`
      ).toBeLessThanOrEqual(1);
    }
    expect(checked).toBeGreaterThan(150);
  });

  it("is aligned exactly on every edge", () => {
    const random = generator(11);
    const edges: AlignEdge[] = [
      "left",
      "center",
      "right",
      "top",
      "middle",
      "bottom",
    ];
    for (let round = 0; round < 100; round += 1) {
      for (const edge of edges) {
        const items = Array.from(
          { length: 2 + Math.floor(random() * 6) },
          (_, index) =>
            box(
              `i${index}`,
              Math.floor(random() * 700),
              Math.floor(random() * 400),
              2 * (3 + Math.floor(random() * 30)),
              2 * (3 + Math.floor(random() * 20))
            )
        );
        const dashboard = align(board(items), edge);

        const boxes = idsOf(dashboard).map((id) => boundsOf(dashboard, id));
        const key = (bounds: ItemBounds): number =>
          ({
            left: bounds.x,
            center: bounds.x + bounds.width / 2,
            right: bounds.x + bounds.width,
            top: bounds.y,
            middle: bounds.y + bounds.height / 2,
            bottom: bounds.y + bounds.height,
          })[edge];
        expect(new Set(boxes.map(key)).size, `${edge} round ${round}`).toBe(1);
      }
    }
  });
});
