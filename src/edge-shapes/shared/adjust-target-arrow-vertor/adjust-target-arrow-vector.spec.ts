import { describe, expect, it } from "vitest";
import { adjustTargetVector } from "./adjust-target-arrow-vector";
import { ConnectionCategory } from "../connection-category";
import { Point } from "@/point";

describe("adjustTargetVector", () => {
  it("should return reversed target vector for line connection category", () => {
    const sourceVector: Point = { x: 1, y: 2 };
    const targetVector: Point = { x: 3, y: 4 };
    const expected: Point = { x: -3, y: -4 };

    expect(
      adjustTargetVector(sourceVector, targetVector, ConnectionCategory.Line),
    ).toEqual(expected);
  });

  it("should return source vector for port cycle connection category", () => {
    const sourceVector: Point = { x: 1, y: 2 };
    const targetVector: Point = { x: 3, y: 4 };
    const expected: Point = { x: 1, y: 2 };

    expect(
      adjustTargetVector(
        sourceVector,
        targetVector,
        ConnectionCategory.PortCycle,
      ),
    ).toEqual(expected);
  });
});
