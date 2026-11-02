import { listFonts } from "./studio-api";
import type { FontInfo, HomeAssistant } from "./types";

let fonts: Promise<FontInfo[]> | undefined;

/**
 * The fonts the renderer can draw with, asked for once and kept, so every font field of the
 * panel shares one list. The settings page replaces it with `rememberFonts` after it
 * installs or removes a font.
 */
export const loadFonts = (hass: HomeAssistant): Promise<FontInfo[]> => {
  fonts ??= listFonts(hass).catch((error: unknown) => {
    fonts = undefined;
    throw error;
  });
  return fonts;
};

export const rememberFonts = (list: FontInfo[]): void => {
  fonts = Promise.resolve(list);
};

/** What to call a font: its family and style, like "Roboto Bold". */
export const fontLabel = (font: FontInfo): string =>
  [font.family, font.style]
    .filter((part) => part !== "" && part !== "Regular")
    .join(" ");

export const fontByName = (
  list: FontInfo[],
  name: string
): FontInfo | undefined => list.find((font) => font.name === name);
