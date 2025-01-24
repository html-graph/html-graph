import { initialMatrix } from "./initial-matrix";

describe("initialMatrix", () => {
  it("should have scale equal to 1", () => {
    expect(initialMatrix.scale).toBe(1);
  });

  it("should have dx equal to 0", () => {
    expect(initialMatrix.dx).toBe(0);
  });

  it("should have dy equal to 0", () => {
    expect(initialMatrix.dy).toBe(0);
  });
});
