import { describe, expect, it } from "vitest";
import { filterCatalog } from "./catalog";

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
