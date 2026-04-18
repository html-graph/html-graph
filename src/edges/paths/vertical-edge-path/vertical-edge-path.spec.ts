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
      "M 100 100 L 118.03883864861815 190.1941932430908 C 120 200 120 200 130 200 L 170 200 C 180 200 180 200 181.96116135138183 209.8058067569092 L 200 300",
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
      "M 115 100 L 119.50062383056108 190.01247661122156 C 120 200 120 200 130 200 L 170 200 C 180 200 180 200 181.96116135138183 209.8058067569092 L 200 300",
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
      "M 100 100 L 118.03883864861815 190.1941932430908 C 120 200 120 200 130 200 L 170 200 C 180 200 180 200 180.49937616943893 209.98752338877844 L 185 300",
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
