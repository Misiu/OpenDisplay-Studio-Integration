import { describe, expect, it } from "vitest";
import { filterCatalog, primitiveSections } from "./catalog";

const items = [
  { name: "Temperature", description: "Current entity value" },
  { name: "Rectangle", description: "ODL shape primitive" },
];

describe("filterCatalog", () => {
  it("uses one case-insensitive query for names and descriptions", () => {
    expect(filterCatalog(items, "RECT")).toEqual([items[1]]);
    expect(filterCatalog(items, "entity")).toEqual([items[0]]);
  });

  it("keeps the original catalog when the query is empty", () => {
    expect(filterCatalog(items, "  ")).toBe(items);
  });
});

describe("primitiveSections", () => {
  const entry = (name: string, category: string) => ({ name, category });

  it("lists the sections in the order of the library, whatever the order of the entries", () => {
    const sections = primitiveSections([
      entry("Plot", "data"),
      entry("Text", "text"),
      entry("Line", "shapes"),
      entry("Grid", "debug"),
      entry("Icon", "media"),
    ]);

    expect(sections.map((section) => section.id)).toEqual([
      "text",
      "shapes",
      "media",
      "data",
      "debug",
    ]);
  });

  it("keeps the order of the entries inside a section and leaves empty sections out", () => {
    const sections = primitiveSections([
      entry("Line", "shapes"),
      entry("Arc", "shapes"),
    ]);

    expect(sections).toEqual([
      {
        id: "shapes",
        entries: [entry("Line", "shapes"), entry("Arc", "shapes")],
      },
    ]);
  });

  it("puts a category it does not know in a section of its own, at the end", () => {
    const sections = primitiveSections([
      entry("Gauge", "dials"),
      entry("Text", "text"),
    ]);

    expect(sections.map((section) => section.id)).toEqual(["text", "dials"]);
  });
});
