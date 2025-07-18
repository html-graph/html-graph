import { BezierEdgePath } from "./bezier-edge-path";

describe("BezierEdgePath", () => {
  it("should create bezier line path without arrows", () => {
    const edgePath = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 15 0 M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should create bezier line path with source arrow", () => {
    const edgePath = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should create bezier line path with target arrow", () => {
    const edgePath = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should calculate midpoint in the center", () => {
    const edgePath = new BezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 50, y: 100 });
  });
});
