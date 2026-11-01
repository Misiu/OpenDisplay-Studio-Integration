import { describe, expect, it } from "vitest";
import {
  canAddRange,
  isIdle,
  newRange,
  nextColor,
  rangesOf,
  withoutRange,
  withRangeValues,
} from "./ranges";
import type { PrimitiveField, WidgetRange } from "./types";

const field = (max?: number): PrimitiveField => ({
  key: "ranges",
  label: "Ranges",
  shape: "ranges",
  section: "appearance",
  max,
});

const green: WidgetRange = { from: null, color: "green" };
const yellow: WidgetRange = { from: 40, color: "yellow" };

describe("rangesOf", () => {
  it("is empty for what is not a list", () => {
    expect(rangesOf(undefined)).toEqual([]);
    expect(rangesOf("green")).toEqual([]);
  });

  it("keeps the start and the color of each range", () => {
    expect(rangesOf([green, yellow])).toEqual([green, yellow]);
  });

  it("leaves out what is not a range and mends what is half of one", () => {
    expect(rangesOf([5, { from: "x", color: 3 }])).toEqual([
      { from: null, color: "black" },
    ]);
  });
});

describe("nextColor", () => {
  it("starts a scale with green where the display has it", () => {
    expect(nextColor("spectra6", [])).toBe("green");
  });

  it("goes on to yellow and then red as the others are used", () => {
    expect(nextColor("spectra6", [green])).toBe("yellow");
    expect(nextColor("spectra6", [green, yellow])).toBe("red");
  });

  it("gives a display with four colors the colors it has", () => {
    expect(nextColor("bwry", [])).toBe("yellow");
    expect(nextColor("bwry", [{ from: null, color: "yellow" }])).toBe("red");
  });

  it("gives a black and white display black, and white after it", () => {
    expect(nextColor("bw", [])).toBe("black");
    expect(nextColor("bw", [{ from: null, color: "black" }])).toBe("white");
  });

  it("never gives a color the display does not have", () => {
    for (const palette of ["bw", "bwr", "bwy", "bwry", "spectra6"] as const) {
      expect(nextColor(palette, [])).not.toBe("");
    }
  });
});

describe("newRange", () => {
  it("has no start, and the next color", () => {
    expect(newRange("spectra6", [green])).toEqual({
      from: null,
      color: "yellow",
    });
  });
});

describe("canAddRange", () => {
  it("allows as many as the field's limit", () => {
    expect(canAddRange(field(2), [green])).toBe(true);
    expect(canAddRange(field(2), [green, yellow])).toBe(false);
  });

  it("has a limit even when the field gives none", () => {
    const many = Array.from({ length: 12 }, () => green);

    expect(canAddRange(field(), many)).toBe(false);
  });
});

describe("withRangeValues and withoutRange", () => {
  it("changes one range and leaves the others", () => {
    expect(withRangeValues([green, yellow], 1, { from: 50 })).toEqual([
      green,
      { from: 50, color: "yellow" },
    ]);
  });

  it("removes one range", () => {
    expect(withoutRange([green, yellow], 0)).toEqual([yellow]);
  });
});

describe("isIdle", () => {
  it("is false for the first range with no start", () => {
    expect(isIdle([green, yellow], 0)).toBe(false);
  });

  it("is true for a second range with no start yet", () => {
    expect(isIdle([green, { from: null, color: "red" }], 1)).toBe(true);
  });

  it("is false for any range with a start", () => {
    expect(isIdle([green, yellow], 1)).toBe(false);
  });
});
