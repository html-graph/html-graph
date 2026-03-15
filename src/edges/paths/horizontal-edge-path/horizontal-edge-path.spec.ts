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
      "M 100 100 L 100 100 C 110 100 110 100 120 100 L 140 100 C 150 100 150 100 150 110 L 150 190 C 150 200 150 200 140 200 L 60 200 C 50 200 50 200 50 210 L 50 290 C 50 300 50 300 60 300 L 180 300 C 190 300 190 300 200 300 L 200 300",
    );
  });

  it("should create flipped horizontal line path without arrows", () => {
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
      "M 100 100 L 100 100 C 110 100 110 100 100 100 L -10 100 C -20 100 -20 100 -20 110 L -20 190 C -20 200 -20 200 -10 200 L 210 200 C 220 200 220 200 220 210 L 220 290 C 220 300 220 300 210 300 L 200 300 C 190 300 190 300 200 300 L 200 300",
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
      "M 115 100 L 115 100 C 110 100 110 100 120 100 L 140 100 C 150 100 150 100 150 110 L 150 190 C 150 200 150 200 140 200 L 60 200 C 50 200 50 200 50 210 L 50 290 C 50 300 50 300 60 300 L 180 300 C 190 300 190 300 200 300 L 200 300",
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
      "M 100 100 L 100 100 C 110 100 110 100 120 100 L 140 100 C 150 100 150 100 150 110 L 150 190 C 150 200 150 200 140 200 L 60 200 C 50 200 50 200 50 210 L 50 290 C 50 300 50 300 60 300 L 180 300 C 190 300 190 300 185 300 L 185 300",
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
