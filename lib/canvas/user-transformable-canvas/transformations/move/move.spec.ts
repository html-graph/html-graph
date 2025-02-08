import { TransformPayload } from "../../preprocessors";
import { move } from "./move";

describe("move", () => {
  it("should move", () => {
    const matrix: TransformPayload = {
      scale: 1,
      dx: 0,
      dy: 0,
    };

    const movedMatrix = move(matrix, 2, 3);

    expect(movedMatrix).toStrictEqual({ scale: 1, dx: 2, dy: 3 });
  });
});
