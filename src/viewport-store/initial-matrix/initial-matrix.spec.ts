import { TransformState } from "../transform-state";
import { initialMatrix } from "./initial-matrix";

describe("initialMatrix", () => {
  it("should be 1 matrix", () => {
    const expected: TransformState = {
      scale: 1,
      x: 0,
      y: 0,
    };

    expect(initialMatrix).toStrictEqual(expected);
  });
});
