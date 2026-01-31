import { Matrix } from "../matrix";
import { multiplyTransformationMatrices } from "./multiply-transformation-matrices";

describe("multiplyTransformationMatrices", () => {
  it("should multiply correctly", () => {
    const m1: Matrix = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
    const m2: Matrix = { a: 7, b: 8, c: 9, d: 10, e: 11, f: 12 };

    const result = multiplyTransformationMatrices(m1, m2);

    expect(result).toEqual({ a: 27, b: 30, c: 36, d: 78, e: 87, f: 102 });
  });
});
