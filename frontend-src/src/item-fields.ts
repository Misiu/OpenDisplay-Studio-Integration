import { PALETTE_COLORS } from "./display-profiles";
import { UNCHANGED, valueFromForm } from "./field-codecs";
import { isBoxPrimitive, primitiveBounds } from "./primitive-shape";
import { resolveLimit } from "./primitives";
import { strings } from "./strings";
import type {
  ContainerItem,
  Dashboard,
  HaFormSchema,
  PaletteId,
  PrimitiveDefinition,
  PrimitiveField,
  PrimitiveItem,
  StudioItem,
  WidgetItem,
} from "./types";

/** One numeric layout input of the inspector. */
export interface LayoutField {
  label: string;
  key: string;
  value: number;
  min: number;
  max: number;
  /** The field is one the primitive stores itself, so it can be an expression. */
  stored: boolean;
}

/** The layout inputs of an item: a grid of position/size fields plus any that sit below it. */
export interface LayoutFields {
  grid: LayoutField[];
  extra: LayoutField[];
}

const NO_FIELDS: LayoutFields = { grid: [], extra: [] };
const TRANSPARENT = "transparent";

/** The definition of a primitive item, if the backend offers that type. */
export const definitionFor = (
  item: PrimitiveItem,
  definitions: PrimitiveDefinition[]
): PrimitiveDefinition | undefined =>
  definitions.find((definition) => definition.type === item.primitive.type);

/** A layout input; derived ones (a box's width, a widget's frame) are not stored fields. */
const layoutField = (
  label: string,
  key: string,
  value: number,
  min: number,
  max: number,
  stored = false
): LayoutField => ({ label, key, value, min, max, stored });

const widgetLayoutFields = (
  item: WidgetItem,
  dashboard: Dashboard
): LayoutFields => {
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  return {
    grid: [
      layoutField(labels.x, "x", item.frame.x, 0, width),
      layoutField(labels.y, "y", item.frame.y, 0, height),
      layoutField(labels.width, "width", item.frame.width, 1, width),
      layoutField(labels.height, "height", item.frame.height, 1, height),
    ],
    extra: [
      layoutField(labels.innerPadding, "padding", item.layout.padding, 0, 128),
    ],
  };
};

const containerLayoutFields = (
  item: ContainerItem,
  dashboard: Dashboard
): LayoutFields => {
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  return {
    grid: [
      layoutField(labels.x, "x", item.x, -width, width),
      layoutField(labels.y, "y", item.y, -height, height),
      layoutField(labels.width, "width", item.width, 1, width),
      layoutField(labels.height, "height", item.height, 1, height),
    ],
    extra: [],
  };
};

/** A box or line is edited as left, top, width and height, whichever way it was drawn. */
const cornerLayoutFields = (
  item: PrimitiveItem,
  dashboard: Dashboard
): LayoutFields => {
  const primitive = item.primitive;
  if (!isBoxPrimitive(primitive)) {
    return NO_FIELDS;
  }
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  const bounds = primitiveBounds(primitive);
  return {
    grid: [
      layoutField(labels.x, "x", bounds.x, 0, width),
      layoutField(labels.y, "y", bounds.y, 0, height),
      layoutField(labels.width, "width", bounds.width, 1, width),
      layoutField(labels.height, "height", bounds.height, 1, height),
    ],
    extra: [],
  };
};

const storedLayoutField = (
  field: PrimitiveField,
  values: Record<string, unknown>,
  dashboard: Dashboard
): LayoutField => {
  const display = dashboard.display;
  const coordinateLimit = field.axis === "x" ? display.width : display.height;
  const isCoordinate = field.shape === "coordinate";
  return layoutField(
    field.label,
    field.key,
    Number(values[field.key]),
    isCoordinate ? 0 : resolveLimit(field.min, display, 0),
    isCoordinate
      ? coordinateLimit
      : resolveLimit(field.max, display, coordinateLimit),
    true
  );
};

const isNumeric = (field: PrimitiveField): boolean =>
  field.shape === "coordinate" || field.shape === "number";

/** The layout fields a primitive stores itself, straight from its definition. */
const storedLayoutFields = (
  item: PrimitiveItem,
  definition: PrimitiveDefinition,
  dashboard: Dashboard
): LayoutFields => {
  const values: Record<string, unknown> = { ...item.primitive };
  const grid = definition.fields
    .filter((field) => field.section === "layout" && isNumeric(field))
    .map((field) => storedLayoutField(field, values, dashboard));
  return { grid, extra: [] };
};

