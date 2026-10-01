import { describe, expect, it } from "vitest";
import {
  appearanceFormData,
  definitionFor,
  hasCornerFields,
  layoutFields,
  primitiveAppearanceSchema,
  primitiveValuesFromForm,
} from "./item-fields";
import {
  circleItem,
  primitiveItem,
  dashboardWith,
  rectangleItem,
  textItem,
  widgetItem,
  primitiveDefinitions,
} from "./test-support";
import type { PrimitiveDefinition, PrimitiveItem } from "./types";

const dashboard = dashboardWith();
const keys = (fields: { key: string }[]) => fields.map((field) => field.key);

describe("layoutFields", () => {
  it("gives widgets position, size and a separate inner padding field", () => {
    const fields = layoutFields(widgetItem(), dashboard, primitiveDefinitions);
    expect(keys(fields.grid)).toEqual(["x", "y", "width", "height"]);
    expect(keys(fields.extra)).toEqual(["padding"]);
    expect(fields.grid[2]).toMatchObject({
      label: "Width",
      value: 200,
      min: 1,
      max: 400,
    });
  });

  it("reports box primitives as top-left plus inclusive size", () => {
    const { grid } = layoutFields(
      rectangleItem(),
      dashboard,
      primitiveDefinitions
    );
    expect(grid.map((field) => field.value)).toEqual([20, 30, 100, 50]);
  });

  it("offers the four stored corners of a box, each of which can be an expression", () => {
    const { grid } = layoutFields(
      rectangleItem(),
      dashboard,
      primitiveDefinitions,
      true
    );

    expect(keys(grid)).toEqual(["x_start", "y_start", "x_end", "y_end"]);
    expect(grid.map((field) => field.value)).toEqual([20, 30, 119, 79]);
    expect(grid.every((field) => field.stored)).toBe(true);
  });

  it("marks only fields the primitive stores as able to be expressions", () => {
    const derived = layoutFields(
      rectangleItem(),
      dashboard,
      primitiveDefinitions
    );
    const point = layoutFields(circleItem(), dashboard, primitiveDefinitions);

    expect(derived.grid.some((field) => field.stored)).toBe(false);
    expect(point.grid.every((field) => field.stored)).toBe(true);
  });

  it("knows which primitives have corners to edit", () => {
    expect(hasCornerFields(rectangleItem(), primitiveDefinitions)).toBe(true);
    expect(hasCornerFields(circleItem(), primitiveDefinitions)).toBe(false);
    expect(hasCornerFields(widgetItem(), primitiveDefinitions)).toBe(false);
  });

  it("reports a reversed line by its top-left corner", () => {
    const line = rectangleItem("l", { x_start: 100, x_end: 40 });
    expect(
      layoutFields(line, dashboard, primitiveDefinitions).grid[0].value
    ).toBe(40);
  });

  it("uses centre and radius for circles, module size for QR codes, size for text", () => {
    expect(
      layoutFields(circleItem(), dashboard, primitiveDefinitions).grid.map(
        (field) => field.label
      )
    ).toEqual(["Center X", "Center Y", "Radius"]);
    const qr: PrimitiveItem = {
      id: "q",
      kind: "primitive",
      locked: false,
      hidden: false,
      primitive: {
        type: "qrcode",
        data: "x",
        x: 1,
        y: 2,
        boxsize: 3,
        border: 1,
        color: "black",
        bgcolor: "white",
      },
    };
    expect(
      layoutFields(qr, dashboard, primitiveDefinitions).grid.map(
        (field) => field.key
      )
    ).toEqual(["x", "y", "boxsize"]);
    expect(
      layoutFields(textItem(), dashboard, primitiveDefinitions).grid.map(
        (field) => field.key
      )
    ).toEqual(["x", "y", "size"]);
  });
});

