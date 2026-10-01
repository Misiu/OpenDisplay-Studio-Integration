import { describe, expect, it } from "vitest";
import { changedFields, defaultValues } from "./section-defaults";

const fields = [
  { key: "size", default: 20 },
  { key: "color", default: "black" },
  { key: "max_width" },
  { key: "points", default: [[0, 0]] },
];

describe("changedFields", () => {
  it("is empty while every field has its default", () => {
    const values = {
      size: 20,
      color: "black",
      max_width: null,
      points: [[0, 0]],
    };

    expect(changedFields(fields, values)).toEqual([]);
  });

  it("lists the fields that have another value, structured ones included", () => {
    const values = { size: 24, color: "black", points: [[1, 2]] };

    expect(changedFields(fields, values).map((field) => field.key)).toEqual([
      "size",
      "points",
    ]);
  });

  it("counts an unset optional field as its default, and a value as a change", () => {
    expect(
      changedFields(fields, { size: 20, color: "black", points: [[0, 0]] })
    ).toEqual([]);
    expect(
      changedFields(fields, {
        size: 20,
        color: "black",
        max_width: 100,
        points: [[0, 0]],
      })
    ).toEqual([{ key: "max_width" }]);
  });

  it("counts a field driven by an expression as changed, whatever its literal is", () => {
    const values = { size: 20, color: "black", points: [[0, 0]] };

    expect(
      changedFields(fields, values, { size: "{{ 20 }}" }).map(
        (field) => field.key
      )
    ).toEqual(["size"]);
  });
});

describe("defaultValues", () => {
  it("gives each field its default, or null when it has none", () => {
    expect(defaultValues(fields.slice(0, 3))).toEqual({
      size: 20,
      color: "black",
      max_width: null,
    });
  });
});
