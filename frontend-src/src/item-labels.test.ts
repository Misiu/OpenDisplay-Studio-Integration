import { describe, expect, it } from "vitest";
import { itemIcon } from "./item-labels";
import {
  circleItem,
  primitiveDefinitions,
  widgetDefinition,
  widgetItem,
} from "./test-support";

describe("item labels", () => {
  it("picks the primitive icon, the widget icon, or a puzzle piece for unknown widgets", () => {
    expect(itemIcon(circleItem(), [], primitiveDefinitions)).toBe(
      "mdi:circle-outline"
    );
    expect(
      itemIcon(
        widgetItem(),
        [widgetDefinition("sensor-card")],
        primitiveDefinitions
      )
    ).toBe("mdi:gauge");
    expect(itemIcon(widgetItem(), [], primitiveDefinitions)).toBe("mdi:puzzle");
  });
});
