import { TransformState } from "../transform-state";
import { calculateReverseMatrix } from "./calculate-reverse-matrix";

describe("createReverseMatrix", () => {
  it("should return inversed matrix", () => {
    const matrix: TransformState = { scale: 2, dx: 2, dy: 2 };

    const reverse: TransformState = calculateReverseMatrix(matrix);

    expect(reverse).toStrictEqual({ scale: 1 / 2, dx: -1, dy: -1 });
  });
});
