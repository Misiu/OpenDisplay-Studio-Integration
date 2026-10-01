import { describe, expect, it } from "vitest";
import {
  hasCornerFields,
  layoutFields,
  fieldFormSchema,
  primitiveFields,
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

describe("primitiveFields", () => {
  const names = (
    item: PrimitiveItem,
    section: "layout" | "appearance",
    definitions = primitiveDefinitions
  ) => primitiveFields(item, definitions, section).map((field) => field.key);

  it("lists the appearance of each primitive type, in the order of its definition", () => {
    expect(names(textItem(), "appearance")).toEqual([
      "value",
      "color",
      "max_width",
      "truncate",
      "font",
      "align",
      "spacing",
      "stroke_width",
      "stroke_fill",
      "parse_colors",
    ]);
    expect(names(rectangleItem(), "appearance")).toEqual([
      "fill",
      "outline",
      "width",
      "radius",
      "corners",
    ]);
    expect(names(circleItem(), "appearance")).toEqual([
      "fill",
      "outline",
      "width",
    ]);
  });

  it("lists what is not a number in the layout section with the layout, the anchor first", () => {
    expect(names(textItem(), "layout")).toEqual(["anchor"]);
    expect(names(circleItem(), "layout")).toEqual([]);
    expect(names(primitiveItem("icon_sequence", "s"), "layout")).toEqual([
      "direction",
      "anchor",
    ]);
  });

  it("does not list fields the backend fixes", () => {
    const [definition] = primitiveDefinitions;
    const hidden: PrimitiveDefinition = {
      ...definition,
      fields: definition.fields.map((field) =>
        field.key === "color" ? { ...field, visible: false } : field
      ),
    };

    const listed = names(textItem(), "appearance", [hidden]);

    expect(listed).not.toContain("color");
    expect(listed).toContain("value");
  });

  it("lists nothing for a type the backend does not offer", () => {
    expect(names(textItem(), "appearance", [])).toEqual([]);
  });
});

describe("fieldFormSchema", () => {
  const schemaOf = (type: Parameters<typeof primitiveItem>[0], key: string) => {
    const definition = primitiveDefinitions.find(
      (entry) => entry.type === type
    );
    const field = definition?.fields.find((entry) => entry.key === key);
    if (!field) throw new Error(`No field ${type}.${key}`);
    return fieldFormSchema(field, "bwr");
  };

  it("edits plot series as a list of objects and each axis as one object", () => {
    const series = schemaOf("plot", "data").selector as {
      object: { multiple: boolean; label_field: string; fields: object };
    };
    const axis = schemaOf("plot", "yaxis").selector as {
      object: { fields: object };
    };

    expect(series.object.multiple).toBe(true);
    expect(series.object.label_field).toBe("entity");
    expect(Object.keys(series.object.fields)).toContain("smooth");
    expect(Object.keys(axis.object.fields)).toContain("grid_style");
  });

  it("picks the entity of a series with an entity picker", () => {
    const series = schemaOf("plot", "data").selector as {
      object: { fields: { entity: { selector: object } } };
    };

    expect(series.object.fields.entity.selector).toEqual({ entity: {} });
  });

  it("lets the multiplier of a series have a fraction", () => {
    const series = schemaOf("plot", "data").selector as {
      object: {
        fields: { value_scale: { selector: { number: { step: string } } } };
      };
    };

    expect(series.object.fields.value_scale.selector.number.step).toBe("any");
  });

  it("limits the colors inside nested settings to the palette plus accent", () => {
    const series = schemaOf("plot", "data").selector as {
      object: {
        fields: { color: { selector: { select: { options: string[] } } } };
      };
    };

    expect(series.object.fields.color.selector.select.options).toEqual([
      "black",
      "white",
      "red",
      "accent",
    ]);
  });
});

describe("the shapes with several points or nested settings", () => {
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
});
