import { horizontalizeDirection } from "./horizontalize-direction";

describe("horizontalizeDirection", () => {
  it("should return zero angle when cos is positive", () => {
    expect(horizontalizeDirection(Math.PI / 4)).toBe(0);
  });

  it("should return PI angle when cos is negavive", () => {
    expect(horizontalizeDirection(Math.PI)).toBe(Math.PI);
  });
});
