import { TransformState } from "../transform-state";
import { calculateReverseMatrix } from "./calculate-reverse-matrix";

describe("createReverseMatrix", () => {
  it("should return inversed matrix", () => {
    const matrix: TransformState = { scale: 2, x: 2, y: 2 };

    const reverse: TransformState = calculateReverseMatrix(matrix);

    const expected: TransformState = {
      scale: 1 / 2,
      x: -1,
      y: -1,
    };

    expect(reverse).toStrictEqual(expected);
  });
});
