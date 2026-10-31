import { describe, expect, it } from "vitest";
import { createArrowPoint } from "./create-arrow-point";

describe("createArrowPoint", () => {
  it("should create point same as origin when has no arrow", () => {
    const result = createArrowPoint({
      origin: { x: 0, y: 0 },
      direction: { x: 1, y: 0 },
      arrowLength: 10,
      hasArrow: false,
    });

    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("should create rotated point when has arrow", () => {
    const result = createArrowPoint({
      origin: { x: 0, y: 0 },
      direction: { x: 0, y: 1 },
      arrowLength: 10,
      hasArrow: true,
    });

    expect(result).toEqual({ x: 0, y: 10 });
  });
});
