import { describe, expect, it } from "vitest";
import { transposePoint } from "./transpose-point";

describe("transposePoint", () => {
  it("should transpose point", () => {
    expect(transposePoint({ x: 1, y: 2 })).toEqual({ x: 2, y: 1 });
  });
});
