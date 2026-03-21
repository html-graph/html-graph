import { DetourHorizontalEdgePath } from "./detour-horizontal-edge-path";

describe("DetourHorizontalEdgePath", () => {
  it("should create detour horizontal path", () => {
    const edgePath = new DetourHorizontalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 390 C 120 400 120 400 130 400 L 170 400 C 180 400 180 400 180 390 L 180 310 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour horizontal path with source arrow", () => {
    const edgePath = new DetourHorizontalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 110 100 L 110 100 C 120 100 120 100 120 110 L 120 390 C 120 400 120 400 130 400 L 170 400 C 180 400 180 400 180 390 L 180 310 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour horizontal path with target arrow", () => {
    const edgePath = new DetourHorizontalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 390 C 120 400 120 400 130 400 L 170 400 C 180 400 180 400 180 390 L 180 310 C 180 300 180 300 190 300 L 190 300",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourHorizontalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 150, y: 400 });
  });
});
