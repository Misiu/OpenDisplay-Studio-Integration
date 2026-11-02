import { describe, expect, it } from "vitest";
import { fontByName, fontLabel } from "./font-catalog";
import type { FontInfo } from "./types";

const font = (overrides: Partial<FontInfo>): FontInfo => ({
  name: "Roboto-Bold.ttf",
  family: "Roboto",
  style: "Bold",
  bundled: false,
  size: 1000,
  preview: null,
  usedBy: [],
  ...overrides,
});

describe("fontLabel", () => {
  it("names a font by its family and style", () => {
    expect(fontLabel(font({}))).toBe("Roboto Bold");
  });

  it("leaves out a plain Regular style or no style", () => {
    expect(fontLabel(font({ style: "Regular" }))).toBe("Roboto");
    expect(fontLabel(font({ style: "" }))).toBe("Roboto");
  });
});

describe("fontByName", () => {
  it("finds a font by the file name a dashboard stores", () => {
    const list = [font({ name: "a.ttf" }), font({ name: "b.ttf" })];

    expect(fontByName(list, "b.ttf")?.name).toBe("b.ttf");
    expect(fontByName(list, "c.ttf")).toBeUndefined();
  });
});
