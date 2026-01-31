import { resolveTransformationMatrix } from "./resolve-transformation-matrix";

describe("resolveTransformMatrix", () => {
  it("should resolve idempotent matrix when no parameters provided", () => {
    expect(resolveTransformationMatrix({})).toEqual({
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      e: 1,
      f: 0,
    });
  });

  it("should resolve specified matrix", () => {
    expect(
      resolveTransformationMatrix({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
      }),
    ).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
  });

  it("should resolve scale matrix", () => {
    expect(
      resolveTransformationMatrix({
        scale: 2,
      }),
    ).toEqual({ a: 2, b: 0, c: 0, d: 0, e: 2, f: 0 });
  });

  it("should account for scale center", () => {
    expect(
      resolveTransformationMatrix({
        scale: 2,
        center: { x: 1, y: 1 },
      }),
    ).toEqual({ a: 2, b: 0, c: 1, d: 0, e: 2, f: 1 });
  });
});
