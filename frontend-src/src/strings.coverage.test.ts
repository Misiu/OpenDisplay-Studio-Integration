import { describe, expect, it } from "vitest";
import { strings } from "./strings";
import { german } from "./strings.de";
import { polish } from "./strings.pl";

/** The path of every string in a tree of text, such as `inspector.appearance`. */
const textPaths = (tree: unknown, prefix = ""): string[] => {
  if (typeof tree === "string" || typeof tree === "function") return [prefix];
  if (typeof tree !== "object" || tree === null) return [];
  return Object.entries(tree).flatMap(([key, value]) =>
    textPaths(value, prefix ? `${prefix}.${key}` : key)
  );
};

const has = (tree: unknown, path: string): boolean =>
  path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        typeof node === "object" && node !== null
          ? Reflect.get(node, key)
          : undefined,
      tree
    ) !== undefined;

/**
 * Text that reads the same in a language, or that is a name and not a word. Everything else
 * has to be written out, so a language is never half English.
 */
const SAME_IN_EVERY_LANGUAGE = new Set<string>([
  "common.auto",
  "common.size",
  "common.sizeInPixels",
  "common.milliseconds",
  "header.studio",
  "expression.placeholder",
  "zoom.preset",
  "code.status.idle",
  "fields.x",
  "fields.y",
  "settings.overview.times",
  "settings.fonts.sample",
]);

describe.each([
  ["Polish", polish],
  ["German", german],
])("the %s translation", (_name, translation) => {
  it("has every text the English panel has", () => {
    const missing = textPaths(strings).filter(
      (path) => !SAME_IN_EVERY_LANGUAGE.has(path) && !has(translation, path)
    );

    expect(missing).toEqual([]);
  });
});
