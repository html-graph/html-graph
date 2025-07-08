import { StraightEdgePath } from "./straight-edge-path";

describe("StraightEdgePath", () => {
  it("should create straight line path without arrows", () => {
    const path = new StraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 22.873478855663453 9.578262852211514 L 77.12652114433655 190.4217371477885 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create straight line path with source arrow", () => {
    const path = new StraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path.getPath()).toBe(
      "M 15 0 L 15 0 C 20 0 20 0 22.873478855663453 9.578262852211514 L 77.12652114433655 190.4217371477885 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create straight line path with target arrow", () => {
    const path = new StraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(path.getPath()).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 22.873478855663453 9.578262852211514 L 77.12652114433655 190.4217371477885 C 80 200 80 200 85 200 L 85 200",
    );
  });
});
