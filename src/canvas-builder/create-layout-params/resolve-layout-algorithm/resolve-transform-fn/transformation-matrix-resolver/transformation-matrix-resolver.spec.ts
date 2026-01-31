import { TransformationMatrixResolver } from "./transformation-matrix-resolver";

describe("TransformationMatrixResolver", () => {
  it("should resolve idempotent matrix when no parameters provided", () => {
    const resolver = new TransformationMatrixResolver();

    expect(resolver.resolve({})).toEqual({
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      e: 1,
      f: 0,
    });
  });

  it("should resolve specified matrix", () => {
    const resolver = new TransformationMatrixResolver();

    expect(
      resolver.resolve({
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
    const resolver = new TransformationMatrixResolver();

    expect(
      resolver.resolve({
        scale: 2,
      }),
    ).toEqual({ a: 2, b: 0, c: 0, d: 0, e: 2, f: 0 });
  });

  it("should account for scale center", () => {
    const resolver = new TransformationMatrixResolver();

    expect(
      resolver.resolve({
        scale: 2,
        center: { x: 1, y: 1 },
      }),
    ).toEqual({ a: 2, b: 0, c: 1, d: 0, e: 2, f: 1 });
  });

  it("should resolve rotate", () => {
    const resolver = new TransformationMatrixResolver();

    const result = resolver.resolve({
      rotate: Math.PI / 2,
    });

    expect(result.a).toBeCloseTo(0);
    expect(result.b).toBeCloseTo(-1);
    expect(result.c).toBeCloseTo(0);
    expect(result.d).toBeCloseTo(1);
    expect(result.e).toBeCloseTo(0);
    expect(result.f).toBeCloseTo(0);
  });

  it("should account for rotate center", () => {
    const resolver = new TransformationMatrixResolver();

    const result = resolver.resolve({
      rotate: Math.PI / 2,
      center: {
        x: 1,
        y: 1,
      },
    });

    expect(result.a).toBeCloseTo(0);
    expect(result.b).toBeCloseTo(-1);
    expect(result.c).toBeCloseTo(-2);
    expect(result.d).toBeCloseTo(1);
    expect(result.e).toBeCloseTo(0);
    expect(result.f).toBeCloseTo(0);
  });
});
