import { Point } from "@/point";
import { flipPoint } from "./flip-point";

describe("flipPoint", () => {
  it("should return same point when no flip needed", () => {
    const point: Point = { x: 70, y: 110 };
    const to: Point = { x: 100, y: 200 };

    const result = flipPoint(point, 1, 1, to);

    expect(result).toEqual({ x: 70, y: 110 });
  });

  it("should flip point x coordinate", () => {
    const point: Point = { x: 70, y: 110 };
    const to: Point = { x: 100, y: 200 };

    const result = flipPoint(point, -1, 1, to);

    expect(result).toEqual({ x: 30, y: 110 });
  });

  it("should flip point y coordinate", () => {
    const point: Point = { x: 70, y: 110 };
    const to: Point = { x: 100, y: 200 };

    const result = flipPoint(point, 1, -1, to);

    expect(result).toEqual({ x: 70, y: 90 });
  });
});
