import { TransformState } from "@/viewport-store";
import { applyMatrixScale } from "./apply-matrix-scale";

describe("applyMatrixScale", () => {
  it("should scale", () => {
    const matrix: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    const scaledMatrix = applyMatrixScale(matrix, 2, 3, 4);

    const expected: TransformState = {
      scale: 2,
      x: -3,
      y: -4,
    };

    expect(scaledMatrix).toStrictEqual(expected);
  });
});
