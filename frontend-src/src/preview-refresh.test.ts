import { describe, expect, it } from "vitest";
import { dependenciesChanged } from "./preview-refresh";
import type { PreviewDependencies } from "./types";

const none: PreviewDependencies = {
  entities: [],
  domains: [],
  allStates: false,
  usesTime: false,
};
const state = (value: string) => ({ state: value });

describe("dependenciesChanged", () => {
  it("reacts to a state the expressions read", () => {
    const before = { "sensor.t": state("1"), "sensor.other": state("1") };
    const after = { ...before, "sensor.t": state("2") };

    expect(
      dependenciesChanged({ ...none, entities: ["sensor.t"] }, before, after)
    ).toBe(true);
  });

  it("ignores a state nothing reads", () => {
    const before = { "sensor.t": state("1"), "sensor.other": state("1") };
    const after = { ...before, "sensor.other": state("2") };

    expect(
      dependenciesChanged({ ...none, entities: ["sensor.t"] }, before, after)
    ).toBe(false);
  });

  it("ignores a new hass object whose states are the same", () => {
    const before = { "sensor.t": state("1") };

    expect(
      dependenciesChanged({ ...none, entities: ["sensor.t"] }, before, {
        ...before,
      })
    ).toBe(false);
  });

  it("reacts to any entity of a domain that is read as a whole", () => {
    const before = { "light.a": state("on") };
    const after = { ...before, "light.b": state("on") };

    expect(
      dependenciesChanged({ ...none, domains: ["light"] }, before, after)
    ).toBe(true);
    expect(
      dependenciesChanged({ ...none, domains: ["sensor"] }, before, after)
    ).toBe(false);
  });

  it("reacts to every change when all states are read", () => {
    const before = { "sensor.a": state("1") };

    expect(
      dependenciesChanged({ ...none, allStates: true }, before, {
        "sensor.a": state("2"),
      })
    ).toBe(true);
  });

  it("reacts to an entity that appears or disappears", () => {
    const deps = { ...none, entities: ["sensor.t"] };

    expect(dependenciesChanged(deps, {}, { "sensor.t": state("1") })).toBe(
      true
    );
    expect(dependenciesChanged(deps, { "sensor.t": state("1") }, {})).toBe(
      true
    );
  });
});
