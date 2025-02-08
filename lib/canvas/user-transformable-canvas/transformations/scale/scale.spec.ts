import { TransformPayload } from "../../preprocessors";
import { scale } from "./scale";

describe("scale", () => {
  it("should scale", () => {
    const matrix: TransformPayload = {
      scale: 1,
      dx: 0,
      dy: 0,
    };

    const scaledMatrix = scale(matrix, 2, 3, 4);

    expect(scaledMatrix).toStrictEqual({ scale: 2, dx: -3, dy: -4 });
  });
});
