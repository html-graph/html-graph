import { HorizontalEdgePath } from "./horizontal-edge-path";

describe("HorizontalEdgePath", () => {
  it("should create horizontal line path without arrows", () => {
    const edgePath = new HorizontalEdgePath({
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
      "M 100 100 L 140 100 C 150 100 150 100 150 110 L 150 290 C 150 300 150 300 160 300 L 200 300",
    );
  });

  it("should create horizontal line path with source arrow", () => {
    const edgePath = new HorizontalEdgePath({
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
      "M 115 100 L 140 100 C 150 100 150 100 150 110 L 150 290 C 150 300 150 300 160 300 L 200 300",
    );
  });

  it("should create horizontal line path with target arrow", () => {
    const edgePath = new HorizontalEdgePath({
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
      "M 100 100 L 140 100 C 150 100 150 100 150 110 L 150 290 C 150 300 150 300 160 300 L 185 300",
    );
  });

  it("should calculate midpoint in the center", () => {
    const edgePath = new HorizontalEdgePath({
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
