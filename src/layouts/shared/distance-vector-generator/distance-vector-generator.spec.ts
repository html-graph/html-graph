import { DistanceVectorGenerator } from "./distance-vector-generator";

describe("DistanceVectorGenerator", () => {
  it("should calculate direct vector", () => {
    const x = 10;
    const y = 20;
    const d2 = x * x + y * y;
    const d = Math.sqrt(d2);
    const ex = x / d;
    const ey = y / d;

    const vectors = new DistanceVectorGenerator((): number => 0);

    const vector = vectors.create({ x: 0, y: 0 }, { x, y });

    expect(vector).toEqual({ d2, ex, ey, d });
  });

  it("should calculate randomize vector direction when two nodes have same coordinates", () => {
    const vectors = new DistanceVectorGenerator((): number => 0);

    const vector = vectors.create({ x: 0, y: 0 }, { x: 0, y: 0 });

    expect(vector).toEqual({ d2: 0, ex: 1, ey: 0, d: 0 });
  });
});
