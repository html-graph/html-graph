import { DetourStraightEdgePath } from "./detour-straight-edge-path";

describe("DetourStraightEdgePath", () => {
  it("should create detour straight path without flip", () => {
    const edgePath = new DetourStraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 20 -10 L 20.000000000000007 -90 C 20.000000000000007 -100 20.000000000000007 -100 22.87347885566346 -90.42173714778849 L 77.12652114433655 90.42173714778849 C 80 100 80 100 80 110 L 80 190 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour straight path with flip", () => {
    const edgePath = new DetourStraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: -1,
      flipY: -1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 20 10 L 19.999999999999993 90 C 19.999999999999993 100 19.999999999999993 100 22.873478855663446 109.57826285221151 L 77.12652114433655 290.42173714778846 C 80 300 80 300 80 290 L 80 210 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour straight path with source arrow", () => {
    const edgePath = new DetourStraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: true,
      hasTargetArrow: false,
    });

    expect(edgePath.path).toBe(
      "M 10 0 L 10 0 C 20 0 20 0 20 -10 L 20.000000000000007 -90 C 20.000000000000007 -100 20.000000000000007 -100 22.87347885566346 -90.42173714778849 L 77.12652114433655 90.42173714778849 C 80 100 80 100 80 110 L 80 190 C 80 200 80 200 90 200 L 100 200",
    );
  });

  it("should create detour straight path with target arrow", () => {
    const edgePath = new DetourStraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: true,
    });

    expect(edgePath.path).toBe(
      "M 0 0 L 10 0 C 20 0 20 0 20 -10 L 20.000000000000007 -90 C 20.000000000000007 -100 20.000000000000007 -100 22.87347885566346 -90.42173714778849 L 77.12652114433655 90.42173714778849 C 80 100 80 100 80 110 L 80 190 C 80 200 80 200 90 200 L 90 200",
    );
  });

  it("should calculate midpoint in between detour points", () => {
    const edgePath = new DetourStraightEdgePath({
      to: { x: 100, y: 200 },
      sourceDirection: { x: 1, y: 0 },
      targetDirection: { x: 1, y: 0 },
      flipX: 1,
      flipY: 1,
      arrowLength: 10,
      arrowOffset: 10,
      roundness: 10,
      detourDirection: -Math.PI / 2,
      detourDistance: 100,
      hasSourceArrow: false,
      hasTargetArrow: false,
    });

    expect(edgePath.midpoint).toEqual({ x: 50, y: 0 });
  });
});
