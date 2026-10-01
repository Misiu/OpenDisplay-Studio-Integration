import { describe, expect, it } from "vitest";
import {
  copyName,
  dashboardAccent,
  dashboardDate,
  dashboardFormData,
  dashboardFormLabel,
  dashboardFormSchema,
  dashboardFromDevice,
  dashboardFromForm,
  dashboardFromProfile,
  PRESET_PROFILES,
  dashboardIsValid,
  settingsFormFields,
  freshDashboard,
  listDashboards,
} from "./dashboards";
import { dashboardWith } from "./test-support";
import type { DisplayDevice } from "./types";

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
    collect(dashboardFormSchema(settingsFormFields(dashboardWith())));
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

describe("starting from a display", () => {
  const device: DisplayDevice = {
    id: "d1",
    name: "Hall",
    manufacturer: "Seeed",
    model: '7.5" BWR',
    width: 296,
    height: 128,
    palette: "bwr",
    colors: ["black", "white", "red"],
  };

  it("takes the size and the colors of an OpenDisplay device", () => {
    const dashboard = dashboardWith([], { background: "white" });
    dashboard.name = "Mine";

    const next = dashboardFromDevice(dashboard, device);

    expect(next.display).toMatchObject({
      width: 296,
      height: 128,
      palette: "bwr",
    });
    expect(next.name).toBe("Mine");
    expect(dashboard.display.width).toBe(400);
  });

  it("falls back to a white background the new colors do not have", () => {
    const dashboard = dashboardWith([], { palette: "bwr", background: "red" });

    const next = dashboardFromDevice(dashboard, { ...device, palette: "bw" });

    expect(next.display.background).toBe("white");
  });

  it("takes the size of a predefined display and its default colors", () => {
    const profile = PRESET_PROFILES.find((entry) => entry.palettes.length > 1);
    if (!profile) throw new Error("No profile offers a choice of colors");

    const next = dashboardFromProfile(dashboardWith(), profile);

    expect(next.display).toMatchObject({
      profileId: profile.id,
      width: profile.width,
      height: profile.height,
      palette: profile.defaultPalette,
    });
  });

  it("only offers a predefined display the colors it can show", () => {
    const profile = PRESET_PROFILES.find(
      (entry) => entry.palettes.length === 1
    );
    if (!profile) throw new Error("No monochrome profile");

    const next = dashboardFromProfile(dashboardWith(), profile, "spectra6");

    expect(next.display.palette).toBe(profile.palettes[0]);
  });

  it("lists the predefined displays without the custom one", () => {
    expect(PRESET_PROFILES.length).toBeGreaterThan(10);
    expect(PRESET_PROFILES.some((profile) => profile.id === "custom")).toBe(
      false
    );
  });

  it("keeps the chosen display while only its colors or the name change", () => {
    const dashboard = dashboardWith([], { profileId: "solum-7-5" });

    const next = dashboardFromForm(dashboard, {
      name: "Renamed",
      palette: "bw",
    });

    expect(next.display.profileId).toBe("solum-7-5");
  });

  it("offers a size and colors only where the source leaves them open", () => {
    const names = (fields: Parameters<typeof dashboardFormSchema>[0]) =>
      dashboardFormSchema(fields).flatMap((entry) =>
        "name" in entry ? [entry.name] : []
      );

    expect(names({ size: false, palettes: [], backgrounds: [] })).toEqual([
      "name",
      "rotation",
      "advanced",
    ]);
    expect(
      names({ size: false, palettes: ["bw", "bwr"], backgrounds: [] })
    ).toEqual(["name", "palette", "rotation", "advanced"]);
    expect(
      names({ size: false, palettes: ["bw"], backgrounds: [] })
    ).not.toContain("palette");
    expect(names(undefined)).toEqual([
      "name",
      "dimensions",
      "palette",
      "rotation",
      "advanced",
    ]);
  });
});

describe("rotation", () => {
  const device: DisplayDevice = {
    id: "d1",
    name: "Hall",
    manufacturer: null,
    model: null,
    width: 800,
    height: 480,
    palette: "bw",
    colors: ["black", "white"],
  };

  it("sizes the canvas of a device for the way it is turned", () => {
    const upright = dashboardFromDevice(dashboardWith(), device);
    const turned = dashboardFromDevice(
      dashboardWith([], { rotation: 90 }),
      device
    );

    expect(upright.display).toMatchObject({ width: 800, height: 480 });
    expect(turned.display).toMatchObject({ width: 480, height: 800 });
  });

  it("links the dashboard to the device it was made from", () => {
    expect(dashboardFromDevice(dashboardWith(), device).display.deviceId).toBe(
      "d1"
    );
    const profile = PRESET_PROFILES[0];
    const linked = dashboardWith([], { deviceId: "d1" });
    expect(dashboardFromProfile(linked, profile).display.deviceId).toBeNull();
  });

  it("turns the canvas when the form changes the rotation, and not when it also changes the size", () => {
    const dashboard = dashboardWith([], { width: 800, height: 480 });

    const turned = dashboardFromForm(dashboard, { rotation: "90" });
    const sized = dashboardFromForm(dashboard, {
      rotation: "90",
      width: 500,
      height: 300,
    });

    expect(turned.display).toMatchObject({
      rotation: 90,
      width: 480,
      height: 800,
    });
    expect(sized.display).toMatchObject({
      rotation: 90,
      width: 500,
      height: 300,
    });
  });

  it("keeps the device when the rotation changes and drops it when the size does", () => {
    const dashboard = dashboardWith([], { deviceId: "d1" });

    expect(
      dashboardFromForm(dashboard, { rotation: "180" }).display.deviceId
    ).toBe("d1");
    expect(
      dashboardFromForm(dashboard, { width: 500 }).display.deviceId
    ).toBeNull();
  });

  it("ignores a rotation that is not a quarter turn", () => {
    const dashboard = dashboardWith([], { rotation: 90 });

    expect(
      dashboardFromForm(dashboard, { rotation: "45" }).display.rotation
    ).toBe(90);
  });

  it("offers the four rotations in the settings form", () => {
    const rotation = dashboardFormSchema().find(
      (entry) => "name" in entry && entry.name === "rotation"
    );

    expect(JSON.stringify(rotation)).toContain('"value":"270"');
  });
});
