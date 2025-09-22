import { NodeDistanceVectors } from "./node-distance-vectors";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

describe("NodeDistanceVectors", () => {
  it("should fail", () => {
    const x = 10;
    const y = 20;
    const distance = Math.sqrt(x * x + y * y);
    const ex = x / distance;
    const ey = y / distance;

    const coordinates = new Map<Identifier, Point>([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x, y }],
    ]);

    const vectors = new NodeDistanceVectors(coordinates);

    const vector = vectors.getVector("node-1", "node-2");

    expect(vector).toEqual({ distance, ex, ey });
  });
});
