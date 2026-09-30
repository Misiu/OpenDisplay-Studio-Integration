import { parse } from "yaml";
import type {
  WidgetDefinition,
  WidgetFieldDefinition,
  WidgetOptionSection,
  WidgetSourceDefinition,
  WidgetValue,
} from "./types";

/**
 * The backend's built-in widget packages, read straight from the repository and
 * localized the way `WidgetRegistry.definitions` does. The dev harness and the unit
 * tests use these instead of a copy, so the panel is always tested against the
 * manifests the backend really ships.
 */
const manifests = import.meta.glob(
  "../../custom_components/opendisplay_studio/widgets/*/widget.yml",
  { query: "?raw", import: "default", eager: true }
);
const translationFiles = import.meta.glob(
  "../../custom_components/opendisplay_studio/widgets/*/translations/*.json",
  { query: "?raw", import: "default", eager: true }
);

type Translations = Record<string, string>;
type RawField = Omit<WidgetFieldDefinition, "label"> & { label: string };
interface RawManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  icon: string;
  category?: string;
  author?: string;
  layout: WidgetDefinition["layout"];
  sources?: Array<
    RawField & {
      required?: boolean;
      max?: number;
      data?: string;
      perSource?: RawField[];
    }
  >;
  options?: Array<{ section: string; fields: RawField[] }>;
}

const folderOf = (path: string): string =>
  path.split("/widgets/")[1]?.split("/")[0] ?? "";

const translationsFor = (folder: string, language: string): Translations => {
  const read = (code: string): Translations => {
    const entry = Object.entries(translationFiles).find(([path]) =>
      path.endsWith(`/${folder}/translations/${code}.json`)
    );
    return entry ? JSON.parse(String(entry[1])) : {};
  };
  return { ...read("en"), ...read(language) };
};

const selectOptions = (selector: Record<string, unknown>): string[] => {
  const config = selector.select;
  if (typeof config !== "object" || config === null) return [];
  const options: unknown = Reflect.get(config, "options");
  return Array.isArray(options) ? options.map(String) : [];
};

/** The same default the backend's `default_for` gives an option that declares none. */
const defaultFor = (field: RawField): WidgetValue => {
  if (field.default !== undefined) return field.default;
  if ("boolean" in field.selector) return false;
  if ("number" in field.selector) {
    const config = field.selector.number;
    const minimum =
      typeof config === "object" && config !== null
        ? Reflect.get(config, "min")
        : undefined;
    return typeof minimum === "number" ? minimum : 0;
  }
  if ("select" in field.selector) return selectOptions(field.selector)[0] ?? "";
  if ("opendisplay_color" in field.selector) return "black";
  return "";
};

const localizedSource = (
  source: NonNullable<RawManifest["sources"]>[number],
  texts: Translations
): WidgetSourceDefinition => ({
  key: source.key,
  selector: source.selector,
  required: source.required ?? false,
  max: source.max ?? 10,
  data: source.data,
  label: texts[`sources.${source.key}`] ?? source.label,
  perSource: (source.perSource ?? []).map((field) => ({
    key: field.key,
    selector: field.selector,
    label: texts[`sources.${source.key}.${field.key}`] ?? field.label,
  })),
});

const localizedSection = (
  section: NonNullable<RawManifest["options"]>[number],
  texts: Translations
): WidgetOptionSection => ({
  section: texts[`sections.${section.section}`] ?? section.section,
  fields: section.fields.map((field) => ({
    key: field.key,
    selector: field.selector,
    label: texts[`options.${field.key}`] ?? field.label,
    default: defaultFor(field),
  })),
});

export const loadWidgetDefinitions = (language = "en"): WidgetDefinition[] =>
  Object.entries(manifests)
    .map(([path, text]): WidgetDefinition => {
      const raw: RawManifest = parse(String(text));
      const texts = translationsFor(folderOf(path), language);
      const category = raw.category ?? "General";
      return {
        id: raw.id,
        version: raw.version,
        name: texts.name ?? raw.name,
        description: texts.description ?? raw.description,
        icon: raw.icon,
        category: texts[`categories.${category}`] ?? category,
        author: raw.author ?? "",
        builtin: true,
        layout: raw.layout,
        sources: (raw.sources ?? []).map((source) =>
          localizedSource(source, texts)
        ),
        options: (raw.options ?? []).map((section) =>
          localizedSection(section, texts)
        ),
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
