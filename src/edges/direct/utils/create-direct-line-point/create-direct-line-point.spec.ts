import { Point, zero } from "@/point";
import { createDirectLinePoint } from "./create-direct-line-point";

describe("createDirectLinePoint", () => {
  it("should create arrow begin point", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const point = createDirectLinePoint({
      diagonalDistance: diagonalDistance,
      to,
      offset: 0,
      hasArrow: false,
      flip: 1,
      shift: zero,
      arrowLength: 0,
    });

    expect(point).toEqual({ x: 0, y: 0 });
  });

  it("should consider specified offset when creating begin point", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const point = createDirectLinePoint({
      diagonalDistance: diagonalDistance,
      to,
      offset: 1,
      hasArrow: false,
      flip: 1,
      shift: zero,
      arrowLength: 0,
    });

    expect(point).toEqual({ x: 1, y: 0 });
  });

  it("should consider arrow offset when has arrow", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const point = createDirectLinePoint({
      diagonalDistance: diagonalDistance,
      to,
      offset: 0,
      hasArrow: true,
      flip: 1,
      shift: zero,
      arrowLength: 2,
    });

    expect(point).toEqual({ x: 2, y: 0 });
  });

  it("should flip point", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const point = createDirectLinePoint({
      diagonalDistance: diagonalDistance,
      to,
      offset: 2,
      hasArrow: true,
      flip: -1,
      shift: zero,
      arrowLength: 0,
    });

    expect(point).toEqual({ x: -2, y: 0 });
  });

  it("should shift point", () => {
    const to: Point = { x: 10, y: 0 };
    const diagonalDistance = Math.sqrt(to.x * to.x + to.y * to.y);

    const point = createDirectLinePoint({
      diagonalDistance: diagonalDistance,
      to,
      offset: 0,
      hasArrow: false,
      flip: 1,
      shift: { x: 2, y: 3 },
      arrowLength: 0,
    });

    expect(point).toEqual({ x: 2, y: 3 });
  });
});
