/** The font files the renderer reads. */
export const FONT_EXTENSIONS = [".ttf", ".otf"];
export const FONT_ACCEPT = FONT_EXTENSIONS.join(",");

/** The most the backend takes in one font, in bytes. */
export const MAX_FONT_BYTES = 2 * 1024 * 1024;

export const isFontFile = (name: string): boolean =>
  FONT_EXTENSIONS.some((extension) => name.toLowerCase().endsWith(extension));

/** The bytes of a file as base64, which is how a WebSocket message carries them. */
export const fileAsBase64 = async (file: Blob): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const CHUNK = 0x8000;
  let binary = "";
  for (let start = 0; start < bytes.length; start += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(start, start + CHUNK));
  }
  return btoa(binary);
};

/** The size of a file for people: `168 KB`, `1.4 MB`. */
export const fileSizeLabel = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
