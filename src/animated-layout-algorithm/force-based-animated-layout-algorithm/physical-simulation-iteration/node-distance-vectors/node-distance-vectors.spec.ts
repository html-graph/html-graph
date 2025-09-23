import { NodeDistanceVectors } from "./node-distance-vectors";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

describe("NodeDistanceVectors", () => {
  it("should calculate direct vector", () => {
    const x = 10;
    const y = 20;
    const d2 = x * x + y * y;
    const distance = Math.sqrt(d2);
    const ex = x / distance;
    const ey = y / distance;

    const coordinates = new Map<Identifier, Point>([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x, y }],
    ]);

    const vectors = new NodeDistanceVectors(coordinates);

    const vector = vectors.getVector("node-1", "node-2");

    expect(vector).toEqual({ d2, ex, ey });
  });
});