describe("primitiveAppearanceSchema", () => {
  const names = (item: PrimitiveItem, palette = "bw" as const) =>
    primitiveAppearanceSchema(item, palette, primitiveDefinitions).map(
      (entry) => entry.name
    );

  it("offers the fields of each primitive type", () => {
    expect(names(textItem())).toEqual([
      "value",
      "color",
      "anchor",
      "max_width",
      "truncate",
      "font",
      "align",
      "spacing",
      "stroke_width",
      "stroke_fill",
      "parse_colors",
    ]);
    expect(names(rectangleItem())).toEqual([
      "fill",
      "outline",
      "width",
      "radius",
      "corners",
    ]);
    expect(names(circleItem())).toEqual(["fill", "outline", "width"]);
    expect(
      names(
        rectangleItem("l", {
          type: "line",
          fill: "black",
          dashed: false,
        } as never)
      )
    ).toEqual(["fill", "width", "dashed", "dash_length", "space_length"]);
  });

  it("limits colours to the palette plus accent, and lets fills be transparent", () => {
    const schema = primitiveAppearanceSchema(
      rectangleItem(),
      "bwr",
      primitiveDefinitions
    );
    const fill = schema.find((entry) => entry.name === "fill");
    expect(fill?.selector).toEqual({
      select: { options: ["transparent", "black", "white", "red", "accent"] },
    });
    const outline = schema.find((entry) => entry.name === "outline");
    expect(outline?.selector).toEqual({
      select: { options: ["black", "white", "red", "accent"] },
    });
  });
});

describe("definition-driven fields", () => {
  const qr = (): PrimitiveItem => ({
    id: "qr",
    kind: "primitive",
    locked: false,
    hidden: false,
    primitive: {
      type: "qrcode",
      data: "ODX",
      x: 1,
      y: 2,
      boxsize: 3,
      border: 1,
      color: "black",
      bgcolor: "white",
    },
  });

  it("limits the module size of a QR code to what its definition says", () => {
    const moduleSize = layoutFields(qr(), dashboard, primitiveDefinitions)
      .grid[2];
    expect(moduleSize).toMatchObject({ label: "Module size", min: 1, max: 16 });
  });

  it("limits a radius by the shorter side of the display", () => {
    const radius = layoutFields(circleItem(), dashboard, primitiveDefinitions)
      .grid[2];
    expect(radius.max).toBe(300);
  });

  it("shows no layout fields for a primitive the backend does not offer", () => {
    expect(layoutFields(circleItem(), dashboard, [])).toEqual({
      grid: [],
      extra: [],
    });
  });

  it("does not show fields the backend fixes", () => {
    const [definition] = primitiveDefinitions;
    const hidden: PrimitiveDefinition = {
      ...definition,
      fields: definition.fields.map((field) =>
        field.key === "color" ? { ...field, visible: false } : field
      ),
    };

    const names = primitiveAppearanceSchema(textItem(), "bw", [hidden]).map(
      (entry) => entry.name
    );

    expect(names).not.toContain("color");
    expect(names).toContain("value");
  });

  it("offers enums as their options and booleans as switches", () => {
    const bar: PrimitiveItem = {
      id: "b",
      kind: "primitive",
      locked: false,
      hidden: false,
      primitive: {
        type: "progress_bar",
        x_start: 0,
        y_start: 0,
        x_end: 9,
        y_end: 9,
        progress: 50,
        direction: "right",
        background: "white",
        fill: "accent",
        outline: "black",
        width: 1,
        show_percentage: true,
      },
    };
    const schema = primitiveAppearanceSchema(bar, "bw", primitiveDefinitions);
    expect(
      schema.find((entry) => entry.name === "direction")?.selector
    ).toEqual({
      select: { options: ["right", "left", "up", "down"] },
    });
    expect(
      schema.find((entry) => entry.name === "show_percentage")?.selector
    ).toEqual({ boolean: {} });
  });

  it("shows an empty optional colour as transparent and stores it back as none", () => {
    const rectangle = rectangleItem();
    const data = appearanceFormData(rectangle, primitiveDefinitions);
    expect(data.fill).toBe("transparent");

    const definition = definitionFor(rectangle, primitiveDefinitions);
    expect(
      primitiveValuesFromForm({ fill: "transparent", width: 3 }, definition)
    ).toEqual({ fill: null, width: 3 });
    expect(primitiveValuesFromForm({ fill: "red" }, definition)).toEqual({
      fill: "red",
    });
  });
});

