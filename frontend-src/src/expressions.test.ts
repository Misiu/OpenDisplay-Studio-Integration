import { describe, expect, it } from "vitest";
import { isExpressionValue, seedExpression } from "./expressions";

describe("isExpressionValue", () => {
  it("recognises both Jinja delimiters", () => {
    expect(isExpressionValue("{{ states('sensor.t') }}")).toBe(true);
    expect(isExpressionValue("{% if x %}1{% endif %}")).toBe(true);
  });

  it("does not take plain text, single braces or other types for expressions", () => {
    expect(isExpressionValue("plain")).toBe(false);
    expect(isExpressionValue("{ single }")).toBe(false);
    expect(isExpressionValue(12)).toBe(false);
    expect(isExpressionValue(null)).toBe(false);
  });
});

describe("seedExpression", () => {
  it("yields the current value, so switching modes changes nothing", () => {
    expect(seedExpression(32)).toBe("{{ 32 }}");
    expect(seedExpression(-4)).toBe("{{ -4 }}");
    expect(seedExpression(true)).toBe("{{ true }}");
    expect(seedExpression("red")).toBe("{{ 'red' }}");
  });

  it("escapes quotes in text", () => {
    expect(seedExpression("it's")).toBe(String.raw`{{ 'it\'s' }}`);
  });

  it("stands for no value with none", () => {
    expect(seedExpression(null)).toBe("{{ none }}");
  });
});
