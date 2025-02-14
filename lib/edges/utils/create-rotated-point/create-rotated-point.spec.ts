import { Point } from "@/point";
import { createRotatedPoint } from "./create-rotated-point";

describe("createRotatedPoint", () => {
  it("should rotate point", () => {
    const point: Point = { x: 2, y: 1 };
    const vector: Point = { x: 0, y: 1 };
    const center: Point = { x: 1, y: 0 };

    const res = createRotatedPoint(point, vector, center);

    expect(res).toEqual({ x: 0, y: 1 });
  });
});
