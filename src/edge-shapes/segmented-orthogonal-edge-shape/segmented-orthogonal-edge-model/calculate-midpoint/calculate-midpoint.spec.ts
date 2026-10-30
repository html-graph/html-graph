import { describe, expect, it } from "vitest";
import { calculateMidpoint } from "./calculate-midpoint";

describe("calculateMidpoint", () => {
  it("should calculate midpoint for single part", () => {
    const midpoint = calculateMidpoint([
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ]);

    expect(midpoint).toEqual({ x: 50, y: 50 });
  });

  it("should calculate midpoint for two parts", () => {
    const midpoint = calculateMidpoint([
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ]);

    expect(midpoint).toEqual({ x: 0, y: 100 });
  });

  it("should return specified point when path has single point", () => {
    const midpoint = calculateMidpoint([{ x: 0, y: 0 }]);

    expect(midpoint).toEqual({ x: 0, y: 0 });
  });

  it("should handle zero length segments", () => {
    const midpoint = calculateMidpoint([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]);

    expect(midpoint).toEqual({ x: 0, y: 0 });
  });

  it("should throw error when 0 points specified", () => {
    expect(() => {
      calculateMidpoint([]);
    }).toThrow();
  });
});
