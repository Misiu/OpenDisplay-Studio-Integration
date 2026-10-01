import { seedExpression, VISIBLE_KEY } from "./expressions";
import { optionDefaults } from "./widget-fields";
import { scaleChildren } from "./scale";
import { defaultItemName } from "./item-names";
import {
  allItems,
  findItem,
  locate,
  moveItem,
  moveRelative,
  removeFromTree,
} from "./tree";
import {
  constrainItem,
  itemBounds,
  snapToGrid,
  translateItem,
  workingArea,
} from "./geometry";
import { createId } from "./ids";
import { clamp } from "./math";
import { definitionFor, primitiveValuesFromForm } from "./item-fields";
import {
  isBoxPrimitive,
  reanchored,
  type CornerPrimitive,
} from "./primitive-shape";
import { createPrimitive, resolveLimit } from "./primitives";
import type {
  Dashboard,
  ItemBounds,
  Primitive,
  PrimitiveDefinition,
  PrimitiveItem,
  StudioItem,
  WidgetDefinition,
  WidgetOptions,
  WidgetPick,
  WidgetItem,
} from "./types";

/**
 * Edit one numeric field a primitive stores itself: a coordinate keeps the whole
 * element inside the working area, any other field stays within its definition's limits.
 */
const setStoredField = (
  item: PrimitiveItem,
  key: string,
  value: number,
  area: ItemBounds,
  display: Dashboard["display"],
  definition: PrimitiveDefinition | undefined
): void => {
  const primitive = item.primitive;
  const field = definition?.fields.find((candidate) => candidate.key === key);
  if (field?.shape === "coordinate") {
    const bounds = itemBounds(item);
    const stored = { ...primitive };
    const current = Number(Reflect.get(stored, key));
    const horizontal = field.axis === "x";
    const offset = (horizontal ? bounds.x : bounds.y) - current;
    const start = horizontal ? area.x : area.y;
    const extent = horizontal ? area.width : area.height;
    const size = horizontal ? bounds.width : bounds.height;
    const lowest = start - offset;
    const highest = start + extent - size - offset;
    Object.assign(primitive, {
      [key]: clamp(value, lowest, Math.max(lowest, highest)),
    });
    return;
  }
  if (field?.shape === "number" && field.section === "layout") {
    const minimum = resolveLimit(field.min, display, value);
    const maximum = resolveLimit(field.max, display, value);
    Object.assign(primitive, { [key]: clamp(value, minimum, maximum) });
  }
};

/** Edit one numeric layout field of a widget's frame or a container's box. */
const setBoxField = (
  box: { x: number; y: number; width: number; height: number },
  key: string,
  value: number,
  area: ItemBounds
): void => {
  if (key === "x") {
    box.x = clamp(value, area.x, area.x + area.width - box.width);
  }
  if (key === "y") {
    box.y = clamp(value, area.y, area.y + area.height - box.height);
  }
  if (key === "width") {
    box.width = clamp(value, 1, area.x + area.width - box.x);
  }
  if (key === "height") {
    box.height = clamp(value, 1, area.y + area.height - box.y);
  }
};

