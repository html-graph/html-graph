import { Point } from "@/point";
import { describe, expect, it } from "vitest";
import { calculateContainingRectangle } from "./calculate-containing-rectangle";

describe("calculateContainingRectangle", () => {
  it("should calculate rectangle for two points", () => {
    const contains: readonly Point[] = [
      { x: 100, y: 100 },
      { x: 200, y: 200 },
    ];

    const result = calculateContainingRectangle(contains);

    expect(result).toEqual({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 200 },
    });
  });

  it("should calculate rectangle for three points", () => {
    const contains: readonly Point[] = [
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 300, y: 100 },
    ];

    const result = calculateContainingRectangle(contains);

    expect(result).toEqual({
      from: { x: 100, y: 100 },
      to: { x: 300, y: 200 },
    });
  });
});
