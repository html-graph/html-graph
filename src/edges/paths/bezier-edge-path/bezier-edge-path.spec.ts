import { BezierEdgePath } from "./bezier-edge-path";

describe("BezierEdgePath", () => {
  it("should create bezier line path without arrows", () => {
    const edgePath = new BezierEdgePath({
      from: { x: -100, y: -200 },
      to: { x: 100, y: 200 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M -100 -200 L -85 -200 M -85 -200 C 15 -200, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should create bezier line path with source arrow", () => {
    const edgePath = new BezierEdgePath({
      from: { x: -100, y: 200 },
      to: { x: 100, y: -200 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M -85 200 C 15 200, -15 -200, 85 -200 M 85 -200 L 100 -200",
    );
  });

  it("should create bezier line path with target arrow", () => {
    const edgePath = new BezierEdgePath({
      from: { x: -100, y: -200 },
      to: { x: 100, y: 200 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M -85 -200 C 15 -200, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should calculate midpoint in the center", () => {
    const edgePath = new BezierEdgePath({
      from: { x: -100, y: -200 },
      to: { x: 100, y: 200 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 0, y: 0 });
  });
});
