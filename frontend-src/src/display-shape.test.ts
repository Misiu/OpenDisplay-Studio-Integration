import { describe, expect, it } from "vitest";
import { displayShape, fitScale, inkView } from "./display-shape";

const BOX = { width: 240, height: 92 };

describe("displayShape", () => {
  it("keeps the proportions of the device as it is built", () => {
    const shape = displayShape({ width: 800, height: 480, rotation: 0 }, BOX);

    expect(shape.screen.width / shape.screen.height).toBeCloseTo(800 / 480);
  });

  it("fits the box, housing included", () => {
    const wide = displayShape({ width: 1200, height: 100, rotation: 0 }, BOX);
    const tall = displayShape({ width: 100, height: 1200, rotation: 0 }, BOX);

    expect(wide.housing.width).toBeLessThanOrEqual(BOX.width);
    expect(tall.housing.height).toBeLessThanOrEqual(BOX.height);
  });

  it("builds a display turned a quarter as the wide device it is", () => {
    const portrait = displayShape(
      { width: 480, height: 800, rotation: 90 },
      BOX
    );
    const landscape = displayShape(
      { width: 800, height: 480, rotation: 0 },
      BOX
    );

    expect(portrait.housing).toEqual(landscape.housing);
  });
});

describe("fitScale", () => {
  const shape = displayShape({ width: 800, height: 480, rotation: 0 }, BOX);

  it("does not shrink a device that is level or upside down", () => {
    expect(fitScale(shape.housing, 0, BOX)).toBeCloseTo(1);
    expect(fitScale(shape.housing, 180, BOX)).toBeCloseTo(1);
  });

  it("shrinks a wide device turned on its side to the height of the box", () => {
    const scale = fitScale(shape.housing, 90, BOX);

    expect(scale).toBeLessThan(1);
    expect(shape.housing.width * scale).toBeCloseTo(BOX.height);
  });

  it("shrinks it most between the two", () => {
    expect(fitScale(shape.housing, 45, BOX)).toBeLessThan(
      fitScale(shape.housing, 90, BOX)
    );
  });
});

describe("inkView", () => {
  const screen = { width: 160, height: 90 };

  it("is the screen itself when it is level or upside down", () => {
    for (const degrees of [0, 180]) {
      const view = inkView(screen, degrees);
      expect(view.width).toBeCloseTo(screen.width);
      expect(view.height).toBeCloseTo(screen.height);
    }
  });

  it("is the screen on its side when it is turned a quarter", () => {
    for (const degrees of [90, 270]) {
      const view = inkView(screen, degrees);
      expect(view.width).toBeCloseTo(screen.height);
      expect(view.height).toBeCloseTo(screen.width);
    }
  });

  it("always fits inside the screen, even halfway round", () => {
    const view = inkView(screen, 45);
    const reach = (view.width + view.height) * Math.SQRT1_2;

    expect(reach).toBeLessThanOrEqual(screen.width + 0.001);
    expect(reach).toBeLessThanOrEqual(screen.width);
  });
});
