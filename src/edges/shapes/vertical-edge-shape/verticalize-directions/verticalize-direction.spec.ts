import { verticalizeDirection } from "./verticalize-direction";

describe("verticalizeDirection", () => {
  it("should return PI/2 angle when sin is positive", () => {
    expect(verticalizeDirection(Math.PI / 4)).toBe(Math.PI / 2);
  });

  it("should return -PI/2 angle when sin is negative", () => {
    expect(verticalizeDirection(-Math.PI / 4)).toBe(-Math.PI / 2);
  });
});
