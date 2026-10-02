import { describe, expect, it } from "vitest";
import { messageFrom } from "./error-message";

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
