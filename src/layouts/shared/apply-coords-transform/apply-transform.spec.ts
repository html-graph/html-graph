import { Identifier } from "@/identifier";
import { MutablePoint } from "@/point";
import { applyCoordsTransform } from "./apply-transform";

describe("applyCoordsTransform", () => {
  it("should apply a and d multiplier", () => {
    const coords = new Map<Identifier, MutablePoint>([
      ["node-1", { x: 1, y: 2 }],
    ]);

    applyCoordsTransform(coords, { a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 });

    expect(coords.get("node-1")).toEqual({ x: 2, y: 2 });
  });

  it("should apply b and e multiplier", () => {
    const coords = new Map<Identifier, MutablePoint>([
      ["node-1", { x: 1, y: 2 }],
    ]);

    applyCoordsTransform(coords, { a: 0, b: 2, c: 0, d: 0, e: 2, f: 0 });

    expect(coords.get("node-1")).toEqual({ x: 4, y: 4 });
  });

  it("should apply c and f multiplier", () => {
    const coords = new Map<Identifier, MutablePoint>([
      ["node-1", { x: 1, y: 2 }],
    ]);

    applyCoordsTransform(coords, { a: 0, b: 0, c: 2, d: 0, e: 0, f: 2 });

    expect(coords.get("node-1")).toEqual({ x: 2, y: 2 });
  });
});
