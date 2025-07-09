import { DetourBezierEdgePath } from "./detour-bezier-edge-path";

describe("DetourBezierEdgePath", () => {
  it("should create detour bezier path without flip", () => {
    const edgePath = new DetourBezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 110 0 10.000000000000005 -100 50 0 C 90 100 -10 200 90 200 L 100 200",
    );
  });

  it("should create detour bezier path with flip", () => {
    const edgePath = new DetourBezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: -1,
      flipY: -1,
      arrowLength: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 110 0 9.999999999999995 100 50 200 C 90 300 -10 200 90 200 L 100 200",
    );
  });

  it("should create detour bezier path with source arrow", () => {
    const edgePath = new DetourBezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 10 0 L 10 0 C 110 0 10.000000000000005 -100 50 0 C 90 100 -10 200 90 200 L 100 200",
    );
  });

  it("should create detour bezier path with target arrow", () => {
    const edgePath = new DetourBezierEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 110 0 10.000000000000005 -100 50 0 C 90 100 -10 200 90 200 L 90 200",
    );
  });
});
