import { DetourVerticalEdgePath } from "./detour-vertical-edge-path";

describe("DetourVerticalEdgePath", () => {
  it("should create detour vertical path without flip Y", () => {
    const edgePath = new DetourVerticalEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 30 0 L 190 0 C 200 0 200 0 200 10 L 200 190 C 200 200 200 200 190 200 L 90 200 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour vertical path with flip Y", () => {
    const edgePath = new DetourVerticalEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: -1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 30 0 L 190 0 C 200 0 200 0 200 10 L 200 190 C 200 200 200 200 190 200 L 90 200 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour vertical path with source arrow", () => {
    const edgePath = new DetourVerticalEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 10 0 L 10 0 C 20 0 20 0 30 0 L 190 0 C 200 0 200 0 200 10 L 200 190 C 200 200 200 200 190 200 L 90 200 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour vertical path with target arrow", () => {
    const edgePath = new DetourVerticalEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 30 0 L 190 0 C 200 0 200 0 200 10 L 200 190 C 200 200 200 200 190 200 L 90 200 C 80 200 80 200 90 200 L 90 200",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourVerticalEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 200, y: 100 });
  });
});
