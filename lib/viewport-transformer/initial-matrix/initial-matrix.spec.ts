import { initialMatrix } from "./initial-matrix";

describe("initialMatrix", () => {
  it("should be 1 matrix", () => {
    expect(initialMatrix).toStrictEqual({
      scale: 1,
      dx: 0,
      dy: 0,
    });
  });
});
