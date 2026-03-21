import { DetourVerticalEdgePath } from "./detour-vertical-edge-path";

describe("DetourVerticalEdgePath", () => {
  it("should create detour vertical path", () => {
    const edgePath = new DetourVerticalEdgePath({
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
      "M 100 100 L 110 100 C 120 100 120 100 130 100 L 270 100 C 280 100 280 100 280 110 L 280 290 C 280 300 280 300 270 300 L 190 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path accounting for negative detour distance", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: -100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 110 100 L 30 100 C 20 100 20 100 20 110 L 20 290 C 20 300 20 300 30 300 L 170 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path with source arrow", () => {
    const edgePath = new DetourVerticalEdgePath({
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
      "M 110 100 L 110 100 C 120 100 120 100 130 100 L 270 100 C 280 100 280 100 280 110 L 280 290 C 280 300 280 300 270 300 L 190 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path with target arrow", () => {
    const edgePath = new DetourVerticalEdgePath({
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
      "M 100 100 L 110 100 C 120 100 120 100 130 100 L 270 100 C 280 100 280 100 280 110 L 280 290 C 280 300 280 300 270 300 L 190 300 C 180 300 180 300 190 300 L 190 300",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourVerticalEdgePath({
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

    expect(edgePath.midpoint).toEqual({ x: 280, y: 200 });
  });
});
