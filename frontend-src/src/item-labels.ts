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

/**
 * What the structure list, canvas and inspector call an item: a widget's own
 * title if it has one, otherwise the name from its catalog entry.
 */
export const itemName = (
  item: StudioItem,
  widgets: WidgetDefinition[],
  primitives: PrimitiveDefinition[]
): string => {
  if (item.kind === "widget") {
    const title = item.widget.config.title;
    if (typeof title === "string" && title.trim()) {
      return title;
    }
    return definitionOf(item, widgets, primitives)?.name ?? item.widget.type;
  }
  return definitionOf(item, widgets, primitives)?.name ?? item.primitive.type;
};

export const itemIcon = (
  item: StudioItem,
  widgets: WidgetDefinition[],
  primitives: PrimitiveDefinition[]
): string => definitionOf(item, widgets, primitives)?.icon ?? "mdi:puzzle";
