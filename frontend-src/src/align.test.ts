import { describe, expect, it } from "vitest";
import { alignInParent } from "./align";
import { itemBounds } from "./geometry";
import {
  circleItem,
  containerItem,
  dashboardWith,
  primitiveItem,
  rectangleItem,
  textItem,
} from "./test-support";

const board = (items = [circleItem("c")]) =>
  dashboardWith(items, { width: 800, height: 480, padding: 20 });

const box = (id: string, x: number, y: number, width: number, height: number) =>
  rectangleItem(id, {
    x_start: x,
    y_start: y,
    x_end: x + width - 1,
    y_end: y + height - 1,
  });

const centreOf = (box: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});

describe("alignInParent", () => {
  it("centres a circle on the display", () => {
    const dashboard = board();

    alignInParent(dashboard, "c", "mm");

    const centre = centreOf(itemBounds(dashboard.items[0]));
    expect(Math.abs(centre.x - 400)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(centre.y - 240)).toBeLessThanOrEqual(0.5);
  });

  it("puts an element in each of the nine places of the working area", () => {
    const places = ["lt", "mt", "rt", "lm", "mm", "rm", "lb", "mb", "rb"];
    // A box of 200 x 50 in the working area from (20, 20) to (780, 460).
    const expected = [
      [20, 20],
      [300, 20],
      [580, 20],
      [20, 215],
      [300, 215],
      [580, 215],
      [20, 410],
      [300, 410],
      [580, 410],
    ];
    places.forEach((place, index) => {
      const dashboard = board([box("r", 0, 0, 200, 50)]);

      alignInParent(dashboard, "r", place);

      const bounds = itemBounds(dashboard.items[0]);
      expect([bounds.x, bounds.y], place).toEqual(expected[index]);
    });
  });

  it("uses the size the backend measured for text", () => {
    const dashboard = board([textItem("t")]);
    const measured = { x: 0, y: 0, width: 100, height: 40 };

    alignInParent(dashboard, "t", "rb", measured);

    const bounds = itemBounds(dashboard.items[0], measured);
    expect([bounds.x + bounds.width, bounds.y + bounds.height]).toEqual([
      780, 460,
    ]);
  });

  it("aligns an item of a container in the container, whatever the container's place", () => {
    const group = containerItem("g", [box("r", 0, 0, 60, 30)], {
      x: 300,
      y: 100,
      width: 200,
      height: 120,
    });
    const dashboard = board([group]);

    alignInParent(dashboard, "r", "mm");

    const child = group.children[0];
    const bounds = itemBounds(child);
    // 60 x 30 in 200 x 120, in the container's own coordinates
    expect([bounds.x, bounds.y]).toEqual([70, 45]);
  });

  it("aligns a polygon by its box and leaves a locked element alone", () => {
    const polygon = primitiveItem("polygon", "p");
    const locked = { ...circleItem("l"), locked: true };
    const dashboard = board([polygon, locked]);
    const before = itemBounds(locked);

    alignInParent(dashboard, "p", "lt");
    alignInParent(dashboard, "l", "mm");

    expect(itemBounds(polygon)).toMatchObject({ x: 20, y: 20 });
    expect(itemBounds(locked)).toEqual(before);
  });
});
