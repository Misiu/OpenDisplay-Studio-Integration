import { PALETTE_COLORS } from "./display-profiles";
import { strings } from "./strings";
import type {
  PaletteId,
  PrimitiveField,
  WidgetDefinition,
  WidgetFieldDefinition,
  WidgetOptions,
  WidgetPick,
  WidgetSourceDefinition,
  WidgetValue,
} from "./types";

const COLOR_SELECTOR = "opendisplay_color";
const RANGES_SELECTOR = "opendisplay_ranges";
const FONT_SELECTOR = "opendisplay_font";
const ACCENT = "accent";

/**
 * A field's selector as `ha-form` understands it: the palette colour picker is ours,
 * so it becomes a plain select of the colours the display can show.
 */
export const formSelector = (
  selector: Record<string, unknown>,
  palette: PaletteId
): Record<string, unknown> => {
  if (!(COLOR_SELECTOR in selector)) return selector;
  return { select: { options: [...PALETTE_COLORS[palette], ACCENT] } };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** The options of a `select` selector: plain values, or `{ value, label }` pairs. */
const selectOptions = (
  config: Record<string, unknown>
): { options: string[]; labels: Record<string, string> } => {
  const raw = Array.isArray(config.options) ? config.options : [];
  const labels: Record<string, string> = {};
  const options = raw.flatMap((entry: unknown) => {
    if (typeof entry === "string") return [entry];
    if (!isRecord(entry) || typeof entry.value !== "string") return [];
    if (typeof entry.label === "string") labels[entry.value] = entry.label;
    return [entry.value];
  });
  return { options, labels };
};

const numberLimit = (value: unknown): number | undefined =>
  typeof value === "number" ? value : undefined;

/**
 * A widget field described like a field of a primitive, so a widget is edited with the same
 * controls. Fields that need Home Assistant's own pickers (entities, devices, areas) have
 * no such description and keep `ha-form`.
 */
export const widgetFieldAsPrimitive = (
  field: WidgetFieldDefinition
): PrimitiveField | undefined => {
  const base = {
    key: field.key,
    label: field.label,
    section: "appearance" as const,
    default: field.default ?? undefined,
    optional: field.optional ? true : undefined,
    placeholder: field.optional ? strings.common.auto : undefined,
  };
  const { selector } = field;
  if ("boolean" in selector) return { ...base, shape: "boolean" };
  if (COLOR_SELECTOR in selector) {
    // An optional color may be left unset, which the widget reads as automatic.
    return field.optional
      ? {
          ...base,
          shape: "color",
          nullable: true,
          emptyLabel: strings.common.auto,
        }
      : { ...base, shape: "color" };
  }
  if (FONT_SELECTOR in selector) return { ...base, shape: "font" };
  const ranges = selector[RANGES_SELECTOR];
  if (isRecord(ranges)) {
    return { ...base, shape: "ranges", max: numberLimit(ranges.max) };
  }
  const number = selector.number;
  if (isRecord(number)) {
    return {
      ...base,
      shape: "number",
      min: numberLimit(number.min),
      max: numberLimit(number.max),
      // `step: any` is how a selector asks for a fraction.
      decimal: number.step === "any" ? true : undefined,
      unit:
        typeof number.unit_of_measurement === "string"
          ? number.unit_of_measurement
          : undefined,
    };
  }
  const select = selector.select;
  if (isRecord(select) && select.multiple !== true) {
    const { options, labels } = selectOptions(select);
    return { ...base, shape: "enum", options, optionLabels: labels };
  }
  const text = selector.text;
  if (isRecord(text)) {
    return { ...base, shape: text.multiline === true ? "text" : "string" };
  }
  return undefined;
};

const isWidgetValue = (value: unknown): value is WidgetValue =>
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean" ||
  // A list of ids, or a list of colored ranges.
  Array.isArray(value);

/** The value a new widget starts with for a field: its default, else a neutral one. */
export const fieldDefault = (
  field: WidgetFieldDefinition
): WidgetValue | null => {
  if (field.default !== undefined) return field.default;
  if (field.optional) return null;
  if ("boolean" in field.selector) return false;
  if ("number" in field.selector) return 0;
  return "";
};

export const optionDefaults = (definition: WidgetDefinition): WidgetOptions =>
  Object.fromEntries(
    definition.options
      .flatMap((section) => section.fields)
      .map((field) => [field.key, fieldDefault(field)])
  );

/** What `ha-form` reported for the options, kept to the options the widget declares. */
export const optionsFromForm = (
  values: Record<string, unknown>,
  definition: WidgetDefinition
): WidgetOptions => {
  const known = new Set(
    definition.options.flatMap((section) =>
      section.fields.map((field) => field.key)
    )
  );
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, WidgetValue] =>
        known.has(entry[0]) && isWidgetValue(entry[1])
    )
  );
};

/** A source picks several things when its selector says `multiple`, otherwise one. */
export const isMultiple = (source: WidgetSourceDefinition): boolean =>
  Object.values(source.selector).some(
    (config) =>
      typeof config === "object" && config !== null && "multiple" in config
  );

export const idsFromPicks = (
  source: WidgetSourceDefinition,
  picks: WidgetPick[]
): string | string[] => {
  const ids = picks.map((pick) => pick.id);
  return isMultiple(source) ? ids : (ids[0] ?? "");
};

/**
 * The picks for the ids the user chose. A thing that stays picked keeps its
 * per-source fields (label, colour); the order is the order of the ids.
 */
export const picksFromIds = (
  previous: WidgetPick[],
  chosen: unknown
): WidgetPick[] => {
  const ids = Array.isArray(chosen) ? chosen : [chosen];
  return ids
    .filter((id): id is string => typeof id === "string" && id !== "")
    .map((id) => previous.find((pick) => pick.id === id) ?? { id });
};

/** Replaces one per-source field of one pick; an empty text clears the field. */
export const withPickFields = (
  picks: WidgetPick[],
  pickId: string,
  values: Record<string, unknown>,
  source: WidgetSourceDefinition
): WidgetPick[] => {
  const fieldKeys = new Set(source.perSource.map((field) => field.key));
  return picks.map((pick) => {
    if (pick.id !== pickId) return pick;
    const next: WidgetPick = { id: pick.id };
    const merged = { ...pick, ...values };
    for (const key of fieldKeys) {
      const value = merged[key];
      if (
        (typeof value === "string" && value !== "") ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        next[key] = value;
      }
    }
    return next;
  });
};
