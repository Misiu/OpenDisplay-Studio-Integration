import { describe, expect, it } from "vitest";
import { matchingIcons, storedIconName } from "./ods-icon-picker";

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

  it("never draws more than a screenful", () => {
    const many = Array.from({ length: 500 }, (_, index) => `icon-${index}`);

    expect(matchingIcons(many, "icon")).toHaveLength(96);
  });
});

describe("storedIconName", () => {
  it("drops the mdi prefix, as ODL writes the names", () => {
    expect(storedIconName("mdi:home")).toBe("home");
    expect(storedIconName("home")).toBe("home");
  });
});
