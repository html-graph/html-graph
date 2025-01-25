import { createDirectionVector } from "./create-direction-vector";

describe("createDirectionVector", () => {
  it("should create direction vector x when no flip required", () => {
    const vector = createDirectionVector(Math.PI, 1, 1);

    expect(vector.x).toBeCloseTo(-1);
  });

  it("should create direction vector y when no flip required", () => {
    const vector = createDirectionVector(Math.PI, 1, 1);

    expect(vector.y).toBeCloseTo(0);
  });

  it("should create direction vector x when flip required", () => {
    const vector = createDirectionVector(Math.PI, -1, 1);

    expect(vector.x).toBeCloseTo(1);
  });

  it("should create direction vector y when flip required", () => {
    const vector = createDirectionVector(Math.PI / 2, 1, -1);

    expect(vector.y).toBeCloseTo(-1);
  });
});
