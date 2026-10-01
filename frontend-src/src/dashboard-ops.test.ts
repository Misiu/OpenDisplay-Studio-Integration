import { describe, expect, it } from "vitest";
import {
  catalogCascadePosition,
  createPrimitiveItem,
  createWidgetItem,
  moveLayer,
  removeItem,
  setDisplayNumber,
  setItemExpression,
  setItemNumber,
  toggleItemState,
  resetPrimitiveFields,
  setPrimitiveField,
  updatePrimitiveFields,
} from "./dashboard-ops";
import { itemBounds } from "./geometry";
import {
  circleItem,
  dashboardWith,
  rectangleItem,
  textItem,
  widgetItem,
  primitiveDefinitions,
  widgetDefinition,
} from "./test-support";

const sensor = widgetDefinition("sensor-card");

describe("setItemNumber", () => {
  it("moves a rectangle while keeping its size, up to the far edge of the working area", () => {
    const dashboard = dashboardWith([rectangleItem("r")]);
    setItemNumber(dashboard, "r", "x", 1000, primitiveDefinitions);
    expect(itemBounds(dashboard.items[0])).toMatchObject({
      x: 400,
      width: 100,
    });
  });

  it("resizes widgets within the remaining working area", () => {
    const dashboard = dashboardWith([widgetItem("w")]);
    setItemNumber(dashboard, "w", "width", 5000, primitiveDefinitions);
    expect(itemBounds(dashboard.items[0]).width).toBe(390);
  });

  it("changes the circle radius and the QR module size", () => {
    const dashboard = dashboardWith([circleItem("c")]);
    setItemNumber(dashboard, "c", "radius", 30, primitiveDefinitions);
    expect(itemBounds(dashboard.items[0]).width).toBe(61);
  });

  it("leaves locked items untouched", () => {
    const item = rectangleItem("r");
    item.locked = true;
    const dashboard = dashboardWith([item]);
    setItemNumber(dashboard, "r", "x", 200, primitiveDefinitions);
    expect(itemBounds(dashboard.items[0]).x).toBe(20);
  });
});

describe("display settings", () => {
  it("clamps padding to half of the smaller side", () => {
    const dashboard = dashboardWith();
    setDisplayNumber(dashboard, "padding", 9999);
    expect(dashboard.display.padding).toBe(149);
  });

  it("keeps the device when only the padding changes", () => {
    const dashboard = dashboardWith([], { deviceId: "d1" });

    setDisplayNumber(dashboard, "padding", 10);

    expect(dashboard.display.deviceId).toBe("d1");
  });
});

describe("item list operations", () => {
  it("toggles hidden and locked, and removes an item", () => {
    const dashboard = dashboardWith([rectangleItem("a"), textItem("b")]);
    toggleItemState(dashboard, "a", "hidden");
    toggleItemState(dashboard, "a", "locked");
    expect(dashboard.items[0]).toMatchObject({ hidden: true, locked: true });
    removeItem(dashboard, "a");
    expect(dashboard.items.map((item) => item.id)).toEqual(["b"]);
  });

  it("reorders layers: the layer list shows the top item first", () => {
    const dashboard = dashboardWith([
      rectangleItem("bottom"),
      textItem("middle"),
      circleItem("top"),
    ]);
    moveLayer(dashboard, "bottom", "top", "before");
    expect(dashboard.items.map((item) => item.id)).toEqual([
      "middle",
      "top",
      "bottom",
    ]);
    moveLayer(dashboard, "bottom", "middle", "after");
    expect(dashboard.items.map((item) => item.id)).toEqual([
      "bottom",
      "middle",
      "top",
    ]);
  });

  it("ignores a reorder that names an unknown layer", () => {
    const dashboard = dashboardWith([rectangleItem("a")]);
    moveLayer(dashboard, "a", "missing", "after");
    expect(dashboard.items.map((item) => item.id)).toEqual(["a"]);
  });
});

