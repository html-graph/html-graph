import { createHorizontalLinePath } from "./create-horizontal-line-path";

describe("createHorizontalLinePath", () => {
  it("should create horizontal line path without arrows", () => {
    const path = createHorizontalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipX: 1,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 0 0 L 0 0 C 10 0 10 0 20 0 L 40 0 C 50 0 50 0 50 10 L 50 90 C 50 100 50 100 50 100 L 50 100 C 50 100 50 100 50 110 L 50 190 C 50 200 50 200 60 200 L 80 200 C 90 200 90 200 100 200 L 100 200",
    );
  });

  it("should create flipped horizontal line path without arrows", () => {
    const path = createHorizontalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipX: -1,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 0 0 L 0 0 C 10 0 10 0 0 0 L -10 0 C -20 0 -20 0 -20 10 L -20 90 C -20 100 -20 100 -10 100 L 110 100 C 120 100 120 100 120 110 L 120 190 C 120 200 120 200 110 200 L 100 200 C 90 200 90 200 100 200 L 100 200",
    );
  });

  it("should create horizontal line path with source arrow", () => {
    const path = createHorizontalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipX: 1,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 15 0 L 15 0 C 10 0 10 0 20 0 L 40 0 C 50 0 50 0 50 10 L 50 90 C 50 100 50 100 50 100 L 50 100 C 50 100 50 100 50 110 L 50 190 C 50 200 50 200 60 200 L 80 200 C 90 200 90 200 100 200 L 100 200",
    );
  });

  it("should create horizontal line path with target arrow", () => {
    const path = createHorizontalLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      flipX: 1,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(path).toBe(
      "M 0 0 L 0 0 C 10 0 10 0 20 0 L 40 0 C 50 0 50 0 50 10 L 50 90 C 50 100 50 100 50 100 L 50 100 C 50 100 50 100 50 110 L 50 190 C 50 200 50 200 60 200 L 80 200 C 90 200 90 200 85 200 L 85 200",
    );
  });
});
