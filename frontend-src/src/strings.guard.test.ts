import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * UI text lives in `strings.ts`. This scans the shipped sources for text that is written
 * inline in a template or in a user-facing attribute, error or label.
 */
const SRC = import.meta.dirname;
const EXEMPT = new Set(["strings.ts", "dev.ts", "test-support.ts", "types.ts"]);

const sources = readdirSync(SRC)
  .filter(
    (name) =>
      name.endsWith(".ts") &&
      !name.endsWith(".test.ts") &&
      !name.endsWith(".d.ts") &&
      !EXEMPT.has(name)
  )
  .map((name) => ({ name, text: readFileSync(join(SRC, name), "utf8") }));

/** Drop `css` blocks: they hold selectors and property values, never user text. */
const withoutStyles = (text: string): string =>
  text.replace(/css`[\s\S]*?`/g, "");

const TEMPLATE_TEXT =
  /(?<![=-])>([^<>$`{}=&|;()"\n]*[A-Za-z]{2}[^<>$`{}=&|;()"\n]*)</g;
const TEXT_ATTRIBUTE =
  /\b(?:aria-label|title|placeholder|header-title|header-subtitle|alt|label)="([^"$]*[A-Za-z]{2}[^"]*)"/g;
const USER_FACING_LITERAL =
  /\b(?:label|title|description|error)\s*[:=]\s*'([^']*[A-Za-z]{2}[^']*)'/g;
const FAILURE_MESSAGE =
  /'(Could not [^']*|Unsupported [^']*|[^']* cannot be empty)'/g;
/** A template literal in an attribute; only its own words count, not the `${values}` in it. */
const TEXT_ATTRIBUTE_TEMPLATE =
  /\b(?:aria-label|title|placeholder|header-title|header-subtitle|label)=\$\{`([^`]*)`\}/g;
const hasOwnWords = (template: string): boolean =>
  /[A-Za-z]{2}/.test(template.replace(/\$\{[^}]*\}/g, ""));
const TEXT_AFTER_INTERPOLATION =
  /\}([^<>${}=&|;()"`\n]*[A-Za-z]{2}[^<>${}=&|;()"`\n]*)</g;
const TEXT_BEFORE_INTERPOLATION =
  />([^<>${}=&|;()"`\n]*[A-Za-z]{2}[^<>${}=&|;()"`\n]*)\$\{/g;
const CAPITALISED_CHOICE = /[?:]\s*'([A-Z][a-z]+[^']*)'/g;
const HELPER_ARGUMENT =
  /\b(?:renderHeader|renderDisplayField|field|text|number|toggle|color)\(\s*'([A-Z][^']*)'/g;

/** The display catalogue is hardware data (brand and product names), not interface text. */
const CATALOGUE = new Set(["display-profiles.ts"]);

const findings = (pattern: RegExp, { catalogue = true } = {}): string[] =>
  sources
    .filter(({ name }) => catalogue || !CATALOGUE.has(name))
    .flatMap(({ name, text }) =>
      [...withoutStyles(text).matchAll(pattern)].map(
        (match) => `${name}: ${match[1]?.trim() ?? match[0]}`
      )
    );

describe("UI text is centralised in strings.ts", () => {
  it("has no text written inline in templates", () => {
    expect(findings(TEMPLATE_TEXT)).toEqual([]);
  });

  it("has no user-facing attribute written inline", () => {
    expect(findings(TEXT_ATTRIBUTE)).toEqual([]);
  });

  it("has no label, title, description or error written inline", () => {
    expect(findings(USER_FACING_LITERAL)).toEqual([]);
  });

  it("has no failure message written inline", () => {
    expect(findings(FAILURE_MESSAGE)).toEqual([]);
  });

  it("has no text mixed with a value written inline", () => {
    expect([
      ...findings(TEXT_ATTRIBUTE_TEMPLATE).filter((finding) =>
        hasOwnWords(finding.slice(finding.indexOf(": ") + 2))
      ),
      ...findings(TEXT_AFTER_INTERPOLATION),
      ...findings(TEXT_BEFORE_INTERPOLATION),
    ]).toEqual([]);
  });

  it("has no text chosen inline by a condition or passed to a helper", () => {
    expect([
      ...findings(CAPITALISED_CHOICE, { catalogue: false }),
      ...findings(HELPER_ARGUMENT),
    ]).toEqual([]);
  });
});
