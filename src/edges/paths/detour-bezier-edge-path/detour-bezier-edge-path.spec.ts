import { DetourBezierEdgePath } from "./detour-bezier-edge-path";

describe("DetourBezierEdgePath", () => {
  it("should create detour bezier path", () => {
    const edgePath = new DetourBezierEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 210 100 110 0 150 100 C 190 200 90 300 190 300 L 200 300",
    );
  });

  it("should create detour bezier path with source arrow", () => {
    const edgePath = new DetourBezierEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 110 100 L 110 100 C 210 100 110 0 150 100 C 190 200 90 300 190 300 L 200 300",
    );
  });

  it("should create detour bezier path with target arrow", () => {
    const edgePath = new DetourBezierEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 210 100 110 0 150 100 C 190 200 90 300 190 300 L 190 300",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourBezierEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 150, y: 100 });
  });
});
