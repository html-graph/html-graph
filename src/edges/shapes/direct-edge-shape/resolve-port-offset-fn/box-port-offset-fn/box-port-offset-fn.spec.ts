import { describe, expect, it } from "vitest";
import { boxPortOffsetFn } from "./box-port-offset-fn";

describe("boxPortOffsetFn", () => {
  it("should resolve specified horizontal radius when direction is horizontal", () => {
    expect(
      boxPortOffsetFn({
        direction: { x: 1, y: 0 },
        radius: { horizontal: 100, vertical: 50 },
      }),
    ).toBe(100);
  });

  it("should resolve specified vertical radius when direction is vertical", () => {
    expect(
      boxPortOffsetFn({
        direction: { x: 0, y: 1 },
        radius: { horizontal: 100, vertical: 50 },
      }),
    ).toBe(50);
  });
});
