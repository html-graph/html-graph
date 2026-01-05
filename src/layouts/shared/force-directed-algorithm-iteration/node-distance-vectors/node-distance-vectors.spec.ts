import { NodeDistanceVectors } from "./node-distance-vectors";
import { Identifier } from "@/identifier";
import { Point } from "@/point";

describe("NodeDistanceVectors", () => {
  it("should calculate direct vector", () => {
    const x = 10;
    const y = 20;
    const d2 = x * x + y * y;
    const d = Math.sqrt(d2);
    const ex = x / d;
    const ey = y / d;

    const coordinates = new Map<Identifier, Point>([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x, y }],
    ]);

    const vectors = new NodeDistanceVectors(coordinates, (): number => 0, 1);

    const vector = vectors.getVector("node-1", "node-2");

    expect(vector).toEqual({ d2, ex, ey, d });
  });

  it("should calculate fallback vector when two nodes have same coordinates", () => {
    const coordinates = new Map<Identifier, Point>([
      ["node-1", { x: 0, y: 0 }],
      ["node-2", { x: 0, y: 0 }],
    ]);

    const vectors = new NodeDistanceVectors(coordinates, (): number => 0, 10);

    const vector = vectors.getVector("node-1", "node-2");

    expect(vector).toEqual({ d2: 100, ex: 1, ey: 0, d: 10 });
  });
});