describe("creating items from the catalog", () => {
  it("centres a new widget on the drop point inside the working area", () => {
    const item = createWidgetItem(sensor, 200, 150, dashboardWith());
    expect(item).toMatchObject({
      kind: "widget",
      widget: {
        type: "sensor-card",
        version: "1.0.0",
        sources: { entities: [] },
        options: { layout: "single", showIcon: true, decimals: "auto" },
      },
    });
    expect(item.frame).toEqual({ x: 60, y: 70, width: 280, height: 160 });
  });

  it("never makes a widget larger than the working area", () => {
    const item = createWidgetItem(
      sensor,
      10,
      10,
      dashboardWith([], { width: 100, height: 80 })
    );
    expect(item.frame).toMatchObject({ width: 100, height: 80, x: 0, y: 0 });
  });

  it("centres a new primitive on the drop point", () => {
    const item = createPrimitiveItem(
      primitiveDefinitions,
      "circle",
      200,
      150,
      dashboardWith()
    );
    expect(item).toMatchObject({
      kind: "primitive",
      primitive: { type: "circle", x: 200, y: 150 },
    });
  });

  it("returns undefined for an unsupported primitive type", () => {
    expect(
      createPrimitiveItem(
        primitiveDefinitions,
        "hexagon",
        10,
        10,
        dashboardWith()
      )
    ).toBeUndefined();
  });

  it("cascades click-added items so they do not stack exactly", () => {
    const empty = catalogCascadePosition(dashboardWith(), true);
    const busy = catalogCascadePosition(
      dashboardWith([rectangleItem("a"), textItem("b")]),
      true
    );
    expect(empty).toEqual({ x: 25, y: 25 });
    expect(busy.x).toBeGreaterThan(empty.x);
  });
});

describe("editing point primitives through their definition", () => {
  it("keeps a text size within the limits its definition declares", () => {
    const dashboard = dashboardWith([textItem("t")]);
    setItemNumber(dashboard, "t", "size", 9999, primitiveDefinitions);
    expect(dashboard.items[0]).toMatchObject({ primitive: { size: 256 } });
    setItemNumber(dashboard, "t", "size", 1, primitiveDefinitions);
    expect(dashboard.items[0]).toMatchObject({ primitive: { size: 6 } });
  });

  it("lets a circle leave the working area when its centre moves, by its size at most", () => {
    const dashboard = dashboardWith([circleItem("c")]);
    setItemNumber(dashboard, "c", "x", 9999, primitiveDefinitions);
    expect(itemBounds(dashboard.items[0]).x).toBe(400);
    setItemNumber(dashboard, "c", "x", -9999, primitiveDefinitions);
    expect(itemBounds(dashboard.items[0]).x).toBe(-41);
  });

  it("ignores a key that is not a layout field of the primitive", () => {
    const dashboard = dashboardWith([circleItem("c")]);
    const before = structuredClone(dashboard);
    setItemNumber(dashboard, "c", "boxsize", 5, primitiveDefinitions);
    expect(dashboard).toEqual(before);
  });

  it("stores an empty optional colour as none when the form reports transparent", () => {
    const dashboard = dashboardWith([rectangleItem("r", { fill: "red" })]);
    updatePrimitiveFields(
      dashboard,
      "r",
      { fill: "transparent" },
      primitiveDefinitions
    );
    expect(dashboard.items[0]).toMatchObject({ primitive: { fill: null } });
  });
});

