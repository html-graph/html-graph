import { DetourHorizontalEdgePath } from "./detour-horizontal-edge-path";

describe("DetourHorizontalEdgePath", () => {
  it("should create detour horizontal path without flip Y", () => {
    const edgePath = new DetourHorizontalEdgePath({
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
      "M 0 0 L 10 0 C 20 0 20 0 20 10 L 20 290 C 20 300 20 300 30 300 L 70 300 C 80 300 80 300 80 290 L 80 210 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour horizontal path accounting for negative detour distance", () => {
    const edgePath = new DetourHorizontalEdgePath({
      to: { x: 100, y: 200 },
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
      "M 0 0 L 10 0 C 20 0 20 0 20 -10 L 20 -90 C 20 -100 20 -100 30 -100 L 70 -100 C 80 -100 80 -100 80 -90 L 80 190 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour horizontal path with flip Y", () => {
    const edgePath = new DetourHorizontalEdgePath({
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
      "M 0 0 L 10 0 C 20 0 20 0 20 -10 L 20 -90 C 20 -100 20 -100 30 -100 L 70 -100 C 80 -100 80 -100 80 -90 L 80 190 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour horizontal path with source arrow", () => {
    const edgePath = new DetourHorizontalEdgePath({
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
      "M 10 0 L 10 0 C 20 0 20 0 20 10 L 20 290 C 20 300 20 300 30 300 L 70 300 C 80 300 80 300 80 290 L 80 210 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour horizontal path with target arrow", () => {
    const edgePath = new DetourHorizontalEdgePath({
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
      "M 0 0 L 10 0 C 20 0 20 0 20 10 L 20 290 C 20 300 20 300 30 300 L 70 300 C 80 300 80 300 80 290 L 80 210 C 80 200 80 200 90 200 L 90 200",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourHorizontalEdgePath({
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

    expect(edgePath.midpoint).toEqual({ x: 50, y: 300 });
  });
});
