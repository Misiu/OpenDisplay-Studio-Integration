import { describe, expect, it } from "vitest";
import {
  copyName,
  dashboardAccent,
  dashboardDate,
  dashboardFormData,
  dashboardFormLabel,
  dashboardFormSchema,
  dashboardFromForm,
  dashboardIsValid,
  freshDashboard,
  listDashboards,
} from "./dashboards";
import { dashboardWith } from "./test-support";

describe("freshDashboard", () => {
  it("is an empty draft sized from the chosen display profile", () => {
    const dashboard = freshDashboard("pl");
    expect(dashboard).toMatchObject({
      id: "",
      status: "draft",
      language: "pl",
      items: [],
      schemaVersion: 1,
    });
    expect(dashboard.display.profileId).toBe("custom");
  });

  it("falls back to English when no language is known", () => {
    expect(freshDashboard("").language).toBe("en");
  });
});

describe("dashboard form", () => {
  it("round-trips the editable display fields", () => {
    const dashboard = dashboardWith([], {
      width: 296,
      height: 128,
      padding: 4,
      snapSize: 8,
    });
    expect(dashboardFormData(dashboard)).toMatchObject({
      name: "Test",
      width: 296,
      height: 128,
      padding: 4,
      snapSize: 8,
    });
  });

  it("turns any edited size into a custom display and rounds numbers", () => {
    const dashboard = dashboardWith([], { profileId: "solum-x" });
    const next = dashboardFromForm(dashboard, { width: 400.6, height: 200.2 });
    expect(next.display).toMatchObject({
      profileId: "custom",
      width: 401,
      height: 200,
    });
    expect(dashboard.display.width).toBe(400);
  });

  it("resets an unsupported palette to black and white and a foreign background to white", () => {
    const dashboard = dashboardWith([], { palette: "bwr", background: "red" });
    const next = dashboardFromForm(dashboard, { palette: "bw" });
    expect(next.display).toMatchObject({ palette: "bw", background: "white" });
  });

  it("validates name, size, padding and snap size", () => {
    expect(dashboardIsValid(dashboardWith())).toBe(true);
    expect(dashboardIsValid({ ...dashboardWith(), name: "  " })).toBe(false);
    expect(dashboardIsValid(dashboardWith([], { width: 10 }))).toBe(false);
    expect(dashboardIsValid(dashboardWith([], { padding: 150 }))).toBe(false);
    expect(dashboardIsValid(dashboardWith([], { snapSize: 0 }))).toBe(false);
  });
});

describe("gallery list", () => {
  const named = (name: string, updatedAt: string) => ({
    ...dashboardWith(),
    id: name,
    name,
    updatedAt,
  });
  const all = [
    named("Beta", "2026-01-02"),
    named("alpha", "2026-01-03"),
    named("Gamma", "2026-01-01"),
  ];

  it("sorts by last update, newest first, by default", () => {
    expect(listDashboards(all, "", "updated", "en").map((d) => d.name)).toEqual(
      ["alpha", "Beta", "Gamma"]
    );
  });

  it("sorts by name and filters case-insensitively", () => {
    expect(listDashboards(all, "", "name", "en").map((d) => d.name)).toEqual([
      "alpha",
      "Beta",
      "Gamma",
    ]);
    expect(
      listDashboards(all, " GAM ", "name", "en").map((d) => d.name)
    ).toEqual(["Gamma"]);
  });

  it("does not reorder the source array", () => {
    const copy = [...all];
    listDashboards(all, "", "name", "en");
    expect(all).toEqual(copy);
  });
});

describe("copyName", () => {
  it('appends "copy" and then a counter until the name is free', () => {
    const list = [{ ...dashboardWith(), name: "Kitchen" }];
    expect(copyName(list[0], list, "en")).toBe("Kitchen copy");
    expect(
      copyName(
        list[0],
        [...list, { ...dashboardWith(), name: "kitchen COPY" }],
        "en"
      )
    ).toBe("Kitchen copy 2");
  });
});

describe("gallery presentation", () => {
  it("formats the update date in the user language and tolerates an empty one", () => {
    expect(
      dashboardDate(
        { ...dashboardWith(), updatedAt: "2026-09-30T10:00:00Z" },
        "en"
      )
    ).toBe("Sep 30, 2026");
    expect(dashboardDate(dashboardWith(), "en")).toBe("");
  });

  it("picks an accent colour per palette", () => {
    expect(dashboardAccent("bw")).toBe("#202124");
    expect(dashboardAccent("bwr")).toBe(dashboardAccent("bwry"));
    expect(dashboardAccent("spectra6")).not.toBe(dashboardAccent("bwy"));
  });
});

describe("dashboardFormSchema", () => {
  it("lists every field the form data carries, so nothing is silently dropped", () => {
    const names: string[] = [];
    const collect = (entries: ReturnType<typeof dashboardFormSchema>): void =>
      entries.forEach((entry) =>
        "schema" in entry ? collect(entry.schema) : names.push(entry.name)
      );
    collect(dashboardFormSchema());
    expect(names.sort()).toEqual(
      Object.keys(dashboardFormData(dashboardWith())).sort()
    );
  });

  it("labels fields and sections", () => {
    const [name, dimensions] = dashboardFormSchema();
    expect(dashboardFormLabel(name)).toBe("Dashboard name");
    expect(dashboardFormLabel({ ...dimensions, title: "Section" })).toBe(
      "Section"
    );
  });
});
