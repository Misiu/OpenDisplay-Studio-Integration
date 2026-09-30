import { afterEach, describe, expect, it, vi } from "vitest";
import { createId } from "./ids";

describe("createId", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses Crypto.randomUUID when available", () => {
    const randomUUID = vi.fn(() => "11111111-2222-4333-8444-555555555555");
    vi.stubGlobal("crypto", { randomUUID });

    expect(createId()).toBe("11111111-2222-4333-8444-555555555555");
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it("creates a UUID using getRandomValues when randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (bytes: Uint8Array) => {
        bytes.forEach((_, index) => {
          bytes[index] = index;
        });
        return bytes;
      },
    });

    expect(createId()).toBe("00010203-0405-4607-8809-0a0b0c0d0e0f");
  });

  it("still creates unique UUID-shaped values without Web Crypto", () => {
    vi.stubGlobal("crypto", undefined);

    const first = createId();
    const second = createId();
    expect(first).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    expect(second).not.toBe(first);
  });
});
