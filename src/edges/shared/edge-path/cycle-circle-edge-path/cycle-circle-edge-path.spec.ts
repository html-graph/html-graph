import { CycleCircleEdgePath } from "./cycle-circle-edge-path";

describe("CycleCircleEdgePath", () => {
  it("should create cycle circle path without arrows", () => {
    const edgePath = new CycleCircleEdgePath({
      sourceDirection: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 15 0 M 15 0 A 10 10 0 0 1 23.24621125123532 8 A 40 40 0 1 0 23.24621125123532 -8 A 10 10 0 0 1 15 0",
    );
  });

  it("should create cycle circle path with source arrow", () => {
    const edgePath = new CycleCircleEdgePath({
      sourceDirection: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 15 0 A 10 10 0 0 1 23.24621125123532 8 A 40 40 0 1 0 23.24621125123532 -8 A 10 10 0 0 1 15 0",
    );
  });

  it("should create cycle circle path with target arrow", () => {
    const edgePath = new CycleCircleEdgePath({
      sourceDirection: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 15 0 A 10 10 0 0 1 23.24621125123532 8 A 40 40 0 1 0 23.24621125123532 -8 A 10 10 0 0 1 15 0",
    );
  });

  it("should calculate median in between detour points", () => {
    const edgePath = new CycleCircleEdgePath({
      sourceDirection: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    const x = 15 + 40 + Math.sqrt(50 * 50 - 10 * 10);

    expect(edgePath.median).toEqual({ x, y: 0 });
  });
});
