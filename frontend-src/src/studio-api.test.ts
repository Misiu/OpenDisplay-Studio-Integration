import { describe, expect, it } from "vitest";
import * as api from "./studio-api";
import { dashboardWith } from "./test-support";
import type { HomeAssistant } from "./types";

/** A Home Assistant stand-in that records every message and answers with `reply`. */
const fakeHass = (reply: unknown = {}) => {
  const messages: Array<Record<string, unknown>> = [];
  const hass: HomeAssistant = {
    language: "en",
    callWS: <T>(message: Record<string, unknown>): Promise<T> => {
      messages.push(message);
      return Promise.resolve(reply as T);
    },
  };
  return { hass, messages };
};

describe("studio API", () => {
  it("asks the backend for everything the panel needs to start", async () => {
    const { hass, messages } = fakeHass({
      dashboards: [],
      widgets: [],
      primitives: [],
    });
    await api.bootstrap(hass);
    expect(messages).toEqual([
      { type: "opendisplay_studio/bootstrap", language: "en" },
    ]);
  });

  it("reloads the widgets in the language of the panel", async () => {
    const reply = { widgets: [], widgetErrors: [] };
    const { hass, messages } = fakeHass(reply);

    expect(await api.reloadWidgets(hass)).toBe(reply);
    expect(messages).toEqual([
      { type: "opendisplay_studio/reload_widgets", language: "en" },
    ]);
  });

  it("creates a dashboard and returns the stored copy", async () => {
    const stored = { ...dashboardWith(), id: "new-id" };
    const { hass, messages } = fakeHass({ dashboard: stored });
    const draft = dashboardWith();
    expect(await api.createDashboard(hass, draft)).toBe(stored);
    expect(messages).toEqual([
      { type: "opendisplay_studio/create_dashboard", dashboard: draft },
    ]);
  });

  it("updates a dashboard by its own id", async () => {
    const dashboard = { ...dashboardWith(), id: "abc" };
    const { hass, messages } = fakeHass({ dashboard });
    await api.updateDashboard(hass, dashboard);
    expect(messages).toEqual([
      {
        type: "opendisplay_studio/update_dashboard",
        dashboard_id: "abc",
        dashboard,
      },
    ]);
  });

  it("deletes a dashboard by id", async () => {
    const { hass, messages } = fakeHass();
    await api.deleteDashboard(hass, "abc");
    expect(messages).toEqual([
      { type: "opendisplay_studio/delete_dashboard", dashboard_id: "abc" },
    ]);
  });

  it("previews a copy, so later edits cannot change what was sent", async () => {
    const { hass, messages } = fakeHass({ imageUrl: "x" });
    const dashboard = dashboardWith();
    await api.composePreview(hass, dashboard);
    dashboard.name = "Changed afterwards";
    expect(messages[0]).toMatchObject({
      type: "opendisplay_studio/compose_preview",
      dashboard: { name: "Test" },
    });
  });

  it("passes a backend failure on to the caller", async () => {
    const hass: HomeAssistant = {
      language: "en",
      callWS: () => Promise.reject(new Error("invalid_dashboard")),
    };
    await expect(api.deleteDashboard(hass, "abc")).rejects.toThrow(
      "invalid_dashboard"
    );
  });
});
