import { createCycleCirclePath } from "./create-cycle-circle-path";

describe("createCycleCirclePath", () => {
  it("should create cycle circle path without arrows", () => {
    const path = createCycleCirclePath({
      fromVector: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 0 0 L 15 0 M 15 0 A 10 10 0 0 1 23.24621125123532 8 A 40 40 0 1 0 23.24621125123532 -8 A 10 10 0 0 1 15 0",
    );
  });

  it("should create cycle circle path with source arrow", () => {
    const path = createCycleCirclePath({
      fromVector: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 15 0 A 10 10 0 0 1 23.24621125123532 8 A 40 40 0 1 0 23.24621125123532 -8 A 10 10 0 0 1 15 0",
    );
  });

  it("should create cycle circle path with target arrow", () => {
    const path = createCycleCirclePath({
      fromVector: { x: 1, y: 0 },
      radius: 40,
      smallRadius: 10,
      arrowLength: 15,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(path).toBe(
      "M 15 0 A 10 10 0 0 1 23.24621125123532 8 A 40 40 0 1 0 23.24621125123532 -8 A 10 10 0 0 1 15 0",
    );
  });
});
