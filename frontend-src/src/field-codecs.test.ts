import { describe, expect, it } from "vitest";
import { UNCHANGED, valueForForm, valueFromForm } from "./field-codecs";
import { primitiveDefinitions } from "./test-support";
import type { PrimitiveField } from "./types";

const fieldOf = (type: string, key: string): PrimitiveField => {
  const field = primitiveDefinitions
    .find((definition) => definition.type === type)
    ?.fields.find((candidate) => candidate.key === key);
  if (!field) throw new Error(`No field ${type}.${key}`);
  return field;
};

describe("points", () => {
  const field = fieldOf("polygon", "points");

  it("are typed as one x, y pair per line", () => {
    const points = [
      [10, 20],
      [-5, 30],
      [7, 8],
    ];
    const text = valueForForm(field, points);

    expect(text).toBe("10, 20\n-5, 30\n7, 8");
    expect(valueFromForm(field, text)).toEqual(points);
  });

  it("accept a comma, a semicolon or a space between the numbers", () => {
    expect(valueFromForm(field, "1,2\n3;4\n5 6")).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("leave the stored points alone while the text is not a list of pairs", () => {
    expect(valueFromForm(field, "1, 2\nthree")).toBe(UNCHANGED);
  });
});

describe("icons", () => {
  const field = fieldOf("icon_sequence", "icons");

  it("are typed one per line, and blank lines are dropped", () => {
    expect(valueForForm(field, ["home", "star"])).toBe("home\nstar");
    expect(valueFromForm(field, " home \n\nstar\n")).toEqual(["home", "star"]);
  });
});

describe("flags", () => {
  const field = fieldOf("rectangle", "corners");

  it("are picked from a list, and none picked means unset", () => {
    expect(valueForForm(field, "top_left,bottom_right")).toEqual([
      "top_left",
      "bottom_right",
    ]);
    expect(valueFromForm(field, ["top_left", "bottom_right"])).toBe(
      "top_left,bottom_right"
    );
    expect(valueForForm(field, null)).toEqual([]);
    expect(valueFromForm(field, [])).toBeNull();
  });
});

describe("optional numbers", () => {
  const field = fieldOf("text", "max_width");

  it("are shown empty when unset and stored as null when cleared", () => {
    expect(valueForForm(field, null)).toBeUndefined();
    expect(valueFromForm(field, undefined)).toBeNull();
    expect(valueFromForm(field, "")).toBeNull();
    expect(valueFromForm(field, 120)).toBe(120);
  });
});

describe("optional objects", () => {
  const field = fieldOf("plot", "yaxis");

  it("are shown empty when unset and stored as null when emptied", () => {
    expect(valueForForm(field, null)).toEqual({});
    expect(valueFromForm(field, {})).toBeNull();
    expect(valueFromForm(field, { grid: false })).toEqual({ grid: false });
  });
});

describe("transparent colours", () => {
  const field = fieldOf("rectangle", "fill");

  it("are shown as transparent and stored as null", () => {
    expect(valueForForm(field, null)).toBe("transparent");
    expect(valueFromForm(field, "transparent")).toBeNull();
    expect(valueFromForm(field, "red")).toBe("red");
  });
});
