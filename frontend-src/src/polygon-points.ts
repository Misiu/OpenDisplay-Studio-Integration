/** The corner points of a polygon, as `[x, y]` pairs, and the edits the points editor makes. */
export type Point = [number, number];

/** The fewest points a polygon has; the backend rejects fewer. */
export const MINIMUM_POINTS = 3;
/** The most points the backend accepts. */
export const MAXIMUM_POINTS = 256;

const isPoint = (value: unknown): value is [number, number] =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every((coordinate) => typeof coordinate === "number");

/** The points of a stored value; anything that is not a pair of numbers is left out. */
export const pointsOf = (value: unknown): Point[] =>
  Array.isArray(value) ? value.filter(isPoint).map(([x, y]) => [x, y]) : [];

export const canAddPoint = (points: Point[]): boolean =>
  points.length < MAXIMUM_POINTS;

export const canRemovePoint = (points: Point[]): boolean =>
  points.length > MINIMUM_POINTS;

/**
 * A new point on the edge that closes the polygon, halfway between the last point and the
 * first, so the shape grows without jumping.
 */
export const addPoint = (points: Point[]): Point[] => {
  if (!canAddPoint(points) || points.length === 0) return points;
  const [lastX, lastY] = points[points.length - 1];
  const [firstX, firstY] = points[0];
  return [
    ...points,
    [Math.round((lastX + firstX) / 2), Math.round((lastY + firstY) / 2)],
  ];
};

export const removePoint = (points: Point[], index: number): Point[] =>
  canRemovePoint(points) ? points.filter((_, at) => at !== index) : points;

/** Move one coordinate of one point to a whole number. */
export const setPointCoordinate = (
  points: Point[],
  index: number,
  axis: 0 | 1,
  value: number
): Point[] =>
  points.map((point, at) => {
    if (at !== index) return point;
    return axis === 0 ? [value, point[1]] : [point[0], value];
  });

/** Move one whole point. */
export const movePoint = (points: Point[], index: number, to: Point): Point[] =>
  points.map((point, at) => (at === index ? to : point));
