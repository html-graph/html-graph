import { createDirectionVector } from "./create-direction-vector";

describe("createDirectionVector", () => {
  it("should create direction vector x", () => {
    const vector = createDirectionVector(Math.PI);

    expect(vector.x).toBeCloseTo(-1);
  });

  it("should create direction vector y", () => {
    const vector = createDirectionVector(Math.PI);

    expect(vector.y).toBeCloseTo(0);
  });
});