const setBoxPrimitiveField = (
  primitive: CornerPrimitive,
  key: string,
  value: number,
  area: ItemBounds
): void => {
  if (key === "x") {
    const width = primitive.x_end - primitive.x_start;
    primitive.x_start = clamp(value, area.x, area.x + area.width - width - 1);
    primitive.x_end = primitive.x_start + width;
  }
  if (key === "y") {
    const height = primitive.y_end - primitive.y_start;
    primitive.y_start = clamp(value, area.y, area.y + area.height - height - 1);
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
};

/** The field edit itself, for an item whose coordinates are display coordinates. */
const applyNumber = (
  item: StudioItem,
  key: string,
  value: number,
  dashboard: Dashboard,
  definitions: PrimitiveDefinition[]
): void => {
  const area = workingArea(dashboard);
  if (item.kind === "widget") {
    if (key === "padding") item.layout.padding = clamp(value, 0, 128);
    setBoxField(item.frame, key, value, area);
    return;
  }
  if (item.kind === "container") {
    const before = { width: item.width, height: item.height };
    setBoxField(item, key, value, area);
    if (item.grouped) {
      scaleChildren(
        item,
        item.width / Math.max(1, before.width),
        item.height / Math.max(1, before.height),
        definitions,
        dashboard.display
      );
    }
    return;
  }
  const primitive = item.primitive;
  if (isBoxPrimitive(primitive)) {
    setBoxPrimitiveField(primitive, key, value, area);
  } else {
    setStoredField(
      item,
      key,
      value,
      area,
      dashboard.display,
      definitionFor(item, definitions)
    );
  }
};

/**
 * Edit one numeric layout field of an item, keeping it inside the working area. Inside
 * a container the item stores relative coordinates, so the edit is made where the item
 * really is on the display and converted back.
 */
export const setItemNumber = (
  dashboard: Dashboard,
  itemId: string,
  key: string,
  value: number,
  definitions: PrimitiveDefinition[]
): void => {
  const found = locate(dashboard.items, itemId);
  if (!found || found.item.locked) return;
  const { item, offset } = found;
  translateItem(item, offset.x, offset.y);
  applyNumber(
    item,
    key,
    displayValue(key, value, offset),
    dashboard,
    definitions
  );
  translateItem(item, -offset.x, -offset.y);
};

/** A stored position is relative to the container; limits are checked on the display. */
const displayValue = (
  key: string,
  value: number,
  offset: { x: number; y: number }
): number => {
  if (key === "x") return value + offset.x;
  if (key === "y") return value + offset.y;
  return value;
};

const constrainAll = (dashboard: Dashboard): void =>
  dashboard.items.forEach((item) => constrainItem(item, dashboard));

export const setDisplayNumber = (
  dashboard: Dashboard,
  key: "padding" | "snapSize",
  value: number
): void => {
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

export const toggleItemState = (
  dashboard: Dashboard,
  itemId: string,
  key: "locked" | "hidden"
): void => {
  const item = findItem(dashboard.items, itemId);
  if (item) item[key] = !item[key];
};

export const removeItem = (dashboard: Dashboard, itemId: string): void => {
  removeFromTree(dashboard, itemId);
};

/**
 * Move a layer next to another, in the same container or in the target's. The layer
 * list shows the top item first, so `before` means above. The layer keeps its place
 * on the display.
 */
export const moveLayer = (
  dashboard: Dashboard,
  itemId: string,
  targetId: string,
  edge: "before" | "after" | "inside"
): void => {
  if (edge === "inside") {
    moveItem(dashboard, itemId, targetId || undefined, translateItem);
    return;
  }
  moveRelative(dashboard, itemId, targetId, edge, translateItem);
};

/** Gives an item a new name; an empty one is ignored. */
export const renameItem = (
  dashboard: Dashboard,
  itemId: string,
  name: string
): void => {
  const item = findItem(dashboard.items, itemId);
  const trimmed = name.trim();
  if (item && trimmed) item.name = trimmed.slice(0, 100);
};

export const setWidgetOptions = (
  dashboard: Dashboard,
  itemId: string,
  options: WidgetOptions
): void => {
  const item = findItem(dashboard.items, itemId);
  if (item?.kind === "widget") {
    item.widget.options = { ...item.widget.options, ...options };
  }
};

export const setWidgetPicks = (
  dashboard: Dashboard,
  itemId: string,
  sourceKey: string,
  picks: WidgetPick[]
): void => {
  const item = findItem(dashboard.items, itemId);
  if (item?.kind === "widget") {
    item.widget.sources = { ...item.widget.sources, [sourceKey]: picks };
  }
};

/**
 * Set one field of a primitive to a stored value. A new anchor keeps the element where it
 * is drawn, unless its position is an expression, which would put it back.
 */
export const setPrimitiveField = (
  dashboard: Dashboard,
  itemId: string,
  key: string,
  value: unknown,
  measured?: ItemBounds
): void => {
  const found = locate(dashboard.items, itemId);
  if (found?.item.kind !== "primitive" || found.item.locked) return;
  const item = found.item;
  const positionDriven = ["x", "y"].some((name) => item.expressions?.[name]);
  if (key === "anchor" && typeof value === "string" && !positionDriven) {
    reanchored(item.primitive, value, measured);
    return;
  }
  // The definitions decide what a field may hold; the panel only sends what they allow.
  item.primitive = { ...item.primitive, [key]: value } as Primitive;
};

export const updatePrimitiveFields = (
  dashboard: Dashboard,
  itemId: string,
  fields: Record<string, unknown>,
  definitions: PrimitiveDefinition[]
): void => {
  const item = findItem(dashboard.items, itemId);
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
    name: defaultItemName(allItems(dashboard.items), definition.id),
    kind: "widget",
    locked: false,
    hidden: false,
    widget: {
      type: definition.id,
      version: definition.version,
      sources: Object.fromEntries(
        definition.sources.map((source) => [source.key, []])
      ),
      options: optionDefaults(definition),
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
    name: defaultItemName(allItems(dashboard.items), primitive.type),
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
    (allItems(dashboard.items).length *
      Math.max(dashboard.display.snapSize, 5) *
      3) %
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

/** The current literal of a field, which a new expression starts from. */
const literalOf = (item: StudioItem, key: string): unknown => {
  if (key === VISIBLE_KEY) return !item.hidden;
  if (item.kind !== "primitive") return undefined;
  return Object.entries(item.primitive).find(([name]) => name === key)?.[1];
};

/**
 * Give a field an expression, or with `null` take it back to its literal. The literal
 * stays in the item either way. With `undefined` the field starts from an expression
 * that yields its current value.
 */
export const setItemExpression = (
  dashboard: Dashboard,
  itemId: string,
  key: string,
  template: string | null | undefined
): void => {
  const item = findItem(dashboard.items, itemId);
  if (!item || item.locked) return;
  const expressions = { ...item.expressions };
  if (template === null) {
    delete expressions[key];
  } else {
    expressions[key] = template ?? seedExpression(literalOf(item, key));
  }
  if (Object.keys(expressions).length === 0) {
    delete item.expressions;
  } else {
    item.expressions = expressions;
  }
};
