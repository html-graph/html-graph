import { Point, zero } from "@/point";
import { createDirectArrowPath } from "./create-direct-arrow-path";

describe("createDirectArrowPath", () => {
  it("should create arrow path", () => {
    const to: Point = { x: 10, y: 0 };
    const distance = Math.sqrt(to.x * to.x + to.y * to.y);

    const arrowPath = createDirectArrowPath({
      totalDistance: distance,
      to,
      offset: 0,
      flip: 1,
      shift: zero,
      arrowWidth: 1,
      arrowLength: 2,
    });

    expect(arrowPath).toBe("M 0 0 L 2 1 L 2 -1 Z");
  });

  it("should create empty path when distance is 0", () => {
    const to: Point = { x: 0, y: 0 };
    const distance = Math.sqrt(to.x * to.x + to.y * to.y);

    const arrowPath = createDirectArrowPath({
      totalDistance: distance,
      to,
      offset: 0,
      flip: 1,
      shift: zero,
      arrowWidth: 1,
      arrowLength: 2,
    });

    expect(arrowPath).toBe("");
  });

  it("should account for specified offset", () => {
    const to: Point = { x: 10, y: 0 };
    const distance = Math.sqrt(to.x * to.x + to.y * to.y);

    const arrowPath = createDirectArrowPath({
      totalDistance: distance,
      to,
      offset: 1,
      flip: 1,
      shift: zero,
      arrowWidth: 1,
      arrowLength: 2,
    });

    expect(arrowPath).toBe("M 1 0 L 3 1 L 3 -1 Z");
  });

  it("should account for specified shift", () => {
    const to: Point = { x: 10, y: 0 };
    const distance = Math.sqrt(to.x * to.x + to.y * to.y);

    const arrowPath = createDirectArrowPath({
      totalDistance: distance,
      to,
      offset: 0,
      flip: 1,
      shift: { x: 1, y: 2 },
      arrowWidth: 1,
      arrowLength: 2,
    });

    expect(arrowPath).toBe("M 1 2 L 3 3 L 3 1 Z");
  });
});
