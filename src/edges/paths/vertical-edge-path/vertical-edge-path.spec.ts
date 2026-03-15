import { VerticalEdgePath } from "./vertical-edge-path";

describe("VerticalEdgePath", () => {
  it("should create vertical line path without arrows", () => {
    const edgePath = new VerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 100 100 C 110 100 110 100 110 110 L 110 190 C 110 200 110 200 120 200 L 140 200 C 150 200 150 200 150 190 L 150 110 C 150 100 150 100 160 100 L 180 100 C 190 100 190 100 190 110 L 190 290 C 190 300 190 300 200 300 L 200 300",
    );
  });

  it("should create vertical line path with source arrow", () => {
    const edgePath = new VerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 115 100 L 115 100 C 110 100 110 100 110 110 L 110 190 C 110 200 110 200 120 200 L 140 200 C 150 200 150 200 150 190 L 150 110 C 150 100 150 100 160 100 L 180 100 C 190 100 190 100 190 110 L 190 290 C 190 300 190 300 200 300 L 200 300",
    );
  });

  it("should create vertical line path with target arrow", () => {
    const edgePath = new VerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 100 100 C 110 100 110 100 110 110 L 110 190 C 110 200 110 200 120 200 L 140 200 C 150 200 150 200 150 190 L 150 110 C 150 100 150 100 160 100 L 180 100 C 190 100 190 100 190 110 L 190 290 C 190 300 190 300 185 300 L 185 300",
    );
  });

  it("should calculate midpoint in the center", () => {
    const edgePath = new VerticalEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 15,
      arrowOffset: 5,
      roundness: 10,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 150, y: 200 });
  });
});
