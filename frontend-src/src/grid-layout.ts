import type { GridLayout, GridRegion, LayoutFrames } from "./types";

export interface CellPosition {
  row: number;
  column: number;
}

/** The cells a region covers, as the first cell and how far it reaches. */
export type CellRectangle = Pick<
  GridRegion,
  "row" | "column" | "rowSpan" | "columnSpan"
>;

/** A layout after an edit, with the regions the edit took away. */
export interface LayoutChange {
  layout: GridLayout;
  removedRegionIds: string[];
}

const LETTERS = 26;

/** The name a region is shown by: A, B … Z, then AA, AB …, in reading order. */
export const regionLetter = (index: number): string => {
  const letter = String.fromCharCode(65 + (index % LETTERS));
  return index < LETTERS
    ? letter
    : regionLetter(Math.floor(index / LETTERS) - 1) + letter;
};

const REGION_PREFIX = "region-";

const unusedRegionId = (used: Set<string>): string => {
  let number = 1;
  while (used.has(`${REGION_PREFIX}${number}`)) {
    number += 1;
  }
  const id = `${REGION_PREFIX}${number}`;
  used.add(id);
  return id;
};

const isJoined = (region: GridRegion): boolean =>
  region.rowSpan > 1 || region.columnSpan > 1;

const readingOrder = (first: GridRegion, second: GridRegion): number =>
  first.row - second.row || first.column - second.column;

export const cellsOf = (region: CellRectangle): CellPosition[] => {
  const cells: CellPosition[] = [];
  for (let row = region.row; row < region.row + region.rowSpan; row += 1) {
    for (
      let column = region.column;
      column < region.column + region.columnSpan;
      column += 1
    ) {
      cells.push({ row, column });
    }
  }
  return cells;
};

export const regionAt = (
  layout: GridLayout,
  cell: CellPosition
): GridRegion | undefined =>
  layout.regions.find((region) =>
    cellsOf(region).some(
      (own) => own.row === cell.row && own.column === cell.column
    )
  );

/** The rectangle of cells between two corners, whichever way they are given. */
export const rectangleBetween = (
  from: CellPosition,
  to: CellPosition
): CellRectangle => ({
  row: Math.min(from.row, to.row),
  column: Math.min(from.column, to.column),
  rowSpan: Math.abs(from.row - to.row) + 1,
  columnSpan: Math.abs(from.column - to.column) + 1,
});

/** The regions of the layout, and a one-cell region in each cell none of them covers. */
const fillGaps = (layout: GridLayout): GridRegion[] => {
  const regions = [...layout.regions];
  const used = new Set(regions.map((region) => region.id));
  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      if (!regionAt({ ...layout, regions }, { row, column })) {
        regions.push({
          id: unusedRegionId(used),
          row,
          column,
          rowSpan: 1,
          columnSpan: 1,
        });
      }
    }
  }
  return inCreationOrder(regions);
};

/**
 * The order regions are named in: the ones joined by hand first, in the order they were
 * made, then the cells nobody joined, in reading order. A region keeps its place when
 * another is made, so its letter does not change under the user.
 */
const inCreationOrder = (regions: GridRegion[]): GridRegion[] => [
  ...regions.filter(isJoined),
  ...regions.filter((region) => !isJoined(region)).sort(readingOrder),
];

/** Every cell of the grid as a region of its own. */
export const evenLayout = (
  columns: number,
  rows: number,
  gap: number
): GridLayout => ({
  columns,
  rows,
  gap,
  regions: fillGaps({ columns, rows, gap, regions: [] }),
});

const isInside = (region: GridRegion, rectangle: CellRectangle): boolean =>
  region.row >= rectangle.row &&
  region.column >= rectangle.column &&
  region.row + region.rowSpan <= rectangle.row + rectangle.rowSpan &&
  region.column + region.columnSpan <= rectangle.column + rectangle.columnSpan;

const touches = (region: GridRegion, rectangle: CellRectangle): boolean =>
  region.row < rectangle.row + rectangle.rowSpan &&
  region.row + region.rowSpan > rectangle.row &&
  region.column < rectangle.column + rectangle.columnSpan &&
  region.column + region.columnSpan > rectangle.column;

/** The regions a rectangle of cells covers, in reading order. */
export const regionsIn = (
  layout: GridLayout,
  rectangle: CellRectangle
): GridRegion[] =>
  layout.regions
    .filter((region) => touches(region, rectangle))
    .sort(readingOrder);

/**
 * Whether the rectangle can become one region: it must take in more than one region and
 * cut none of them in two.
 */
export const canMerge = (
  layout: GridLayout,
  rectangle: CellRectangle
): boolean => {
  const covered = regionsIn(layout, rectangle);
  return covered.length > 1 && covered.every((r) => isInside(r, rectangle));
};

/**
 * Joins the regions inside a rectangle. The new region keeps the id of the first of them
 * that holds a widget, or else of the first one; the widgets of the others are released.
 */
export const mergeRegions = (
  layout: GridLayout,
  rectangle: CellRectangle,
  occupied: ReadonlySet<string>
): LayoutChange => {
  const covered = regionsIn(layout, rectangle);
  const kept = covered.find((region) => occupied.has(region.id)) ?? covered[0];
  const removed = covered.filter((region) => region.id !== kept.id);
  const regions = layout.regions
    .filter((region) => !covered.includes(region))
    .concat({ id: kept.id, ...rectangle });
  return {
    layout: { ...layout, regions: inCreationOrder(regions) },
    removedRegionIds: removed.map((region) => region.id),
  };
};

/** Cuts a region back into cells; the first cell keeps the id and so the widget. */
export const splitRegion = (
  layout: GridLayout,
  regionId: string
): GridLayout => {
  const region = layout.regions.find((candidate) => candidate.id === regionId);
  if (!region) {
    return layout;
  }
  const others = layout.regions.filter((candidate) => candidate !== region);
  const first: GridRegion = {
    id: region.id,
    row: region.row,
    column: region.column,
    rowSpan: 1,
    columnSpan: 1,
  };
  const regions = fillGaps({ ...layout, regions: [...others, first] });
  return { ...layout, regions };
};

/**
 * Gives the grid another size. Regions that still lie inside it stay; the ones the new
 * edge would cut are taken away, and every cell left uncovered becomes a region.
 */
export const resizeGrid = (
  layout: GridLayout,
  columns: number,
  rows: number
): LayoutChange => {
  const whole = { row: 0, column: 0, rowSpan: rows, columnSpan: columns };
  const kept = layout.regions.filter((region) => isInside(region, whole));
  const removed = layout.regions.filter((region) => !kept.includes(region));
  const resized = { ...layout, columns, rows, regions: kept };
  return {
    layout: { ...resized, regions: fillGaps(resized) },
    removedRegionIds: removed.map((region) => region.id),
  };
};

/** The id of the region whose frame contains a point of the display, if there is one. */
export const regionIdAtPoint = (
  frames: LayoutFrames,
  point: { x: number; y: number }
): string | undefined =>
  frames.regions.find(
    (frame) =>
      point.x >= frame.x &&
      point.x < frame.x + frame.width &&
      point.y >= frame.y &&
      point.y < frame.y + frame.height
  )?.id;
