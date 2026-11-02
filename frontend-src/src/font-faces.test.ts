import { describe, expect, it } from "vitest";
import { faceName, fontUrl } from "./font-faces";
import type { FontInfo } from "./types";

const font = (overrides: Partial<FontInfo>): FontInfo => ({
  name: "Roboto-Bold.ttf",
  family: "Roboto",
  style: "Bold",
  bundled: false,
  size: 1000,
  version: 7,
  usedBy: [],
  ...overrides,
});

describe("faceName", () => {
  it("is a name CSS accepts, whatever the file is called", () => {
    expect(faceName(font({ name: "My Font (v2).otf" }))).toBe(
      "ods-font-My_Font__v2__otf-7"
    );
  });

  it("is another name when the file is another version, so a replaced font is loaded again", () => {
    expect(faceName(font({ version: 8 }))).not.toBe(faceName(font({})));
  });
});

describe("fontUrl", () => {
  it("asks the integration for the file, with its version", () => {
    expect(fontUrl(font({}))).toBe(
      "/api/opendisplay_studio/fonts/Roboto-Bold.ttf?v=7"
    );
  });

  it("keeps a name with a space or a bracket in one piece", () => {
    expect(fontUrl(font({ name: "My Font (1).ttf" }))).toContain(
      "My%20Font%20(1).ttf"
    );
  });
});