describe("setItemExpression", () => {
  it("starts an expression from the current value, and keeps the literal", () => {
    const dashboard = dashboardWith([textItem("t")]);

    setItemExpression(dashboard, "t", "size", undefined);

    const item = dashboard.items[0];
    expect(item?.expressions).toEqual({ size: "{{ 32 }}" });
    expect(item?.kind === "primitive" && item.primitive).toMatchObject({
      size: 32,
    });
  });

  it("stores the template exactly as typed", () => {
    const dashboard = dashboardWith([textItem("t")]);

    setItemExpression(
      dashboard,
      "t",
      "value",
      "{{ states('sensor.t')|round }}"
    );

    expect(dashboard.items[0]?.expressions).toEqual({
      value: "{{ states('sensor.t')|round }}",
    });
  });

  it("returns a field to its literal and drops an empty map", () => {
    const dashboard = dashboardWith([textItem("t")]);
    setItemExpression(dashboard, "t", "size", undefined);

    setItemExpression(dashboard, "t", "size", null);

    expect(dashboard.items[0]).not.toHaveProperty("expressions");
  });

  it("starts visibility from whether the item is shown now", () => {
    const shown = dashboardWith([textItem("t")]);
    const hiddenItem = { ...textItem("h"), hidden: true };
    const hidden = dashboardWith([hiddenItem]);

    setItemExpression(shown, "t", "visible", undefined);
    setItemExpression(hidden, "h", "visible", undefined);

    expect(shown.items[0]?.expressions).toEqual({ visible: "{{ true }}" });
    expect(hidden.items[0]?.expressions).toEqual({ visible: "{{ false }}" });
  });

  it("leaves a locked item alone", () => {
    const dashboard = dashboardWith([{ ...textItem("t"), locked: true }]);

    setItemExpression(dashboard, "t", "size", undefined);

    expect(dashboard.items[0]).not.toHaveProperty("expressions");
  });
});

describe("resetPrimitiveFields", () => {
  it("puts fields back to their values and drops the expressions that drove them", () => {
    const item = {
      ...textItem("t"),
      expressions: { color: "{{ 'red' }}", size: "{{ 30 }}" },
    };
    const dashboard = dashboardWith([item]);
    setPrimitiveField(dashboard, "t", "size", 40);

    resetPrimitiveFields(dashboard, "t", { size: 20, color: "black" });

    expect(dashboard.items[0]).toMatchObject({
      primitive: { size: 20, color: "black" },
    });
    expect(dashboard.items[0]).not.toHaveProperty("expressions");
  });

  it("keeps the expressions of the fields it does not reset", () => {
    const item = {
      ...textItem("t"),
      expressions: { x: "{{ 5 }}", size: "{{ 3 }}" },
    };
    const dashboard = dashboardWith([item]);

    resetPrimitiveFields(dashboard, "t", { size: 20 });

    expect(dashboard.items[0]).toMatchObject({ expressions: { x: "{{ 5 }}" } });
  });

  it("leaves a locked element alone", () => {
    const base = textItem("t");
    const locked = {
      ...base,
      locked: true,
      primitive: { ...base.primitive, size: 33 },
    };
    const dashboard = dashboardWith([locked]);

    resetPrimitiveFields(dashboard, "t", { size: 20 });

    expect(dashboard.items[0]).toMatchObject({ primitive: { size: 33 } });
  });
});

describe("setPrimitiveField", () => {
  it("sets a stored value, which the definitions have already allowed", () => {
    const dashboard = dashboardWith([textItem("t")]);

    setPrimitiveField(dashboard, "t", "color", "red");

    expect(dashboard.items[0]).toMatchObject({ primitive: { color: "red" } });
  });

  it("keeps a text where it is drawn when its anchor changes", () => {
    const dashboard = dashboardWith([textItem("t")]);
    const measured = { x: 0, y: 0, width: 100, height: 40 };
    const before = itemBounds(dashboard.items[0], measured);

    setPrimitiveField(dashboard, "t", "anchor", "mm", measured);

    expect(itemBounds(dashboard.items[0], measured)).toEqual(before);
    expect(dashboard.items[0]).toMatchObject({ primitive: { anchor: "mm" } });
  });

  it("changes only the anchor when the position is driven by an expression", () => {
    const item = { ...textItem("t"), expressions: { x: "{{ 5 }}" } };
    const dashboard = dashboardWith([item]);
    const measured = { x: 0, y: 0, width: 100, height: 40 };

    setPrimitiveField(dashboard, "t", "anchor", "mm", measured);

    expect(dashboard.items[0]).toMatchObject({
      primitive: { anchor: "mm", x: 10, y: 10 },
    });
  });

  it("does nothing to a locked element", () => {
    const dashboard = dashboardWith([{ ...textItem("t"), locked: true }]);

    setPrimitiveField(dashboard, "t", "color", "red");

    expect(dashboard.items[0]).toMatchObject({ primitive: { color: "black" } });
  });
});
