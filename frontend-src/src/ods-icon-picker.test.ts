import { describe, expect, it } from "vitest";
import { matchingIcons, storedIconName, visibleRows } from "./ods-icon-picker";

const icons = [
  "home",
  "home-outline",
  "lightbulb-home",
  "water",
  "weather-sunny",
];

describe("matchingIcons", () => {
  it("lists the icons that contain every word, those that start with the first first", () => {
    expect(matchingIcons(icons, "home")).toEqual([
      "home",
      "home-outline",
      "lightbulb-home",
    ]);
    expect(matchingIcons(icons, "home out")).toEqual(["home-outline"]);
  });

  it("ignores case and spaces around the search", () => {
    expect(matchingIcons(icons, "  WATER ")).toEqual(["water"]);
  });

  it("shows the start of the list for an empty search, and nothing for no match", () => {
    expect(matchingIcons(icons, "")).toEqual(icons);
    expect(matchingIcons(icons, "zzz")).toEqual([]);
  });

  it("lists every match, however many there are", () => {
    const many = Array.from({ length: 5000 }, (_, index) => `icon-${index}`);

    expect(matchingIcons(many, "icon")).toHaveLength(5000);
  });
});

describe("storedIconName", () => {
  it("drops the mdi prefix, as ODL writes the names", () => {
    expect(storedIconName("mdi:home")).toBe("home");
    expect(storedIconName("home")).toBe("home");
  });
});

describe("visibleRows", () => {
  it("draws the rows in view with a margin, and none beyond the list", () => {
    expect(visibleRows(0, 13000)).toEqual({ first: 0, last: 14 });
    expect(visibleRows(3600, 13000)).toEqual({ first: 94, last: 114 });
    expect(visibleRows(0, 3)).toEqual({ first: 0, last: 3 });
  });
});
