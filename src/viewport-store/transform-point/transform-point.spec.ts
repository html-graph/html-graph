import { Point } from "@/point";
import { TransformState } from "@/viewport-store";
import { transformPoint } from "./transform-point";

describe("transformPoint", () => {
  it("should shift point", () => {
    const point: Point = { x: 1, y: 1 };

    const matrix: TransformState = { scale: 1, x: 2, y: 3 };

    const result: Point = transformPoint(matrix, point);

    expect(result).toEqual({ x: 3, y: 4 });
  });

  it("should scale point", () => {
    const point: Point = { x: 1, y: 2 };

    const matrix: TransformState = { scale: 2, x: 0, y: 0 };

    const result: Point = transformPoint(matrix, point);

    expect(result).toEqual({ x: 2, y: 4 });
  });
});
