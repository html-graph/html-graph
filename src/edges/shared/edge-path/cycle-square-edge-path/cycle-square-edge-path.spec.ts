import { CycleSquareEdgePath } from "./cycle-square-edge-path";

describe("CycleSquareEdgePath", () => {
  it("should create cycle square path without arrows", () => {
    const path = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 0 0 L 15 0 M 15 0 L 15 0 C 20 0 20 0 20 10 L 20 30 C 20 40 20 40 30 40 L 90 40 C 100 40 100 40 100 30 L 100 -30 C 100 -40 100 -40 90 -40 L 30 -40 C 20 -40 20 -40 20 -30 L 20 -10 C 20 0 20 0 15 0 L 15 0",
    );
  });

  it("should create cycle square path with source arrow", () => {
    const path = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 15 0 L 15 0 C 20 0 20 0 20 10 L 20 30 C 20 40 20 40 30 40 L 90 40 C 100 40 100 40 100 30 L 100 -30 C 100 -40 100 -40 90 -40 L 30 -40 C 20 -40 20 -40 20 -30 L 20 -10 C 20 0 20 0 15 0 L 15 0",
    );
  });

  it("should create cycle square path with target arrow", () => {
    const path = new CycleSquareEdgePath({
      sourceDirection: { x: 1, y: 0 },
      side: 40,
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(path.getPath()).toBe(
      "M 15 0 L 15 0 C 20 0 20 0 20 10 L 20 30 C 20 40 20 40 30 40 L 90 40 C 100 40 100 40 100 30 L 100 -30 C 100 -40 100 -40 90 -40 L 30 -40 C 20 -40 20 -40 20 -30 L 20 -10 C 20 0 20 0 15 0 L 15 0",
    );
  });
});
