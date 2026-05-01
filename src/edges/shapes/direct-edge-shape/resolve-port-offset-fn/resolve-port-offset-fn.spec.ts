import { Point } from "@/point";
import { resolvePortOffsetFn } from "./resolve-port-offset-fn";
import { Radius } from "@/radius";

describe("resolvePortOffsetFn", () => {
  it("should resolve number offset function", () => {
    const fn = resolvePortOffsetFn(10);
    const direction: Point = { x: 0, y: 1 };
    const radius: Radius = { horizontal: 100, vertical: 100 };

    expect(fn({ direction, radius })).toBe(10);
  });

  it("should resolve specified offset function", () => {
    const fn = resolvePortOffsetFn(() => 20);
    const direction: Point = { x: 0, y: 1 };
    const radius: Radius = { horizontal: 100, vertical: 100 };

    expect(fn({ direction, radius })).toBe(20);
  });
});
