import { createDirectionVector } from "./create-direction-vector";

describe("createFlipDirectionVector", () => {
  it("should create direction vector x", () => {
    const vector = createDirectionVector((Math.PI * 3) / 4);

    expect(vector.x).toBeCloseTo(-Math.sqrt(2) / 2);
  });

  it("should create direction vector y", () => {
    const vector = createDirectionVector((Math.PI * 3) / 4);

    expect(vector.x).toBeCloseTo(-Math.sqrt(2) / 2);
  });
});
