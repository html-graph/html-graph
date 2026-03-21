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
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 190 C 120 200 120 200 130 200 L 170 200 C 180 200 180 200 180 210 L 180 290 C 180 300 180 300 190 300 L 200 300",
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
      "M 115 100 L 115 100 C 120 100 120 100 120 110 L 120 190 C 120 200 120 200 130 200 L 170 200 C 180 200 180 200 180 210 L 180 290 C 180 300 180 300 190 300 L 200 300",
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
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 190 C 120 200 120 200 130 200 L 170 200 C 180 200 180 200 180 210 L 180 290 C 180 300 180 300 185 300 L 185 300",
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
