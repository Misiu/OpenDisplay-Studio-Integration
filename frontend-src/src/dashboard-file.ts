/** The file a dashboard is exported to and imported from: the parts the panel handles. */

const FALLBACK_FILE_NAME = "dashboard";

/** The name of the file for a dashboard: its name as a slug, so it is safe on any system. */
export const exportFileName = (dashboardName: string): string => {
  const slug = dashboardName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // "ł" has no accent to take off: it is a letter of its own.
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || FALLBACK_FILE_NAME}.json`;
};

/** What the backend finds for a color of the file that the dashboard's palette lacks. */
export interface ColorToMap {
  source: string;
  /** The color of the palette that looks most like it. */
  suggestion: string;
}

/** The mapping the dialog starts with: every color on the one that looks most like it. */
export const suggestedMapping = (rows: ColorToMap[]): Record<string, string> =>
  Object.fromEntries(rows.map((row) => [row.source, row.suggestion]));

/** The text of a file as JSON, or `undefined` when it is not. */
export const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};
