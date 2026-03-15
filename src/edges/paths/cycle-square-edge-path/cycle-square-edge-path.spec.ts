import { CycleSquareEdgePath } from "./cycle-square-edge-path";

describe("CycleSquareEdgePath", () => {
  it("should create cycle square path without arrows", () => {
    const edgePath = new CycleSquareEdgePath({
      origin: { x: 100, y: 100 },
      fromDir: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 115 100 M 115 100 L 115 100 C 120 100 120 100 120 110 L 120 130 C 120 140 120 140 130 140 L 190 140 C 200 140 200 140 200 130 L 200 70 C 200 60 200 60 190 60 L 130 60 C 120 60 120 60 120 70 L 120 90 C 120 100 120 100 115 100 L 115 100",
    );
  });

  it("should create cycle square path with source arrow", () => {
    const edgePath = new CycleSquareEdgePath({
      origin: { x: 100, y: 100 },
      fromDir: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 115 100 L 115 100 C 120 100 120 100 120 110 L 120 130 C 120 140 120 140 130 140 L 190 140 C 200 140 200 140 200 130 L 200 70 C 200 60 200 60 190 60 L 130 60 C 120 60 120 60 120 70 L 120 90 C 120 100 120 100 115 100 L 115 100",
    );
  });

  it("should create cycle square path with target arrow", () => {
    const edgePath = new CycleSquareEdgePath({
      origin: { x: 100, y: 100 },
      fromDir: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 115 100 L 115 100 C 120 100 120 100 120 110 L 120 130 C 120 140 120 140 130 140 L 190 140 C 200 140 200 140 200 130 L 200 70 C 200 60 200 60 190 60 L 130 60 C 120 60 120 60 120 70 L 120 90 C 120 100 120 100 115 100 L 115 100",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new CycleSquareEdgePath({
      origin: { x: 100, y: 100 },
      fromDir: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 200, y: 100 });
  });
});
