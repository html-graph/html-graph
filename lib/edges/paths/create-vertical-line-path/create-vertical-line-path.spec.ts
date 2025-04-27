import { createVerticalLinePath } from "./create-vertical-line-path";

describe("createVerticalLinePath", () => {
  it("should create vertical line path without arrows", () => {
    const path = createVerticalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipY: 1,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 0 0 L 0 0 C 10 0 10 0 10 10 L 10 90 C 10 100 10 100 20 100 L 40 100 C 50 100 50 100 50 100 L 50 100 C 50 100 50 100 60 100 L 80 100 C 90 100 90 100 90 110 L 90 190 C 90 200 90 200 100 200 L 100 200",
    );
  });

  it("should create fliped vertical line path without arrows", () => {
    const path = createVerticalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipY: -1,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 0 0 L 0 0 C 10 0 10 0 10 -10 L 10 -10 C 10 -20 10 -20 20 -20 L 40 -20 C 50 -20 50 -20 50 -10 L 50 210 C 50 220 50 220 60 220 L 80 220 C 90 220 90 220 90 210 L 90 210 C 90 200 90 200 100 200 L 100 200",
    );
  });

  it("should create vertical line path with source arrow", () => {
    const path = createVerticalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipY: 1,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 15 0 L 15 0 C 10 0 10 0 10 10 L 10 90 C 10 100 10 100 20 100 L 40 100 C 50 100 50 100 50 100 L 50 100 C 50 100 50 100 60 100 L 80 100 C 90 100 90 100 90 110 L 90 190 C 90 200 90 200 100 200 L 100 200",
    );
  });

  it("should create vertical line path with target arrow", () => {
    const path = createVerticalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipY: 1,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(path).toBe(
      "M 0 0 L 0 0 C 10 0 10 0 10 10 L 10 90 C 10 100 10 100 20 100 L 40 100 C 50 100 50 100 50 100 L 50 100 C 50 100 50 100 60 100 L 80 100 C 90 100 90 100 90 110 L 90 190 C 90 200 90 200 85 200 L 85 200",
    );
  });
});
