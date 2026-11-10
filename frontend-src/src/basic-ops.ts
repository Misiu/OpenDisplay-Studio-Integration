import { createWidgetItem } from "./dashboard-ops";
import {
  evenLayout,
  mergeRegions,
  resizeGrid,
  splitRegion,
  type CellRectangle,
  type LayoutChange,
} from "./grid-layout";
import type {
  Dashboard,
  GridLayout,
  GridRegion,
  ItemFrame,
  StudioItem,
  WidgetDefinition,
  WidgetItem,
} from "./types";

/** What a new basic dashboard starts with: a grid of four cells. */
export const STARTING_COLUMNS = 2;
export const STARTING_ROWS = 2;

/** A dashboard of the basic editor, started with its grid, or an advanced one without. */
export const withMode = (
  dashboard: Dashboard,
  mode: Dashboard["mode"],
  gap: number
): Dashboard => {
  const next = structuredClone(dashboard);
  next.mode = mode;
  if (mode === "basic") {
    next.layout = evenLayout(STARTING_COLUMNS, STARTING_ROWS, gap);
  } else {
    delete next.layout;
  }
  return next;
};

/** Every widget of a basic dashboard holds one region; the rest of its items are none. */
export const widgetsOf = (dashboard: Dashboard): WidgetItem[] =>
  dashboard.items.filter((item): item is WidgetItem => item.kind === "widget");

export const widgetInRegion = (
  dashboard: Dashboard,
  regionId: string
): WidgetItem | undefined =>
  widgetsOf(dashboard).find((widget) => widget.region === regionId);

export const occupiedRegionIds = (dashboard: Dashboard): Set<string> =>
  new Set(widgetsOf(dashboard).flatMap((widget) => widget.region ?? []));

/** The region a new widget goes to: the chosen one if it is free, else the first free one. */
export const regionForNewWidget = (
  dashboard: Dashboard,
  layout: GridLayout,
  chosenRegionId: string
): GridRegion | undefined => {
  const occupied = occupiedRegionIds(dashboard);
  const free = layout.regions.filter((region) => !occupied.has(region.id));
  return free.find((region) => region.id === chosenRegionId) ?? free[0];
};

/** Puts a new widget of the given kind into a region, as the last item of the dashboard. */
export const placeWidget = (
  dashboard: Dashboard,
  definition: WidgetDefinition,
  region: GridRegion,
  frame: ItemFrame
): WidgetItem => {
  const widget = createWidgetItem(definition, 0, 0, dashboard);
  widget.region = region.id;
  widget.frame = { ...frame };
  dashboard.items.push(widget);
  return widget;
};

const withoutWidgetsIn = (
  items: StudioItem[],
  regionIds: string[]
): StudioItem[] =>
  items.filter(
    (item) => item.kind !== "widget" || !regionIds.includes(item.region ?? "")
  );

/** Replaces the layout and takes away the widgets of the regions the change removed. */
const applyChange = (dashboard: Dashboard, change: LayoutChange): void => {
  dashboard.layout = change.layout;
  dashboard.items = withoutWidgetsIn(dashboard.items, change.removedRegionIds);
};

export const mergeRegionsIn = (
  dashboard: Dashboard,
  rectangle: CellRectangle
): void => {
  if (!dashboard.layout) return;
  const occupied = occupiedRegionIds(dashboard);
  applyChange(dashboard, mergeRegions(dashboard.layout, rectangle, occupied));
};

export const splitRegionIn = (dashboard: Dashboard, regionId: string): void => {
  if (!dashboard.layout) return;
  dashboard.layout = splitRegion(dashboard.layout, regionId);
};

export const resizeGridIn = (
  dashboard: Dashboard,
  size: { columns: number; rows: number }
): void => {
  if (!dashboard.layout) return;
  applyChange(dashboard, resizeGrid(dashboard.layout, size.columns, size.rows));
};

export const setGapIn = (dashboard: Dashboard, gap: number): void => {
  if (!dashboard.layout) return;
  dashboard.layout = { ...dashboard.layout, gap };
};
