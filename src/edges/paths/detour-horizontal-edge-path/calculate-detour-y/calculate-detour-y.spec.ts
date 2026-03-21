import { calculateDotourY } from "./calculate-detour-y";

describe("calculateDetourY", () => {
  it("should create detour line points when target point is higher", () => {
    const y = calculateDotourY({ x: 0, y: 0 }, { x: 100, y: 100 }, 100);

    expect(y).toBe(200);
  });

  it("should create detour line points when target point is higher and distance is negative", () => {
    const y = calculateDotourY({ x: 0, y: 0 }, { x: 100, y: 100 }, -100);

    expect(y).toBe(-100);
  });
});