describe("the shapes with several points or nested settings", () => {
  const forDefinitions = (item: PrimitiveItem) =>
    primitiveAppearanceSchema(item, "bwr", primitiveDefinitions);
  const selectorOf = (item: PrimitiveItem, name: string) =>
    forDefinitions(item).find((entry) => entry.name === name)?.selector;

  it("lays out a pattern by its origin, cell size, gaps and counts", () => {
    const { grid } = layoutFields(
      primitiveItem("rectangle_pattern", "p"),
      dashboard,
      primitiveDefinitions
    );

    expect(keys(grid)).toEqual([
      "x_start",
      "y_start",
      "x_size",
      "y_size",
      "x_offset",
      "y_offset",
      "x_repeat",
      "y_repeat",
    ]);
  });

  it("has no numeric layout for a polygon or a debug grid, and no corners to edit", () => {
    for (const type of ["polygon", "debug_grid"] as const) {
      const item = primitiveItem(type, "p");

      expect(layoutFields(item, dashboard, primitiveDefinitions).grid).toEqual(
        []
      );
      expect(hasCornerFields(item, primitiveDefinitions)).toBe(false);
    }
  });

  it("offers the corners of a plot like those of any box", () => {
    expect(
      hasCornerFields(primitiveItem("plot", "p"), primitiveDefinitions)
    ).toBe(true);
  });

  it("shows the anchor, which is not a number, with the appearance", () => {
    const names = forDefinitions(textItem()).map((entry) => entry.name);

    expect(names).toContain("anchor");
  });

  it("picks corners from a multiple select and fonts from a list that takes other names", () => {
    const rectangle = rectangleItem();
    const text = textItem();

    expect(selectorOf(rectangle, "corners")).toEqual({
      select: {
        options: ["top_left", "top_right", "bottom_right", "bottom_left"],
        multiple: true,
      },
    });
    expect(selectorOf(text, "font")).toEqual({
      select: { options: ["ppb.ttf", "rbm.ttf"], custom_value: true },
    });
  });

  it("types points and icons as lines of text", () => {
    expect(selectorOf(primitiveItem("polygon", "p"), "points")).toEqual({
      text: { multiline: true },
    });
    expect(selectorOf(primitiveItem("icon_sequence", "s"), "icons")).toEqual({
      text: { multiline: true },
    });
  });

  it("edits plot series as a list of objects and each axis as one object", () => {
    const plot = primitiveItem("plot", "p");
    const series = selectorOf(plot, "data") as {
      object: { multiple: boolean; label_field: string; fields: object };
    };
    const axis = selectorOf(plot, "yaxis") as { object: { fields: object } };

    expect(series.object.multiple).toBe(true);
    expect(series.object.label_field).toBe("entity");
    expect(Object.keys(series.object.fields)).toContain("smooth");
    expect(Object.keys(axis.object.fields)).toContain("grid_style");
  });

  it("shows values the way their controls take them, and reads them back", () => {
    const polygon = primitiveItem("polygon", "p", {
      points: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    });

    const data = appearanceFormData(polygon, primitiveDefinitions);
    const back = primitiveValuesFromForm(
      { points: data.points },
      primitiveDefinitions.find((definition) => definition.type === "polygon")
    );

    expect(data.points).toBe("1, 2\n3, 4\n5, 6");
    expect(back.points).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("keeps the points while the text typed is not yet a list of pairs", () => {
    const back = primitiveValuesFromForm(
      { points: "1, 2\nx", fill: "red" },
      primitiveDefinitions.find((definition) => definition.type === "polygon")
    );

    expect(back).toEqual({ fill: "red" });
  });
});
