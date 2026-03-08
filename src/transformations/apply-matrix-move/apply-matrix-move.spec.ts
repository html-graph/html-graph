import { TransformState } from "@/viewport-store";
import { applyMatrixMove } from "./apply-matrix-move";

describe("applyMatrixMove", () => {
  it("should move", () => {
    const matrix: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    const movedMatrix = applyMatrixMove(matrix, 2, 3);

    const expected: TransformState = {
      scale: 1,
      x: 2,
      y: 3,
    };

    expect(movedMatrix).toStrictEqual(expected);
  });
});
