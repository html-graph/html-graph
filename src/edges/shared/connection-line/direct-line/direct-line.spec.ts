import { Point } from "@/point";
import { DirectLine } from "./direct-line";

describe("DirectLine", () => {
  it("should create line path", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const linePath = new DirectLine({
      diagonalDistance,
      to,
      sourceOffset: 0,
      targetOffset: 0,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowLength: 0,
    });

    expect(linePath.getPath()).toBe("M 0 0 L 10 0");
  });

  it("should consider source offset", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const linePath = new DirectLine({
      diagonalDistance,
      to,
      sourceOffset: 1,
      targetOffset: 0,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowLength: 0,
    });

    expect(linePath.getPath()).toBe("M 1 0 L 10 0");
  });

  it("should consider target offset", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const linePath = new DirectLine({
      diagonalDistance,
      to,
      sourceOffset: 0,
      targetOffset: 1,
      hasSourceArrow: false,
      hasTargetArrow: false,
      arrowLength: 0,
    });

    expect(linePath.getPath()).toBe("M 0 0 L 9 0");
  });

  it("should account for source arrow", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const linePath = new DirectLine({
      diagonalDistance,
      to,
      sourceOffset: 0,
      targetOffset: 0,
      hasSourceArrow: true,
      hasTargetArrow: false,
      arrowLength: 1,
    });

    expect(linePath.getPath()).toBe("M 1 0 L 10 0");
  });

  it("should account for target arrow", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const linePath = new DirectLine({
      diagonalDistance,
      to,
      sourceOffset: 0,
      targetOffset: 0,
      hasSourceArrow: false,
      hasTargetArrow: true,
      arrowLength: 1,
    });

    expect(linePath.getPath()).toBe("M 0 0 L 9 0");
  });
});
