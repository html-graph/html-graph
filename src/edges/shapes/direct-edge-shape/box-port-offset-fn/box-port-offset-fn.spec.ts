import { boxPortOffsetFn } from "./box-port-offset-fn";

describe("boxPortOffsetFn", () => {
  it("should resolve specified width when direction is horizontal", () => {
    expect(
      boxPortOffsetFn({
        direction: { x: 1, y: 0 },
        dimensions: { width: 100, height: 50 },
      }),
    ).toBe(100);
  });

  it("should resolve specified height when direction is vertical", () => {
    expect(
      boxPortOffsetFn({
        direction: { x: 0, y: 1 },
        dimensions: { width: 100, height: 50 },
      }),
    ).toBe(50);
  });
});
