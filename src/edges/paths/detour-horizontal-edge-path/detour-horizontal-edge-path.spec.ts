import { DetourHorizontalEdgePath } from "./detour-horizontal-edge-path";

describe("DetourHorizontalEdgePath", () => {
  it("should create detour horizontal path without flip Y", () => {
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
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 490 C 120 500 120 500 130 500 L 170 500 C 180 500 180 500 180 490 L 180 310 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour horizontal path accounting for negative detour distance", () => {
    const edgePath = new DetourHorizontalEdgePath({
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
      "M 100 100 L 110 100 C 120 100 120 100 120 90 L 120 -90 C 120 -100 120 -100 130 -100 L 170 -100 C 180 -100 180 -100 180 -90 L 180 290 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour horizontal path with flip Y", () => {
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
      "M 100 100 L 110 100 C 120 100 120 100 120 90 L 120 -90 C 120 -100 120 -100 130 -100 L 170 -100 C 180 -100 180 -100 180 -90 L 180 290 C 180 300 180 300 190 300 L 200 300",
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
      "M 110 100 L 110 100 C 120 100 120 100 120 110 L 120 490 C 120 500 120 500 130 500 L 170 500 C 180 500 180 500 180 490 L 180 310 C 180 300 180 300 190 300 L 200 300",
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
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 490 C 120 500 120 500 130 500 L 170 500 C 180 500 180 500 180 490 L 180 310 C 180 300 180 300 190 300 L 190 300",
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

    expect(edgePath.midpoint).toEqual({ x: 150, y: 500 });
  });
});
