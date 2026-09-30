import { describe, expect, it } from "vitest";
import { strings } from "./strings";

describe("strings with values", () => {
  it("pluralises the dashboard count", () => {
    expect([0, 1, 2].map(strings.gallery.count)).toEqual([
      "0 dashboards",
      "1 dashboard",
      "2 dashboards",
    ]);
  });

  it("formats sizes with the multiplication sign", () => {
    expect(strings.common.size(800, 480)).toBe("800 × 480");
    expect(strings.common.sizeInPixels(800, 480)).toBe("800 × 480 px");
  });

  it("names elements in actions and labels", () => {
    expect(strings.gallery.open("Kitchen")).toBe("Open dashboard Kitchen");
    expect(strings.gallery.updated("Sep 30, 2026")).toBe(
      "Updated Sep 30, 2026"
    );
    expect(strings.structure.lock("Kitchen")).toBe("Lock Kitchen");
    expect(strings.app.deleteElementTitle("Circle")).toBe("Delete Circle?");
    expect(strings.canvas.resizeHandle("Circle", strings.canvas.sides.se)).toBe(
      "Resize Circle from south east"
    );
  });

  it("describes the inspector subtitle by kind and lock state", () => {
    expect(
      strings.inspector.subtitle(strings.inspector.kindWidget, false)
    ).toBe("Widget · editable");
    expect(
      strings.inspector.subtitle(strings.inspector.kindPrimitive, true)
    ).toBe("ODL primitive · position locked");
  });

  it("shows render timings to one decimal", () => {
    expect(strings.common.milliseconds(1.25)).toBe("1.3 ms");
  });

  it("reports an empty primitive type readably", () => {
    expect(strings.app.unsupportedPrimitive("hexagon")).toBe(
      "Unsupported primitive type: hexagon"
    );
    expect(strings.app.unsupportedPrimitive("")).toBe(
      "Unsupported primitive type: (empty)"
    );
  });
});

describe("strings coverage", () => {
  it("has a name for every primitive type and a label for every palette", () => {
    expect(Object.keys(strings.primitives).sort()).toEqual([
      "circle",
      "ellipse",
      "icon",
      "line",
      "progress_bar",
      "qrcode",
      "rectangle",
      "text",
    ]);
    expect(Object.keys(strings.palettes).sort()).toEqual([
      "bw",
      "bwr",
      "bwry",
      "bwy",
      "spectra6",
    ]);
  });

  it("has a name for all eight resize handles", () => {
    expect(Object.keys(strings.canvas.sides).sort()).toEqual([
      "e",
      "n",
      "ne",
      "nw",
      "s",
      "se",
      "sw",
      "w",
    ]);
  });
});
