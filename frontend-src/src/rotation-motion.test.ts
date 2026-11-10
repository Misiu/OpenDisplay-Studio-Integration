import { describe, expect, it } from "vitest";
import { shortestTurn, turnAngleAt } from "./rotation-motion";

describe("turnAngleAt", () => {
  it("starts where it was and ends where it is going", () => {
    expect(turnAngleAt(0, 90, 0)).toBe(0);
    expect(turnAngleAt(0, 90, 1)).toBe(90);
    expect(turnAngleAt(90, 0, 1)).toBe(0);
  });

  it("first leans back the other way", () => {
    expect(turnAngleAt(0, 90, 0.1)).toBeLessThan(0);
    expect(turnAngleAt(0, -90, 0.1)).toBeGreaterThan(0);
  });

  it("swings past the end and settles back", () => {
    const beyond = turnAngleAt(0, 90, 0.78);
    expect(beyond).toBeGreaterThan(90);

    expect(turnAngleAt(0, 90, 0.99)).toBeCloseTo(90, 0);
  });

  it("does not move when there is nowhere to go", () => {
    expect(turnAngleAt(90, 90, 0.5)).toBe(90);
  });

  it("never jumps from one moment to the next", () => {
    let previous = turnAngleAt(0, 90, 0);
    for (let step = 1; step <= 100; step += 1) {
      const angle = turnAngleAt(0, 90, step / 100);
      expect(Math.abs(angle - previous)).toBeLessThan(12);
      previous = angle;
    }
  });
});

describe("shortestTurn", () => {
  it("turns a quarter to either side", () => {
    expect(shortestTurn(0, 90)).toBe(90);
    expect(shortestTurn(0, 270)).toBe(-90);
  });

  it("keeps turning the same way past a full circle", () => {
    expect(shortestTurn(270, 0)).toBe(90);
    expect(shortestTurn(90, 0)).toBe(-90);
  });

  it("goes the same way for half a turn, whatever the angle", () => {
    expect(shortestTurn(0, 180)).toBe(180);
    expect(shortestTurn(90, 270)).toBe(180);
  });

  it("copes with an angle that has gone round many times", () => {
    expect(shortestTurn(720 + 90, 180)).toBe(90);
    expect(shortestTurn(-450, 0)).toBe(90);
  });
});
