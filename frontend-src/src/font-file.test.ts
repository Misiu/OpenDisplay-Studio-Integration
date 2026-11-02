import { describe, expect, it } from "vitest";
import { fileAsBase64, fileSizeLabel, isFontFile } from "./font-file";

describe("isFontFile", () => {
  it.each(["Roboto.ttf", "Mono.OTF", "a b.Ttf"])("takes %s", (name) => {
    expect(isFontFile(name)).toBe(true);
  });

  it.each(["notes.txt", "font.woff", "ttf", "Roboto.ttf.zip"])(
    "refuses %s",
    (name) => {
      expect(isFontFile(name)).toBe(false);
    }
  );
});

describe("fileAsBase64", () => {
  it("encodes the bytes of a file", async () => {
    const file = new Blob([new Uint8Array([0, 1, 2, 250, 255])]);

    expect(await fileAsBase64(file)).toBe("AAEC+v8=");
  });

  it("encodes a file larger than one chunk", async () => {
    const bytes = new Uint8Array(100_000).map((_, index) => index % 251);

    const decoded = atob(await fileAsBase64(new Blob([bytes])));

    expect(decoded.length).toBe(bytes.length);
    expect(decoded.charCodeAt(99_999)).toBe(bytes[99_999]);
  });
});

describe("fileSizeLabel", () => {
  it("writes small files in KB and large ones in MB", () => {
    expect(fileSizeLabel(10)).toBe("1 KB");
    expect(fileSizeLabel(168 * 1024)).toBe("168 KB");
    expect(fileSizeLabel(1.5 * 1024 * 1024)).toBe("1.5 MB");
  });
});
