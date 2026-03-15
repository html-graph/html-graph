import { DetourVerticalEdgePath } from "./detour-vertical-edge-path";

describe("DetourVerticalEdgePath", () => {
  it("should create detour vertical path without flip Y", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
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
      "M 100 100 L 110 100 C 120 100 120 100 130 100 L 390 100 C 400 100 400 100 400 110 L 400 290 C 400 300 400 300 390 300 L 190 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path accounting for negative detour distance", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: -100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 110 100 L -90 100 C -100 100 -100 100 -100 110 L -100 290 C -100 300 -100 300 -90 300 L 170 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path with flip Y", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
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
      "M 100 100 L 110 100 C 120 100 120 100 130 100 L 390 100 C 400 100 400 100 400 110 L 400 290 C 400 300 400 300 390 300 L 190 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path with source arrow", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
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
      "M 110 100 L 110 100 C 120 100 120 100 130 100 L 390 100 C 400 100 400 100 400 110 L 400 290 C 400 300 400 300 390 300 L 190 300 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour vertical path with target arrow", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
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
      "M 100 100 L 110 100 C 120 100 120 100 130 100 L 390 100 C 400 100 400 100 400 110 L 400 290 C 400 300 400 300 390 300 L 190 300 C 180 300 180 300 190 300 L 190 300",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourVerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
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

    expect(edgePath.midpoint).toEqual({ x: 400, y: 200 });
  });
});
