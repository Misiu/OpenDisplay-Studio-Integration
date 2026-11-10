import { describe, expect, it } from "vitest";
import {
  mergeRegionsIn,
  occupiedRegionIds,
  placeWidget,
  regionForNewWidget,
  resizeGridIn,
  splitRegionIn,
  widgetInRegion,
  withMode,
} from "./basic-ops";
import { rectangleBetween } from "./grid-layout";
import { dashboardWith, widgetDefinition } from "./test-support";
import type { Dashboard, GridLayout } from "./types";

const FRAME = { x: 0, y: 0, width: 100, height: 50 };

const basicDashboard = (): Dashboard => withMode(dashboardWith(), "basic", 8);

const layoutOf = (dashboard: Dashboard): GridLayout => {
  if (!dashboard.layout) throw new Error("The dashboard has no layout");
  return dashboard.layout;
};

const fill = (dashboard: Dashboard, regionId: string): void => {
  const region = layoutOf(dashboard).regions.find((r) => r.id === regionId);
  if (!region) throw new Error("No such region");
  placeWidget(dashboard, widgetDefinition("sensor-card"), region, FRAME);
};

describe("withMode", () => {
  it("starts a basic dashboard with a grid of single-cell regions", () => {
    const dashboard = basicDashboard();

    expect(dashboard.mode).toBe("basic");
    expect(layoutOf(dashboard).regions).toHaveLength(4);
    expect(layoutOf(dashboard).gap).toBe(8);
  });

  it("leaves an advanced dashboard without a layout", () => {
    const dashboard = withMode(basicDashboard(), "advanced", 8);

    expect(dashboard.mode).toBe("advanced");
    expect(dashboard.layout).toBeUndefined();
  });
});

describe("placeWidget", () => {
  it("fills a region with a widget that takes the region's frame", () => {
    const dashboard = basicDashboard();
    const [first] = layoutOf(dashboard).regions;

    const widget = placeWidget(
      dashboard,
      widgetDefinition("sensor-card"),
      first,
      FRAME
    );

    expect(widget.region).toBe(first.id);
    expect(widget.frame).toEqual(FRAME);
    expect(widgetInRegion(dashboard, first.id)).toBe(widget);
  });
});

describe("regionForNewWidget", () => {
  it("prefers the chosen region while it is free", () => {
    const dashboard = basicDashboard();
    const layout = layoutOf(dashboard);

    const region = regionForNewWidget(dashboard, layout, layout.regions[2].id);

    expect(region?.id).toBe(layout.regions[2].id);
  });

  it("falls back to the first free region when the chosen one is taken", () => {
    const dashboard = basicDashboard();
    const layout = layoutOf(dashboard);
    fill(dashboard, layout.regions[0].id);

    const region = regionForNewWidget(dashboard, layout, layout.regions[0].id);

    expect(region?.id).toBe(layout.regions[1].id);
  });

  it("finds nothing when every region holds a widget", () => {
    const dashboard = basicDashboard();
    const layout = layoutOf(dashboard);
    layout.regions.forEach((region) => fill(dashboard, region.id));

    expect(regionForNewWidget(dashboard, layout, "")).toBeUndefined();
  });
});

describe("mergeRegionsIn", () => {
  it("releases the widget of a region that is joined into another one", () => {
    const dashboard = basicDashboard();
    const [first, second] = layoutOf(dashboard).regions;
    fill(dashboard, second.id);

    mergeRegionsIn(
      dashboard,
      rectangleBetween({ row: 0, column: 0 }, { row: 0, column: 1 })
    );

    expect(occupiedRegionIds(dashboard)).toEqual(new Set([second.id]));
    expect(layoutOf(dashboard).regions.some((r) => r.id === first.id)).toBe(
      false
    );
  });
});

describe("splitRegionIn", () => {
  it("keeps the widget in the first cell of the region it was cut from", () => {
    const dashboard = basicDashboard();
    mergeRegionsIn(
      dashboard,
      rectangleBetween({ row: 0, column: 0 }, { row: 1, column: 1 })
    );
    const [whole] = layoutOf(dashboard).regions;
    fill(dashboard, whole.id);

    splitRegionIn(dashboard, whole.id);

    expect(layoutOf(dashboard).regions).toHaveLength(4);
    expect(widgetInRegion(dashboard, whole.id)).toBeDefined();
  });
});

describe("resizeGridIn", () => {
  it("removes the widgets of the regions the smaller grid no longer has", () => {
    const dashboard = basicDashboard();
    layoutOf(dashboard).regions.forEach((region) => fill(dashboard, region.id));

    resizeGridIn(dashboard, { columns: 1, rows: 1 });

    expect(dashboard.items).toHaveLength(1);
    expect(layoutOf(dashboard).regions).toHaveLength(1);
  });
});
