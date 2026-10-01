import { describe, expect, it } from "vitest";
import { loadPrimitiveDefinitions } from "./primitive-definitions";
import { createPrimitive, resolveLimit } from "./primitives";
import type { PrimitiveDefinition } from "./types";

const definitions = loadPrimitiveDefinitions();
const definitionOf = (type: string): PrimitiveDefinition => {
  const definition = definitions.find((candidate) => candidate.type === type);
  if (!definition) {
    throw new Error(`No definition for ${type}`);
  }
  return definition;
};
const context = { x: 100, y: 100, displayWidth: 800, displayHeight: 480 };

describe("the shipped definitions", () => {
  it("offer every ODL primitive of the editor, in library order", () => {
    expect(definitions.map((definition) => definition.type)).toEqual([
      "text",
      "multiline",
      "rectangle",
      "rectangle_pattern",
      "line",
      "polygon",
      "circle",
      "arc",
      "ellipse",
      "icon",
      "icon_sequence",
      "qrcode",
      "dlimg",
      "progress_bar",
      "plot",
      "debug_grid",
    ]);
  });

  it("describe each primitive for the library", () => {
    for (const definition of definitions) {
      expect(definition.name, definition.type).not.toBe("");
      expect(definition.description, definition.type).not.toBe("");
      expect(definition.icon, definition.type).toMatch(/^mdi:/);
      expect(definition.category, definition.type).not.toBe("");
    }
  });

  it("keep field keys unique within a primitive", () => {
    for (const definition of definitions) {
      const keys = definition.fields.map((field) => field.key);
      expect(new Set(keys).size, definition.type).toBe(keys.length);
    }
  });
});

describe("createPrimitive", () => {
  it.each(definitions.map((definition) => definition.type))(
    "creates a %s with every field of its definition",
    (type) => {
      const primitive = createPrimitive(definitionOf(type), context);
      expect(primitive?.type).toBe(type);
      for (const field of definitionOf(type).fields) {
        expect(primitive, `${type}.${field.key}`).toHaveProperty(field.key);
      }
    }
  );

  it("rejects an unknown catalog type instead of creating another element", () => {
    expect(createPrimitive(undefined, context)).toBeUndefined();
  });

  it("starts each field at its default", () => {
    expect(createPrimitive(definitionOf("text"), context)).toMatchObject({
      value: "Text",
      size: 32,
      color: "black",
    });
    expect(createPrimitive(definitionOf("qrcode"), context)).toMatchObject({
      data: "ODX",
      boxsize: 3,
      border: 1,
      bgcolor: "white",
    });
    expect(
      createPrimitive(definitionOf("progress_bar"), context)
    ).toMatchObject({
      progress: 50,
      direction: "right",
      fill: "accent",
      show_percentage: true,
    });
  });

  it("leaves an optional fill empty", () => {
    expect(createPrimitive(definitionOf("rectangle"), context)).toMatchObject({
      fill: null,
      outline: "black",
    });
  });

  it("places a point at the drop position", () => {
    expect(createPrimitive(definitionOf("circle"), context)).toMatchObject({
      x: 100,
      y: 100,
      radius: 40,
    });
  });

  it("extends a box or line from the drop position by its extent", () => {
    expect(createPrimitive(definitionOf("rectangle"), context)).toMatchObject({
      x_start: 100,
      y_start: 100,
      x_end: 260,
      y_end: 190,
    });
    expect(
      createPrimitive(definitionOf("progress_bar"), context)
    ).toMatchObject({
      y_start: 100,
      y_end: 132,
    });
  });

  it("keeps a box inside the display when dropped near the edge", () => {
    const nearCorner = { ...context, x: 790, y: 470 };
    expect(createPrimitive(definitionOf("line"), nearCorner)).toMatchObject({
      x_end: 799,
      y_end: 479,
    });
  });

  it("keeps a default inside the limits of a small display", () => {
    const small = { x: 10, y: 10, displayWidth: 64, displayHeight: 32 };
    expect(createPrimitive(definitionOf("circle"), small)).toMatchObject({
      radius: 32,
    });
  });
});

describe("resolveLimit", () => {
  const display = { width: 800, height: 480 };

  it("passes a fixed limit through and reads display-relative ones", () => {
    expect(resolveLimit(7, display, 0)).toBe(7);
    expect(resolveLimit("display_width", display, 0)).toBe(800);
    expect(resolveLimit("display_height", display, 0)).toBe(480);
    expect(resolveLimit("display_shorter_side", display, 0)).toBe(480);
  });

  it("uses the fallback when a limit is missing", () => {
    expect(resolveLimit(undefined, display, 99)).toBe(99);
  });
});

describe("createPrimitive for the shapes with several points or nested settings", () => {
  it("puts the first point of a polygon where it is dropped and keeps its shape", () => {
    const polygon = createPrimitive(definitionOf("polygon"), {
      ...context,
      x: 300,
      y: 200,
    });

    expect(polygon).toMatchObject({
      points: [
        [300, 200],
        [380, 200],
        [340, 270],
      ],
    });
  });

  it("puts a pattern's origin, an image and an arc at the drop point", () => {
    expect(
      createPrimitive(definitionOf("rectangle_pattern"), context)
    ).toMatchObject({ x_start: 100, y_start: 100 });
    expect(createPrimitive(definitionOf("dlimg"), context)).toMatchObject({
      x: 100,
      y: 100,
    });
    expect(createPrimitive(definitionOf("arc"), context)).toMatchObject({
      x: 100,
      y: 100,
    });
  });

  it("gives a plot a series to draw and leaves the axes unset", () => {
    expect(createPrimitive(definitionOf("plot"), context)).toMatchObject({
      x_start: 100,
      x_end: 420,
      data: [{ entity: "sensor.example" }],
      ylegend: null,
      xaxis: null,
      low: null,
    });
  });

  it("copies the defaults, so editing one primitive never edits the next", () => {
    const first = createPrimitive(definitionOf("polygon"), context);
    const second = createPrimitive(definitionOf("polygon"), context);

    if (first?.type === "polygon") first.points[0][0] = 999;

    expect(second).toMatchObject({
      points: [
        [100, 100],
        [180, 100],
        [140, 170],
      ],
    });
  });

  it("does not place a debug grid: it covers the display", () => {
    const grid = createPrimitive(definitionOf("debug_grid"), context);

    expect(grid).not.toHaveProperty("x");
    expect(grid).toMatchObject({ spacing: 20, dashed: true });
  });
});
