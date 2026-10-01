import { loadPrimitiveDefinitions } from "./primitive-definitions";
import { createPrimitive } from "./primitives";
import { loadWidgetDefinitions } from "./widget-definitions";
import type {
  ContainerItem,
  Dashboard,
  Primitive,
  PrimitiveItem,
  StudioItem,
  WidgetDefinition,
  WidgetItem,
} from "./types";

const definitions = loadPrimitiveDefinitions();

/** A primitive item as the panel creates it, with the given fields changed. */
export const primitiveItem = (
  type: Primitive["type"],
  id: string,
  values: Record<string, unknown> = {}
): PrimitiveItem => {
  const primitive = createPrimitive(
    definitions.find((definition) => definition.type === type),
    { x: 0, y: 0, displayWidth: 800, displayHeight: 480 }
  );
  if (!primitive) throw new Error(`No definition for ${type}`);
  Object.assign(primitive, values);
  return {
    id,
    name: id,
    kind: "primitive",
    locked: false,
    hidden: false,
    primitive,
  };
};

export const rectangleItem = (
  id = "rect",
  overrides: Record<string, unknown> = {}
): PrimitiveItem =>
  primitiveItem("rectangle", id, {
    x_start: 20,
    y_start: 30,
    x_end: 119,
    y_end: 79,
    fill: null,
    ...overrides,
  });

export const circleItem = (id = "circle"): PrimitiveItem =>
  primitiveItem("circle", id, { x: 100, y: 100, radius: 20, fill: null });

export const textItem = (id = "text"): PrimitiveItem =>
  primitiveItem("text", id, { value: "Text", x: 10, y: 10 });

export const widgetItem = (id = "widget"): WidgetItem => ({
  id,
  name: id,
  kind: "widget",
  locked: false,
  hidden: false,
  widget: { type: "sensor-card", version: "1", sources: {}, options: {} },
  frame: { x: 10, y: 10, width: 200, height: 100 },
  layout: { padding: 0 },
});

export const dashboardWith = (
  items: StudioItem[] = [],
  display: Partial<Dashboard["display"]> = {}
): Dashboard => ({
  id: "d1",
  schemaVersion: 1,
  name: "Test",
  status: "draft",
  language: "en",
  display: {
    profileId: "custom",
    width: 400,
    height: 300,
    palette: "bw",
    background: "white",
    padding: 0,
    snapSize: 5,
    rotation: 0,
    deviceId: null,
    ...display,
  },
  items,
  createdAt: "",
  updatedAt: "",
});

/** The definitions the backend ships, read from the repository. */
export const primitiveDefinitions = definitions;
export const widgetDefinitions = loadWidgetDefinitions();

/** One built-in widget's definition, as the backend ships it. */
export const widgetDefinition = (id: string): WidgetDefinition => {
  const definition = widgetDefinitions.find((widget) => widget.id === id);
  if (!definition) throw new Error(`No built-in widget ${id}`);
  return definition;
};

/** A container at (100, 50) of size 200 × 120 holding `children`. */
export const containerItem = (
  id = "box",
  children: StudioItem[] = [],
  overrides: Partial<ContainerItem> = {}
): ContainerItem => ({
  id,
  name: id,
  kind: "container",
  locked: false,
  hidden: false,
  x: 100,
  y: 50,
  width: 200,
  height: 120,
  grouped: false,
  background: null,
  children,
  ...overrides,
});
