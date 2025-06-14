import { createBezierLinePath } from "./create-bezier-line-path";

describe("createBezierLinePath", () => {
  it("should create bezier line path without arrows", () => {
    const path = createBezierLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(path).toBe(
      "M 0 0 L 15 0 M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200",
    );
  });

  it("should create bezier line path with source arrow", () => {
    const path = createBezierLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path).toBe("M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200");
  });

  it("should create bezier line path with target arrow", () => {
    const path = createBezierLinePath({
      to: { x: 100, y: 200 },
      fromVector: { x: 1, y: 0 },
      toVector: { x: 1, y: 0 },
      arrowLength: 15,
      curvature: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(path).toBe("M 15 0 C 115 0, -15 200, 85 200 M 85 200 L 100 200");
  });
});
