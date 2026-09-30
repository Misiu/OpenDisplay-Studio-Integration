import { afterEach, describe, expect, it } from "vitest";
import { applyLanguage, baseLanguage } from "./i18n";
import { strings } from "./strings";

afterEach(() => applyLanguage("en"));

describe("applyLanguage", () => {
  it("speaks Polish when Home Assistant does", () => {
    applyLanguage("pl");

    expect(strings.header.save).toBe("Zapisz");
    expect(strings.inspector.deleteDashboard).toBe("Usuń dashboard");
  });

  it("speaks German when Home Assistant does", () => {
    applyLanguage("de");

    expect(strings.header.save).toBe("Speichern");
    expect(strings.gallery.count(1)).toBe("1 Dashboard");
    expect(strings.gallery.count(3)).toBe("3 Dashboards");
  });

  it("follows the language whatever its region", () => {
    applyLanguage("pl-PL");

    expect(strings.header.save).toBe("Zapisz");
  });

  it("falls back to English for a language it has no translation for", () => {
    applyLanguage("fr");

    expect(strings.header.save).toBe("Save");
  });

  it("goes back to English when the language changes back", () => {
    applyLanguage("pl");
    applyLanguage("en");

    expect(strings.header.save).toBe("Save");
    expect(strings.gallery.count(2)).toBe("2 dashboards");
  });

  it("keeps English for whatever a translation leaves out", () => {
    applyLanguage("pl");

    expect(strings.expression.placeholder).toBe(
      "{{ states('sensor.example') }}"
    );
    expect(strings.common.size(4, 5)).toBe("4 × 5");
  });

  it("uses Polish plural forms for counts", () => {
    applyLanguage("pl");

    expect(strings.gallery.count(1)).toBe("1 dashboard");
    expect(strings.gallery.count(3)).toBe("3 dashboardy");
    expect(strings.gallery.count(5)).toBe("5 dashboardów");
    expect(strings.gallery.count(12)).toBe("12 dashboardów");
    expect(strings.gallery.count(22)).toBe("22 dashboardy");
  });
});

describe("baseLanguage", () => {
  it("drops the region and case", () => {
    expect(baseLanguage("pl-PL")).toBe("pl");
    expect(baseLanguage("EN")).toBe("en");
    expect(baseLanguage("")).toBe("en");
  });
});
