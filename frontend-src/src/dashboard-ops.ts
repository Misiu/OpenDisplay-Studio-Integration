import {
  constrainItem,
  isBoxPrimitive,
  itemBounds,
  snapToGrid,
  translateItem,
  workingArea,
} from "./geometry";
import { createId } from "./ids";
import { clamp } from "./math";
import { definitionFor, primitiveValuesFromForm } from "./item-fields";
import { createPrimitive, resolveLimit } from "./primitives";
import { PALETTE_COLORS } from "./display-profiles";
import type {
  Dashboard,
  DisplayProfile,
  ItemBounds,
  PaletteId,
  Primitive,
  PrimitiveDefinition,
  PrimitiveItem,
  WidgetDefinition,
  WidgetItem,
} from "./types";

/**
 * Edit one numeric field of a point primitive: its position keeps the whole
 * element inside the working area, any other field stays within its definition's limits.
 */
const setPointField = (
  item: PrimitiveItem,
  key: string,
  value: number,
  area: ItemBounds,
  display: Dashboard["display"],
  definition: PrimitiveDefinition | undefined
): void => {
  const primitive = item.primitive;
  if (isBoxPrimitive(primitive)) {
    return;
  }
  const bounds = itemBounds(item);
  if (key === "x") {
    const offset = bounds.x - primitive.x;
    const lowest = area.x - offset;
    const highest = area.x + area.width - bounds.width - offset;
    Object.assign(primitive, {
      x: clamp(value, lowest, Math.max(lowest, highest)),
    });
    return;
  }
  if (key === "y") {
    const offset = bounds.y - primitive.y;
    const lowest = area.y - offset;
    const highest = area.y + area.height - bounds.height - offset;
    Object.assign(primitive, {
      y: clamp(value, lowest, Math.max(lowest, highest)),
    });
    return;
  }
  const field = definition?.fields.find(
    (candidate) =>
      candidate.key === key &&
      candidate.shape === "number" &&
      candidate.section === "layout"
  );
  if (field) {
    const minimum = resolveLimit(field.min, display, value);
    const maximum = resolveLimit(field.max, display, value);
    Object.assign(primitive, { [key]: clamp(value, minimum, maximum) });
  }
};

/** Edit one numeric layout field of an item, keeping it inside the working area. */
export const setItemNumber = (
  dashboard: Dashboard,
  itemId: string,
  key: string,
  value: number,
  definitions: PrimitiveDefinition[]
): void => {
  const item = dashboard.items.find((candidate) => candidate.id === itemId);
  if (!item || item.locked) return;
  const area = workingArea(dashboard);
  if (item.kind === "widget") {
    if (key === "padding") item.layout.padding = clamp(value, 0, 128);
    if (key === "x") {
      item.frame.x = clamp(
        value,
        area.x,
        area.x + area.width - item.frame.width
      );
    }
    if (key === "y") {
      item.frame.y = clamp(
        value,
        area.y,
        area.y + area.height - item.frame.height
      );
    }
    if (key === "width") {
      item.frame.width = clamp(value, 1, area.x + area.width - item.frame.x);
    }
    if (key === "height") {
      item.frame.height = clamp(value, 1, area.y + area.height - item.frame.y);
    }
    return;
  }
  const primitive = item.primitive;
  const definition = definitionFor(item, definitions);
  if (isBoxPrimitive(primitive)) {
    if (key === "x") {
      const width = primitive.x_end - primitive.x_start;
      primitive.x_start = clamp(value, area.x, area.x + area.width - width - 1);
      primitive.x_end = primitive.x_start + width;
    }
    if (key === "y") {
      const height = primitive.y_end - primitive.y_start;
      primitive.y_start = clamp(
        value,
        area.y,
        area.y + area.height - height - 1
      );
      primitive.y_end = primitive.y_start + height;
    }
    if (key === "width") {
      primitive.x_end = clamp(
        primitive.x_start + Math.max(1, value) - 1,
        primitive.x_start + 1,
        area.x + area.width - 1
      );
    }
    if (key === "height") {
      primitive.y_end = clamp(
        primitive.y_start + Math.max(1, value) - 1,
        primitive.y_start + 1,
        area.y + area.height - 1
      );
    }
  } else {
    setPointField(item, key, value, area, dashboard.display, definition);
  }
};

const constrainAll = (dashboard: Dashboard): void =>
  dashboard.items.forEach((item) => constrainItem(item, dashboard));

export const setDisplayNumber = (
  dashboard: Dashboard,
  key: "width" | "height" | "padding" | "snapSize",
  value: number
): void => {
  if (key === "width" || key === "height") {
    dashboard.display[key] = clamp(value, 64, 4096);
  }
  if (key === "padding") {
    dashboard.display.padding = clamp(
      value,
      0,
      Math.floor(
        (Math.min(dashboard.display.width, dashboard.display.height) - 1) / 2
      )
    );
  }
  if (key === "snapSize") dashboard.display.snapSize = clamp(value, 1, 256);
  constrainAll(dashboard);
};

