import { createFlipDirectionVector } from "./create-flip-direction-vector";

describe("createFlipDirectionVector", () => {
  it("should create direction vector x when no flip required", () => {
    const vector = createFlipDirectionVector({ x: -1, y: 0 }, 1, 1);

    expect(vector.x).toBeCloseTo(-1);
  });

  it("should create direction vector y when no flip required", () => {
    const vector = createFlipDirectionVector({ x: -1, y: 0 }, 1, 1);

    expect(vector.y).toBeCloseTo(0);
  });

  it("should create direction vector x when flip required", () => {
    const vector = createFlipDirectionVector({ x: -1, y: 0 }, -1, 1);

    expect(vector.x).toBeCloseTo(1);
  });

  it("should create direction vector y when flip required", () => {
    const vector = createFlipDirectionVector({ x: 0, y: 1 }, 1, -1);

    expect(vector.y).toBeCloseTo(-1);
  });
});
