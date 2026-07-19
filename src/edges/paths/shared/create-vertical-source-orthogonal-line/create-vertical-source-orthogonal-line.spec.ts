import { describe, expect, it } from "vitest";
import { createVerticalSourceOrthogonalLine } from "./create-vertical-source-orthogonal-line";

describe("createVerticalSourceOrthogonalLine", () => {
  it("should create orthogonal line points when source port is vertical", () => {
    const line = createVerticalSourceOrthogonalLine(
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

    expect(line.points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ]);
  });
});
