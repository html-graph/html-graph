import { describe, expect, it } from "vitest";
import { orthogonalizeDirection } from "./orthogonalize-direction";

describe("orthogonalizeDirection", () => {
  it("should return zero angle when angle is west", () => {
    expect(orthogonalizeDirection(0)).toBe(0);
  });

  it("should return PI angle when angle is east", () => {
    expect(orthogonalizeDirection(Math.PI)).toBe(Math.PI);
  });

  it("should return PI/2 angle when angle is north", () => {
    expect(orthogonalizeDirection(Math.PI / 2)).toBe(Math.PI / 2);
  });

  it("should return -PI/2 angle when angle is south", () => {
    expect(orthogonalizeDirection(-Math.PI / 2)).toBe(-Math.PI / 2);
  });
});
