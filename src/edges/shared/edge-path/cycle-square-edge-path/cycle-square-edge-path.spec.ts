import { CycleSquareEdgePath } from "./cycle-square-edge-path";

describe("CycleSquareEdgePath", () => {
  it("should create cycle square path without arrows", () => {
    const edgePath = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 15 0 M 15 0 L 15 0 C 20 0 20 0 20 10 L 20 30 C 20 40 20 40 30 40 L 90 40 C 100 40 100 40 100 30 L 100 -30 C 100 -40 100 -40 90 -40 L 30 -40 C 20 -40 20 -40 20 -30 L 20 -10 C 20 0 20 0 15 0 L 15 0",
    );
  });

  it("should create cycle square path with source arrow", () => {
    const edgePath = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 15 0 L 15 0 C 20 0 20 0 20 10 L 20 30 C 20 40 20 40 30 40 L 90 40 C 100 40 100 40 100 30 L 100 -30 C 100 -40 100 -40 90 -40 L 30 -40 C 20 -40 20 -40 20 -30 L 20 -10 C 20 0 20 0 15 0 L 15 0",
    );
  });

  it("should create cycle square path with target arrow", () => {
    const edgePath = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 15 0 L 15 0 C 20 0 20 0 20 10 L 20 30 C 20 40 20 40 30 40 L 90 40 C 100 40 100 40 100 30 L 100 -30 C 100 -40 100 -40 90 -40 L 30 -40 C 20 -40 20 -40 20 -30 L 20 -10 C 20 0 20 0 15 0 L 15 0",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 100, y: 0 });
  });
});
