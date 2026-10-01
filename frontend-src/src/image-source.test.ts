import { describe, expect, it } from "vitest";
import { imageKind, mediaPath } from "./image-source";

describe("imageKind", () => {
  it("tells the sources the backend can read from the rest", () => {
    expect(imageKind("camera.door")).toBe("entity");
    expect(imageKind("image.weather_map")).toBe("entity");
    expect(imageKind("https://example.org/a.png")).toBe("web");
    expect(imageKind("/local/logo.png")).toBe("file");
    expect(imageKind("/media/local/photos/a.png")).toBe("file");
    expect(imageKind("sensor.temperature")).toBe("other");
    expect(imageKind("logo.png")).toBe("other");
  });
});

describe("mediaPath", () => {
  it("turns a file of a local media source into the path the backend reads", () => {
    expect(
      mediaPath("media-source://media_source/local/photos/my%20cat.png")
    ).toBe("/media/local/photos/my cat.png");
  });

  it("gives nothing for what is not a file of a media source", () => {
    expect(mediaPath("media-source://camera/camera.door")).toBeUndefined();
    expect(mediaPath("")).toBeUndefined();
  });
});
