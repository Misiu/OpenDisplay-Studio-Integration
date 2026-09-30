import { strings } from "./strings";
import { german } from "./strings.de";
import { polish } from "./strings.pl";

/** The shape of the English text with every entry optional: what a translation may hold. */
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer Args) => infer Result
    ? (...args: Args) => Result
    : { -readonly [Key in keyof T]: Widen<T[Key]> };
type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { [Key in keyof T]?: DeepPartial<T[Key]> }
    : T;
export type StringsOverride = DeepPartial<Widen<typeof strings>>;

const DEFAULT_LANGUAGE = "en";
const translations: Record<string, StringsOverride> = {
  de: german,
  pl: polish,
};

type Tree = Record<string, unknown>;

const isTree = (value: unknown): value is Tree =>
  typeof value === "object" && value !== null;

/** Copies `source` over `target` in place, entry by entry, descending into groups. */
const assignDeep = (target: Tree, source: Tree): void => {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    if (isTree(value) && isTree(current)) {
      assignDeep(current, value);
    } else {
      target[key] = value;
    }
  }
};

const cloneTree = (source: Tree): Tree =>
  Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key,
      isTree(value) ? cloneTree(value) : value,
    ])
  );

const english = cloneTree(strings);

/** The language code without its region: `pl-PL` is `pl`. */
export const baseLanguage = (language: string): string =>
  language.split("-", 1)[0]?.toLowerCase() || DEFAULT_LANGUAGE;

/**
 * Makes `strings` speak `language`: the panel follows the language of Home Assistant,
 * and whatever a translation lacks stays English. `strings` is changed in place, so
 * every element that imports it reads the new text at its next render.
 */
export const applyLanguage = (language: string): void => {
  assignDeep(strings, english);
  const override = translations[baseLanguage(language)];
  if (override) assignDeep(strings, override);
};
