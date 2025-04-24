import { TransformState } from "@/viewport-store";
import { TransformPayload } from "../../preprocessors";
import { move } from "./move";

describe("move", () => {
  it("should move", () => {
    const matrix: TransformPayload = {
      scale: 1,
      x: 0,
      y: 0,
    };

    const movedMatrix = move(matrix, 2, 3);

    const expected: TransformState = {
      scale: 1,
      x: 2,
      y: 3,
    };

    expect(movedMatrix).toStrictEqual(expected);
  });
});
