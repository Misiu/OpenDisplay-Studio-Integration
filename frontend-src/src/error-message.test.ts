import { describe, expect, it } from "vitest";
import { codeFrom, messageFrom } from "./error-message";

describe("messageFrom", () => {
  it("reads the message of an error", () => {
    expect(messageFrom(new Error("It broke"), "Fallback")).toBe("It broke");
  });

  it("reads the message of a rejection from Home Assistant, which is a plain object", () => {
    expect(
      messageFrom(
        { code: "invalid_dashboard", message: "dlimg_1.ysize is too large" },
        "Fallback"
      )
    ).toBe("dlimg_1.ysize is too large");
  });

  it("reads a text", () => {
    expect(messageFrom("Gone", "Fallback")).toBe("Gone");
  });

  it("falls back when there is nothing to say", () => {
    expect(messageFrom(undefined, "Fallback")).toBe("Fallback");
    expect(messageFrom({ code: "x" }, "Fallback")).toBe("Fallback");
    expect(messageFrom({ message: "" }, "Fallback")).toBe("Fallback");
    expect(messageFrom(new Error(""), "Fallback")).toBe("Fallback");
  });
});

describe("codeFrom", () => {
  it("reads the code of a rejection from Home Assistant", () => {
    expect(codeFrom({ code: "font_in_use", message: "In use" })).toBe(
      "font_in_use"
    );
  });

  it("has no code for anything else", () => {
    expect(codeFrom(new Error("It broke"))).toBeUndefined();
    expect(codeFrom({ code: "" })).toBeUndefined();
    expect(codeFrom(undefined)).toBeUndefined();
  });
});
