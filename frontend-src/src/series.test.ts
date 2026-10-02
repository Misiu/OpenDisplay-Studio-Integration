import { describe, expect, it } from "vitest";
import {
  canAddSeries,
  canRemoveSeries,
  isSeriesField,
  newSeries,
  seriesOf,
  withoutSeries,
  withSeriesValues,
} from "./series";
import { primitiveDefinitions } from "./test-support";

const field = (() => {
  const plot = primitiveDefinitions.find((entry) => entry.type === "plot");
  const data = plot?.fields.find((entry) => entry.key === "data");
  if (!data) throw new Error("The plot has no series field");
  return data;
})();

describe("isSeriesField", () => {
  it("is true for the series of a plot and false for other lists", () => {
    expect(isSeriesField(field)).toBe(true);
    expect(isSeriesField({ ...field, shape: "points" })).toBe(false);
  });
});

describe("series of a plot", () => {
  it("start from the defaults of the field with the entity chosen", () => {
    expect(newSeries(field, "sensor.power")).toMatchObject({
      entity: "sensor.power",
      width: 2,
      smooth: false,
    });
  });

  it("are kept between the limits of the field", () => {
    const one = [{ entity: "sensor.a" }];
    const four = Array.from({ length: 4 }, () => ({ entity: "sensor.a" }));

    expect(canRemoveSeries(field, one)).toBe(false);
    expect(canRemoveSeries(field, four)).toBe(true);
    expect(canAddSeries(field, one)).toBe(true);
    expect(canAddSeries(field, four)).toBe(false);
  });

  it("change one series and leave the others", () => {
    const list = [{ entity: "sensor.a" }, { entity: "sensor.b" }];

    expect(withSeriesValues(list, 1, { entity: "sensor.c" })).toEqual([
      { entity: "sensor.a" },
      { entity: "sensor.c" },
    ]);
    expect(withoutSeries(list, 0)).toEqual([{ entity: "sensor.b" }]);
  });

  it("are read from a stored value, ignoring anything that is not an object", () => {
    expect(seriesOf([{ entity: "sensor.a" }, 3, null, "x"])).toEqual([
      { entity: "sensor.a" },
    ]);
    expect(seriesOf(undefined)).toEqual([]);
  });
});
