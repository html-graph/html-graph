import { calculateDetourX } from "./calculate-detour-x";

describe("calculateDetourX", () => {
  it("should create detour line points when target point is higher", () => {
    const x = calculateDetourX({ x: 0, y: 0 }, { x: 100, y: 100 }, 100);

    expect(x).toBe(200);
  });

  it("should create detour line points when target point is higher and distance is negative", () => {
    const x = calculateDetourX({ x: 0, y: 0 }, { x: 100, y: 100 }, -100);

    expect(x).toBe(-100);
  });
});
