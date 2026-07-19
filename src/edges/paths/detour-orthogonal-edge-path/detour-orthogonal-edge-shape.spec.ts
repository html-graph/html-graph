import { describe, expect, it } from "vitest";
import { DetourOrthogonalEdgePath } from "./detour-orthogonal-edge-shape";

describe("DetourOrthogonalEdgeShape", () => {
  it("should create detour horizontal path when both ports are horizontal", () => {
    const edgePath = new DetourOrthogonalEdgePath({
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

  it("should create detour vertical path when both ports are vertical", () => {
    const edgePath = new DetourOrthogonalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 0, y: 1 },
      toDir: { x: 0, y: 1 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 100 110 C 100 120 100 120 110 120 L 290 120 C 300 120 300 120 300 130 L 300 270 C 300 280 300 280 290 280 L 210 280 C 200 280 200 280 200 290 L 200 300",
    );
  });

  it("should create orthogonal path when ports are orthogonal", () => {
    const edgePath = new DetourOrthogonalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 0, y: 1 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 100 290 C 100 300 100 300 110 300 L 200 300",
    );
  });
});
