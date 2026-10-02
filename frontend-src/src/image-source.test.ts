import { describe, expect, it } from "vitest";
import { imageKind, mediaReference } from "./image-source";

describe("imageKind", () => {
  it("tells the sources the backend can read from the rest", () => {
    expect(imageKind("camera.door")).toBe("entity");
    expect(imageKind("image.weather_map")).toBe("entity");
    expect(imageKind("https://example.org/a.png")).toBe("web");
    expect(imageKind("/local/logo.png")).toBe("file");
    expect(imageKind("/media/local/photos/a.png")).toBe("file");
    expect(imageKind("media-source://image_upload/abc")).toBe("file");
    expect(imageKind("sensor.temperature")).toBe("other");
    expect(imageKind("logo.png")).toBe("other");
  });
});

describe("mediaReference", () => {
  it("turns a file of a local media source into its path", () => {
    expect(
      mediaReference("media-source://media_source/local/photos/my%20cat.png")
    ).toBe("/media/local/photos/my cat.png");
  });

  it("keeps the address of any other media source, such as an uploaded image", () => {
    expect(mediaReference("media-source://image_upload/0123abcd")).toBe(
      "media-source://image_upload/0123abcd"
    );
  });

  it("gives nothing for what is no media source", () => {
    expect(mediaReference("")).toBeUndefined();
    expect(mediaReference("https://example.org/a.png")).toBeUndefined();
  });
});
