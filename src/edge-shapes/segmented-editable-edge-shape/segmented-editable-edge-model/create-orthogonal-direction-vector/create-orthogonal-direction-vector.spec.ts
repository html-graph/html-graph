import { describe, expect, it } from "vitest";
import { createOrthogonalDirectionVector } from "./create-orthogonal-direction-vector";

describe("createOrthogonalDirectionVector", () => {
  it("should return west direction when angle is 0", () => {
    const result = createOrthogonalDirectionVector(0);

    expect(result).toEqual({ x: 1, y: 0 });
  });

  it("should return east direction when angle is PI", () => {
    const result = createOrthogonalDirectionVector(Math.PI);

    expect(result).toEqual({ x: -1, y: 0 });
  });

  it("should return north direction when angle is PI/2", () => {
    const result = createOrthogonalDirectionVector(Math.PI / 2);

    expect(result).toEqual({ x: 0, y: 1 });
  });

  it("should return south direction when angle is -PI/2", () => {
    const result = createOrthogonalDirectionVector(-Math.PI / 2);

    expect(result).toEqual({ x: 0, y: -1 });
  });
});
