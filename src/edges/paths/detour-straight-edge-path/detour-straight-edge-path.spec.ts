import { DetourStraightEdgePath } from "./detour-straight-edge-path";

describe("DetourStraightEdgePath", () => {
  it("should create detour straight path without flip", () => {
    const edgePath = new DetourStraightEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 120 90 L 120 10 C 120 0 120 0 122.87347885566345 9.578262852211514 L 177.12652114433655 190.4217371477885 C 180 200 180 200 180 210 L 180 290 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour straight path with flip", () => {
    const edgePath = new DetourStraightEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 120 110 L 120 190 C 120 200 120 200 122.87347885566345 209.5782628522115 L 177.12652114433655 390.42173714778846 C 180 400 180 400 180 390 L 180 310 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour straight path with source arrow", () => {
    const edgePath = new DetourStraightEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 110 100 L 110 100 C 120 100 120 100 120 90 L 120 10 C 120 0 120 0 122.87347885566345 9.578262852211514 L 177.12652114433655 190.4217371477885 C 180 200 180 200 180 210 L 180 290 C 180 300 180 300 190 300 L 200 300",
    );
  });

  it("should create detour straight path with target arrow", () => {
    const edgePath = new DetourStraightEdgePath({
      from: { x: 100, y: 100 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 100 100 L 110 100 C 120 100 120 100 120 90 L 120 10 C 120 0 120 0 122.87347885566345 9.578262852211514 L 177.12652114433655 190.4217371477885 C 180 200 180 200 180 210 L 180 290 C 180 300 180 300 190 300 L 190 300",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourStraightEdgePath({
      from: { x: 100, y: 200 },
      to: { x: 200, y: 300 },
      fromDir: { x: 1, y: 0 },
      toDir: { x: 1, y: 0 },
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDir: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 150, y: 150 });
  });
});
