import { allItems } from "./tree";
import type { Dashboard, WidgetDefinition } from "./types";

/** How often a widget is placed on dashboards. */
export interface WidgetUse {
  id: string;
  name: string;
  count: number;
}

export interface DashboardStats {
  dashboards: number;
  /** Every item of every dashboard: primitives, widgets and containers. */
  elements: number;
  /** The widgets on dashboards, the most placed first. */
  widgetUse: WidgetUse[];
}

const widgetCounts = (dashboards: Dashboard[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const dashboard of dashboards) {
    for (const item of allItems(dashboard.items)) {
      if (item.kind !== "widget") continue;
      const type = item.widget.type;
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }
  return counts;
};

/** A look at what the user has built, for the overview of the settings. */
export const dashboardStats = (
  dashboards: Dashboard[],
  widgets: WidgetDefinition[]
): DashboardStats => {
  const names = new Map(widgets.map((widget) => [widget.id, widget.name]));
  const widgetUse = [...widgetCounts(dashboards)]
    .map(([id, count]) => ({ id, name: names.get(id) ?? id, count }))
    .sort(
      (first, second) =>
        second.count - first.count || first.name.localeCompare(second.name)
    );
  return {
    dashboards: dashboards.length,
    elements: dashboards.reduce(
      (total, dashboard) => total + allItems(dashboard.items).length,
      0
    ),
    widgetUse,
  };
};
