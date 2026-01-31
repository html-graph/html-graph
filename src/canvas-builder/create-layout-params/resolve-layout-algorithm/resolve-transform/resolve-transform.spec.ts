import { Point } from "@/point";
import { resolveTransform } from "./resolve-transform";

describe("resolveTransform", () => {
  it("should resolve specified transform function", () => {
    const transformFn = (point: Point): Point => point;

    const result = resolveTransform(transformFn);

    expect(result).toBe(transformFn);
  });

  it("should resolve scale function", () => {
    const transform = resolveTransform({ scale: 2 });

    expect(transform({ x: 1, y: 2 })).toEqual({ x: 2, y: 4 });
  });

  it("should resolve array of transformers", () => {
    const transform = resolveTransform([{ scale: 2 }]);

    expect(transform({ x: 1, y: 2 })).toEqual({ x: 2, y: 4 });
  });

  it("should resolve translate x function", () => {
    const transform = resolveTransform({ translateX: 2 });

    expect(transform({ x: 1, y: 2 })).toEqual({ x: 3, y: 2 });
  });

  it("should resolve translate x function", () => {
    const transform = resolveTransform({ translateY: 2 });

    expect(transform({ x: 1, y: 2 })).toEqual({ x: 1, y: 4 });
  });
});
