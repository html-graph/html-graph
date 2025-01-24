import { TransformState } from "../transform-state";
import { calculateReverseMatrix } from "./calculate-reverse-matrix";

describe("createReverseMatrix", () => {
  it("should return inversed scale", () => {
    const matrix: TransformState = { scale: 2, dx: 0, dy: 0 };

    const reverse: TransformState = calculateReverseMatrix(matrix);

    expect(reverse.scale).toBe(1 / 2);
  });

  it("should return inversed dx", () => {
    const matrix: TransformState = { scale: 2, dx: 2, dy: 0 };

    const reverse: TransformState = calculateReverseMatrix(matrix);

    expect(reverse.dx).toBe(-1);
  });

  it("should return inversed dy", () => {
    const matrix: TransformState = { scale: 2, dx: 0, dy: 2 };

    const reverse: TransformState = calculateReverseMatrix(matrix);

    expect(reverse.dy).toBe(-1);
  });
});
