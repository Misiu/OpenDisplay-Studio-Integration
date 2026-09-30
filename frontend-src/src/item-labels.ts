import type {
  PrimitiveDefinition,
  StudioItem,
  WidgetDefinition,
} from "./types";

/** The catalog entry an item was made from, if the backend still offers it. */
const definitionOf = (
  item: StudioItem,
  widgets: WidgetDefinition[],
  primitives: PrimitiveDefinition[]
): WidgetDefinition | PrimitiveDefinition | undefined => {
  if (item.kind === "widget") {
    return widgets.find((widget) => widget.id === item.widget.type);
  }
  return primitives.find((primitive) => primitive.type === item.primitive.type);
};

export const itemIcon = (
  item: StudioItem,
  widgets: WidgetDefinition[],
  primitives: PrimitiveDefinition[]
): string => definitionOf(item, widgets, primitives)?.icon ?? "mdi:puzzle";
