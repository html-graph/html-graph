import { describe, expect, it } from "vitest";
import { createVerticalLinePoints } from "./create-vertical-line";

describe("createVerticalLinePoints", () => {
  it("should create vertical line points", () => {
    const linePoints = createVerticalLinePoints(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 0, y: 10 },
        dir: { x: 0, y: 1 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 90 },
        dir: { x: 0, y: 1 },
      },
    );

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 50 },
      { x: 100, y: 50 },
      { x: 100, y: 100 },
    ]);
  });
});
