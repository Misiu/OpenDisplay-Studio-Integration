import { describe, expect, it } from "vitest";
import { itemIcon, itemName } from "./item-labels";
import { circleItem, widgetItem } from "./test-support";
import type { WidgetDefinition } from "./types";

const sensor: WidgetDefinition = {
  id: "sensor",
  version: "1",
  name: "Sensor",
  description: "",
  icon: "mdi:gauge",
  defaults: {},
  fields: [],
  layout: {
    defaultSize: { width: 1, height: 1 },
    minSize: { width: 1, height: 1 },
  },
  dataRequirements: [],
};

describe("item labels", () => {
  it("names primitives by their type and widgets by title, then definition, then id", () => {
    expect(itemName(circleItem(), [])).toBe("Circle");
    const widget = widgetItem();
    expect(itemName(widget, [sensor])).toBe("Sensor");
    widget.widget.config = { title: "  Kitchen " };
    expect(itemName(widget, [sensor])).toBe("  Kitchen ");
    widget.widget.config = { title: "   " };
    expect(itemName(widget, [])).toBe("sensor");
  });

  it("picks the primitive icon, the widget icon, or a puzzle piece for unknown widgets", () => {
    expect(itemIcon(circleItem(), [])).toBe("mdi:circle-outline");
    expect(itemIcon(widgetItem(), [sensor])).toBe("mdi:gauge");
    expect(itemIcon(widgetItem(), [])).toBe("mdi:puzzle");
  });
});
