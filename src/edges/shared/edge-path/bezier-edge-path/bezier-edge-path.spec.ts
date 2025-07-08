import { BezierEdgePath } from "./bezier-edge-path";

describe("BezierEdgePath", () => {
  it("should create bezier line path without arrows", () => {
    const path = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 0 0 L 15 0 M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should create bezier line path with source arrow", () => {
    const path = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should create bezier line path with target arrow", () => {
    const path = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });
});
