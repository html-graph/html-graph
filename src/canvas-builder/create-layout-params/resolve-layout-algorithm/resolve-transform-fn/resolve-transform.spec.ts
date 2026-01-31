import { Point } from "@/point";
import { resolveTransformFn } from "./resolve-transform";

describe("resolveTransformFn", () => {
  it("should resolve specified transform function", () => {
    const transformFn = (point: Point): Point => point;

    const result = resolveTransformFn(transformFn);

    expect(result).toBe(transformFn);
  });

  it("should resolve invariant transform when no transformations are provided", () => {
    const transform = resolveTransformFn([]);

    expect(transform({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
  });

  it("should resolve specified transform", () => {
    const transform = resolveTransformFn({
      a: 2,
      b: 0,
      c: 1,
      d: 0,
      e: 2,
      f: 1,
    });

    expect(transform({ x: 1, y: 2 })).toEqual({ x: 3, y: 5 });
  });
});
