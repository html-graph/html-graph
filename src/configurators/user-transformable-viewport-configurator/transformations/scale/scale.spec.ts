import { TransformState } from "@/viewport-store";
import { TransformPayload } from "../../transform-payload";
import { scale } from "./scale";

describe("scale", () => {
  it("should scale", () => {
    const matrix: TransformPayload = {
      scale: 1,
      x: 0,
      y: 0,
    };

    const scaledMatrix = scale(matrix, 2, 3, 4);

    const expected: TransformState = {
      scale: 2,
      x: -3,
      y: -4,
    };

    expect(scaledMatrix).toStrictEqual(expected);
  });
});
