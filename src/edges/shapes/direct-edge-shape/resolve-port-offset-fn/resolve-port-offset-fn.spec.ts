import { Point } from "@/point";
import { resolvePortOffsetFn } from "./resolve-port-offset-fn";
import { Dimensions } from "@/dimensions";

describe("resolvePortOffsetFn", () => {
  it("should resolve number offset function", () => {
    const fn = resolvePortOffsetFn(10);
    const direction: Point = { x: 0, y: 1 };
    const dimensions: Dimensions = { width: 100, height: 100 };

    expect(fn(direction, dimensions)).toBe(10);
  });

  it("should resolve specified offset function", () => {
    const fn = resolvePortOffsetFn(() => 20);
    const direction: Point = { x: 0, y: 1 };
    const dimensions: Dimensions = { width: 100, height: 100 };

    expect(fn(direction, dimensions)).toBe(20);
  });
});