const isCornerGeometry = (definition: PrimitiveDefinition): boolean =>
  definition.geometry === "box" || definition.geometry === "line";

/** Whether a box or line can also be edited by its corners, where each may be an expression. */
export const hasCornerFields = (
  item: StudioItem,
  definitions: PrimitiveDefinition[]
): boolean => {
  if (item.kind !== "primitive") return false;
  const definition = definitionFor(item, definitions);
  return definition !== undefined && isCornerGeometry(definition);
};

/**
 * The numeric layout fields the inspector shows for an item, from its definition. A box
 * or line shows left, top, width and height, or with `corners` the four stored corners.
 */
export const layoutFields = (
  item: StudioItem,
  dashboard: Dashboard,
  definitions: PrimitiveDefinition[],
  corners = false
): LayoutFields => {
  if (item.kind === "widget") {
    return widgetLayoutFields(item, dashboard);
  }
  if (item.kind === "container") {
    return containerLayoutFields(item, dashboard);
  }
  const definition = definitionFor(item, definitions);
  if (!definition) {
    return NO_FIELDS;
  }
  return isCornerGeometry(definition) && !corners
    ? cornerLayoutFields(item, dashboard)
    : storedLayoutFields(item, definition, dashboard);
};

/** The `ha-form` selector of a nested field, which the object selector lists by key. */
const nestedFields = (
  field: PrimitiveField,
  colors: string[]
): Record<string, unknown> =>
  Object.fromEntries(
    (field.nested ?? []).map((child) => [
      child.key,
      { label: child.label, selector: formSelector(child, colors) },
    ])
  );

const formSelector = (
  field: PrimitiveField,
  colors: string[]
): Record<string, unknown> => {
  switch (field.shape) {
    case "boolean":
      return { boolean: {} };
    case "enum":
      return { select: { options: field.options ?? [] } };
    case "flags":
      return { select: { options: field.options ?? [], multiple: true } };
    case "font":
      return { select: { options: field.options ?? [], custom_value: true } };
    case "color":
      return {
        select: {
          options: field.nullable ? [TRANSPARENT, ...colors] : colors,
        },
      };
    case "number":
      return {
        number: {
          min: typeof field.min === "number" ? field.min : undefined,
          max: typeof field.max === "number" ? field.max : undefined,
          step: field.decimal ? "any" : undefined,
          mode: field.decimal ? "box" : undefined,
        },
      };
    case "entity":
      return { entity: {} };
    case "points":
    case "icons":
      return { text: { multiline: true } };
    case "object":
      return { object: { fields: nestedFields(field, colors) } };
    case "objects":
      return {
        object: {
          multiple: true,
          label_field: field.nested?.[0]?.key,
          fields: nestedFields(field, colors),
        },
      };
    default:
      return { text: {} };
  }
};

/** The `ha-form` entry for a nested field, whose structure Home Assistant edits. */
export const fieldFormSchema = (
  field: PrimitiveField,
  palette: PaletteId
): HaFormSchema => ({
  name: field.key,
  label: field.label,
  selector: formSelector(field, [...PALETTE_COLORS[palette], "accent"]),
});

/**
 * The fields of a primitive the panel shows as controls of their own, from its definition.
 * Numbers in the layout section have inputs in the layout grid; anything else in that
 * section, such as the anchor, is listed with `layout`. Fields the backend fixes are left out.
 */
export const primitiveFields = (
  item: PrimitiveItem,
  definitions: PrimitiveDefinition[],
  section: PrimitiveField["section"]
): PrimitiveField[] =>
  (definitionFor(item, definitions)?.fields ?? []).filter(
    (field) =>
      field.visible !== false &&
      field.section === section &&
      (section === "appearance" || !isNumeric(field))
  );

/** Turn what the appearance form reports back into primitive values. */
export const primitiveValuesFromForm = (
  values: Record<string, unknown>,
  definition: PrimitiveDefinition | undefined
): Record<string, unknown> => {
  const result = { ...values };
  for (const field of definition?.fields ?? []) {
    if (!(field.key in result)) continue;
    const value = valueFromForm(field, result[field.key]);
    if (value === UNCHANGED) {
      delete result[field.key];
    } else {
      result[field.key] = value;
    }
  }
  return result;
};
