import { describe, expect, it } from "vitest";
import { createVerticalSourceOrthogonalLinePoints } from "./create-vertical-source-orthogonal-line";

describe("createVerticalSourceOrthogonalLinePoints", () => {
  it("should create orthogonal line points", () => {
    const linePoints = createVerticalSourceOrthogonalLinePoints(
      {
        arrowPoint: { x: 0, y: 0 },
        linePoint: { x: 0, y: 10 },
        dir: { x: 0, y: 1 },
      },
      {
        arrowPoint: { x: 100, y: 100 },
        linePoint: { x: 100, y: 90 },
        dir: { x: 1, y: 0 },
      },
    );

    expect(linePoints).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ]);
  });
});