export const applyProfile = (
  dashboard: Dashboard,
  profile: DisplayProfile
): void => {
  dashboard.display.profileId = profile.id;
  dashboard.display.width = profile.width;
  dashboard.display.height = profile.height;
  dashboard.display.palette = profile.defaultPalette;
  constrainAll(dashboard);
};

export const setPalette = (dashboard: Dashboard, palette: PaletteId): void => {
  dashboard.display.palette = palette;
  if (!PALETTE_COLORS[palette].includes(dashboard.display.background)) {
    dashboard.display.background = "white";
  }
};

export const setBackground = (dashboard: Dashboard, color: string): void => {
  dashboard.display.background = color;
};

export const toggleItemState = (
  dashboard: Dashboard,
  itemId: string,
  key: "locked" | "hidden"
): void => {
  const item = dashboard.items.find((candidate) => candidate.id === itemId);
  if (item) item[key] = !item[key];
};

export const removeItem = (dashboard: Dashboard, itemId: string): void => {
  dashboard.items = dashboard.items.filter((item) => item.id !== itemId);
};

/**
 * Move a layer next to another. The layer list shows the top item first,
 * so `before` means above.
 */
export const moveLayer = (
  dashboard: Dashboard,
  itemId: string,
  targetId: string,
  edge: "before" | "after"
): void => {
  const topFirst = [...dashboard.items].reverse();
  const from = topFirst.findIndex((item) => item.id === itemId);
  if (from < 0) return;
  const [moved] = topFirst.splice(from, 1);
  const targetIndex = topFirst.findIndex((item) => item.id === targetId);
  if (targetIndex < 0) return;
  topFirst.splice(edge === "before" ? targetIndex : targetIndex + 1, 0, moved);
  dashboard.items = topFirst.reverse();
};

export const setWidgetConfig = (
  dashboard: Dashboard,
  itemId: string,
  config: WidgetItem["widget"]["config"]
): void => {
  const item = dashboard.items.find((candidate) => candidate.id === itemId);
  if (item?.kind === "widget") item.widget.config = config;
};

export const updatePrimitiveFields = (
  dashboard: Dashboard,
  itemId: string,
  fields: Record<string, unknown>,
  definitions: PrimitiveDefinition[]
): void => {
  const item = dashboard.items.find((candidate) => candidate.id === itemId);
  if (item?.kind !== "primitive") return;
  const values = primitiveValuesFromForm(
    fields,
    definitionFor(item, definitions)
  );
  // Form values are typed loosely; the definition already decided what they may hold.
  item.primitive = { ...item.primitive, ...values } as Primitive;
};

/** A widget of its default size, centred on (x, y) and kept inside the working area. */
export const createWidgetItem = (
  definition: WidgetDefinition,
  x: number,
  y: number,
  dashboard: Dashboard
): WidgetItem => {
  const area = workingArea(dashboard);
  const width = Math.min(
    definition.layout.defaultSize?.width ?? 240,
    area.width
  );
  const height = Math.min(
    definition.layout.defaultSize?.height ?? 144,
    area.height
  );
  return {
    id: createId(),
    kind: "widget",
    locked: false,
    hidden: false,
    widget: {
      type: definition.id,
      version: definition.version,
      config: structuredClone(definition.defaults),
    },
    frame: {
      x: clamp(Math.round(x - width / 2), area.x, area.x + area.width - width),
      y: clamp(
        Math.round(y - height / 2),
        area.y,
        area.y + area.height - height
      ),
      width,
      height,
    },
    layout: { padding: 0 },
  };
};

/** A primitive centred on (x, y) inside the working area, or undefined for an unknown type. */
export const createPrimitiveItem = (
  definitions: PrimitiveDefinition[],
  type: string,
  x: number,
  y: number,
  dashboard: Dashboard
): PrimitiveItem | undefined => {
  const { width, height } = dashboard.display;
  const definition = definitions.find(
    (candidate) => candidate.type === type.trim()
  );
  const primitive = createPrimitive(definition, {
    x: Math.round(width / 2),
    y: Math.round(height / 2),
    displayWidth: width,
    displayHeight: height,
  });
  if (!primitive) return undefined;
  const item: PrimitiveItem = {
    id: createId(),
    kind: "primitive",
    locked: false,
    hidden: false,
    primitive,
  };
  const bounds = itemBounds(item);
  translateItem(
    item,
    Math.round(x - (bounds.x + bounds.width / 2)),
    Math.round(y - (bounds.y + bounds.height / 2))
  );
  constrainItem(item, dashboard);
  return item;
};

/** Where a click-added catalog item lands: a diagonal cascade so items do not stack exactly. */
export const catalogCascadePosition = (
  dashboard: Dashboard,
  snapEnabled: boolean
): { x: number; y: number } => {
  const area = workingArea(dashboard);
  const cascade =
    (dashboard.items.length * Math.max(dashboard.display.snapSize, 5) * 3) %
    Math.max(1, Math.min(area.width, area.height) / 3);
  return {
    x: snapToGrid(
      area.x + Math.min(24 + cascade, Math.max(0, area.width - 1)),
      dashboard,
      snapEnabled
    ),
    y: snapToGrid(
      area.y + Math.min(24 + cascade, Math.max(0, area.height - 1)),
      dashboard,
      snapEnabled
    ),
  };
};
