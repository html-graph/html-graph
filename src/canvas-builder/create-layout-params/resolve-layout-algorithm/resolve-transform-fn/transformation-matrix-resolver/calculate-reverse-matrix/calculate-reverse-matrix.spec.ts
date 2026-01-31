import { calculateReverseMartix } from "./calculate-reverse-matrix";

describe("calculateReverseMatrix", () => {
  it("should calculate reverse matrix", () => {
    const result = calculateReverseMartix({
      a: 2,
      b: 0,
      c: 2,
      d: 0,
      e: 2,
      f: 2,
    });

    expect(result.a).toBeCloseTo(0.5);
    expect(result.b).toBeCloseTo(0);
    expect(result.c).toBeCloseTo(-1);
    expect(result.d).toBeCloseTo(0);
    expect(result.e).toBeCloseTo(0.5);
    expect(result.f).toBeCloseTo(-1);
  });
});
