import { describe, expect, it } from "vitest";
import {
  appearanceFormData,
  definitionFor,
  layoutFields,
  primitiveAppearanceSchema,
  primitiveValuesFromForm,
} from "./item-fields";
import {
  circleItem,
  dashboardWith,
  rectangleItem,
  textItem,
  widgetItem,
  primitiveDefinitions,
} from "./test-support";
import type { PrimitiveItem } from "./types";

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
    expect(names(textItem())).toEqual(["value", "color"]);
    expect(names(rectangleItem())).toEqual(["fill", "outline", "width"]);
    expect(names(circleItem())).toEqual(["fill", "outline", "width"]);
    expect(
      names(
        rectangleItem("l", {
          type: "line",
          fill: "black",
          dashed: false,
        } as never)
      )
    ).toEqual(["fill", "width", "dashed"]);
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
    const icon: PrimitiveItem = {
      id: "i",
      kind: "primitive",
      locked: false,
      hidden: false,
      primitive: {
        type: "icon",
        value: "home",
        x: 1,
        y: 1,
        size: 24,
        color: "black",
        anchor: "lt",
      },
    };
    const names = primitiveAppearanceSchema(
      icon,
      "bw",
      primitiveDefinitions
    ).map((entry) => entry.name);
    expect(names).toEqual(["value", "color"]);
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
