import { describe, expect, it } from "vitest";
import {
  colorHex,
  colorLabel,
  PALETTE_COLORS,
  PALETTE_IDS,
  PALETTE_SWATCHES,
  paletteSchemes,
} from "./palettes";

describe("the palettes", () => {
  it("are those of OpenDisplay, by color scheme", () => {
    const schemes = PALETTE_IDS.flatMap((palette) => paletteSchemes(palette));

    expect(schemes.sort()).toEqual([
      "BWGBRY",
      "BWGBRY_SPLIT",
      "BWR",
      "BWRY",
      "BWY",
      "GRAYSCALE_16",
      "GRAYSCALE_4",
      "GRAYSCALE_8",
      "MONO",
      "SEVEN_COLOR",
    ]);
  });

  it("have as many colors as their scheme says", () => {
    const sizes = Object.fromEntries(
      PALETTE_IDS.map((id) => [id, PALETTE_COLORS[id].length])
    );

    expect(sizes).toEqual({
      bw: 2,
      bwr: 3,
      bwy: 3,
      bwry: 4,
      spectra6: 6,
      seven_color: 7,
      grayscale4: 4,
      grayscale8: 8,
      grayscale16: 16,
    });
  });

  it("give every color a hex to draw and a name to show", () => {
    for (const palette of PALETTE_IDS) {
      for (const color of PALETTE_SWATCHES[palette]) {
        expect(color.hex, `${palette} ${color.id}`).toMatch(/^#[0-9a-f]{6}$/);
        expect(colorLabel(color.id), color.id).not.toBe(color.id);
      }
    }
  });

  it("draw the accent as the color the palette uses for it", () => {
    expect(colorHex("accent", "bwr")).toBe("#ff0000");
    expect(colorHex("accent", "bwy")).toBe("#ffff00");
    expect(colorHex("accent", "grayscale4")).toBe("#000000");
  });

  it("draw a stored value by its hex, and nothing for what the palette lacks", () => {
    expect(colorHex("red", "bwr")).toBe("#ff0000");
    expect(colorHex("#555555", "grayscale4")).toBe("#555555");
    expect(colorHex("red", "bw")).toBeUndefined();
  });

  it("name the grays by level", () => {
    expect(colorLabel("gray3")).toBe("Gray 3");
    expect(colorLabel("accent")).toBe("Accent");
  });
});
