import { describe, expect, it } from "vitest";
import { defaultItemName } from "./item-names";
import type { StudioItem } from "./types";
import { circleItem, rectangleItem, textItem } from "./test-support";

const named = <T extends StudioItem>(item: T, name: string): T => ({
  ...item,
  name,
});

describe("defaultItemName", () => {
  it("starts at 1 for a type nothing uses yet", () => {
    expect(defaultItemName([], "text")).toBe("text_1");
  });

  it("numbers each type on its own", () => {
    const items = [
      named(textItem("a"), "text_1"),
      named(rectangleItem("b"), "rectangle_1"),
      named(textItem("c"), "text_2"),
    ];

    expect(defaultItemName(items, "text")).toBe("text_3");
    expect(defaultItemName(items, "rectangle")).toBe("rectangle_2");
    expect(defaultItemName(items, "circle")).toBe("circle_1");
  });

  it("never reuses a name an item already has", () => {
    const renamed = named(textItem("a"), "text_2");

    expect(
      defaultItemName([renamed, named(textItem("b"), "text_1")], "text")
    ).toBe("text_3");
  });

  it("counts widgets by their widget id", () => {
    const items = [named(circleItem("a"), "circle_1")];

    expect(defaultItemName(items, "temperature")).toBe("temperature_1");
  });
});
