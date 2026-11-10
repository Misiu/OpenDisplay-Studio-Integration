import type { Dashboard, ItemFrame, LayoutFrames } from "./types";

/**
 * The harness's stand-in for the backend's grid: the same split as the SDK's `grid()`, so
 * what the panel shows in the harness has the numbers the real backend gives.
 */

/** Python rounds halves to the even number; so does the backend's split. */
const roundHalfEven = (value: number): number => {
  const floor = Math.floor(value);
  const difference = value - floor;
  if (difference !== 0.5) return Math.round(value);
  return floor % 2 === 0 ? floor : floor + 1;
};

const splitLine = (
  total: number,
  count: number,
  gap: number
): Array<{ offset: number; length: number }> => {
  const available = Math.max(count, total - gap * (count - 1));
  const spans: Array<{ offset: number; length: number }> = [];
  let start = 0;
  for (let index = 0; index < count; index += 1) {
    const end = roundHalfEven((available * (index + 1)) / count);
    spans.push({
      offset: start + gap * index,
      length: Math.max(1, end - start),
    });
    start = end;
  }
  return spans;
};

export const mockLayoutFrames = (dashboard: Dashboard): LayoutFrames => {
  const layout = dashboard.layout;
  if (!layout) return { cells: [], regions: [] };
  const { width, height, padding } = dashboard.display;
  const columns = splitLine(width - 2 * padding, layout.columns, layout.gap);
  const rows = splitLine(height - 2 * padding, layout.rows, layout.gap);
  const cells: ItemFrame[] = rows.flatMap((row) =>
    columns.map((column) => ({
      x: padding + column.offset,
      y: padding + row.offset,
      width: column.length,
      height: row.length,
    }))
  );
  const regions = layout.regions.map((region) => {
    const first = cells[region.row * layout.columns + region.column];
    const last =
      cells[
        (region.row + region.rowSpan - 1) * layout.columns +
          region.column +
          region.columnSpan -
          1
      ];
    return {
      id: region.id,
      x: first.x,
      y: first.y,
      width: last.x + last.width - first.x,
      height: last.y + last.height - first.y,
    };
  });
  return { cells, regions };
};

/** The dashboard with every widget in the frame of its region, as the backend does. */
export const withRegionFrames = (dashboard: Dashboard): Dashboard => {
  if (dashboard.mode !== "basic") return dashboard;
  const { regions } = mockLayoutFrames(dashboard);
  const placed = structuredClone(dashboard);
  for (const item of placed.items) {
    if (item.kind !== "widget") continue;
    const frame = regions.find((region) => region.id === item.region);
    if (frame) item.frame = { ...frame };
  }
  return placed;
};
