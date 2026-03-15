import { CycleCircleEdgePath } from "./cycle-circle-edge-path";

describe("CycleCircleEdgePath", () => {
  it("should create cycle circle path without arrows", () => {
    const edgePath = new CycleCircleEdgePath({
      origin: { x: 100, y: 100 },
      dir: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 115 100 M 115 100 A 10 10 0 0 1 124.79795897113272 108 A 40 40 0 1 0 124.79795897113272 92 A 10 10 0 0 1 115 100",
    );
  });

  it("should create cycle circle path with arrow", () => {
    const edgePath = new CycleCircleEdgePath({
      origin: { x: 100, y: 100 },
      dir: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 115 100 A 10 10 0 0 1 124.79795897113272 108 A 40 40 0 1 0 124.79795897113272 92 A 10 10 0 0 1 115 100",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new CycleCircleEdgePath({
      origin: { x: 100, y: 100 },
      dir: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasArrow: false,
    });

    const x = 15 + 40 + Math.sqrt(50 * 50 - 10 * 10) + 100;

    expect(edgePath.midpoint).toEqual({ x, y: 100 });
  });
});
