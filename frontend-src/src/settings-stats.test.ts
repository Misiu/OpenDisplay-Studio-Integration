import { describe, expect, it } from "vitest";
import { dashboardStats } from "./settings-stats";
import {
  containerItem,
  dashboardWith,
  textItem,
  widgetDefinitions,
  widgetItem,
} from "./test-support";
import type { WidgetItem } from "./types";

const widgetOf = (id: string, type: string): WidgetItem => {
  const item = widgetItem(id);
  item.widget.type = type;
  return item;
};

describe("dashboardStats", () => {
  it("counts the dashboards and every element on them, containers included", () => {
    const first = dashboardWith([
      textItem("a"),
      containerItem("box", [textItem("b"), textItem("c")]),
    ]);
    const second = dashboardWith([textItem("d")]);

    const stats = dashboardStats([first, second], widgetDefinitions);

    expect(stats.dashboards).toBe(2);
    expect(stats.elements).toBe(5);
  });

  it("lists the widgets in use, the most placed first, named as the panel names them", () => {
    const dashboard = dashboardWith([
      widgetOf("a", "gauge"),
      widgetOf("b", "sensor-card"),
      containerItem("box", [widgetOf("c", "gauge")]),
    ]);

    const stats = dashboardStats([dashboard], widgetDefinitions);

    expect(stats.widgetUse).toEqual([
      { id: "gauge", name: "Gauge", count: 2 },
      { id: "sensor-card", name: "Sensor card", count: 1 },
    ]);
  });

  it("orders widgets that are placed equally often by name", () => {
    const dashboard = dashboardWith([
      widgetOf("a", "thermometer"),
      widgetOf("b", "gauge"),
    ]);

    const stats = dashboardStats([dashboard], widgetDefinitions);

    expect(stats.widgetUse.map((use) => use.id)).toEqual([
      "gauge",
      "thermometer",
    ]);
  });

  it("keeps the id of a widget that is not installed", () => {
    const dashboard = dashboardWith([widgetOf("a", "gone")]);

    const stats = dashboardStats([dashboard], widgetDefinitions);

    expect(stats.widgetUse).toEqual([{ id: "gone", name: "gone", count: 1 }]);
  });

  it("is empty without dashboards", () => {
    expect(dashboardStats([], widgetDefinitions)).toEqual({
      dashboards: 0,
      elements: 0,
      widgetUse: [],
    });
  });
});
