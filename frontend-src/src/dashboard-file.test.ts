import { describe, expect, it } from "vitest";
import { exportFileName, parseJson, suggestedMapping } from "./dashboard-file";

describe("exportFileName", () => {
  it("turns the name of a dashboard into a safe file name", () => {
    expect(exportFileName("Kitchen display")).toBe("kitchen-display.json");
    expect(exportFileName("  Hall / 2nd floor!  ")).toBe("hall-2nd-floor.json");
  });

  it("drops accents, as a name in Polish or German has them", () => {
    expect(exportFileName("Łazienka na parterze")).toBe(
      "lazienka-na-parterze.json"
    );
    expect(exportFileName("Küche")).toBe("kuche.json");
  });

  it("falls back to a name when nothing is left", () => {
    expect(exportFileName("")).toBe("dashboard.json");
    expect(exportFileName("???")).toBe("dashboard.json");
  });
});

describe("suggestedMapping", () => {
  it("puts every color on its suggestion", () => {
    expect(
      suggestedMapping([
        { source: "red", suggestion: "black" },
        { source: "yellow", suggestion: "white" },
      ])
    ).toEqual({ red: "black", yellow: "white" });
  });
});

describe("parseJson", () => {
  it("reads JSON and gives nothing for anything else", () => {
    expect(parseJson('{"a": 1}')).toEqual({ a: 1 });
    expect(parseJson("not json")).toBeUndefined();
  });
});
