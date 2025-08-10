import { Point } from "@/point";
import { createPolygonArrowRenderer } from "./create-polygon-arrow-renderer";

describe("createPolygonArrowRenderer", () => {
  it("should create arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createPolygonArrowRenderer({ width: 5 });

    const path = renderer({ direction, shift, arrowLength: 10 });

    expect(path).toBe("M 0 0 L 10 5 L 10 -5 Z");
  });

  it("should create rotated arrow path", () => {
    const direction: Point = { x: 0, y: 1 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createPolygonArrowRenderer({ width: 5 });

    const path = renderer({ direction, shift, arrowLength: 10 });

    expect(path).toBe("M 0 0 L -5 10 L 5 10 Z");
  });

  it("should create shifted arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 5, y: 10 };
    const renderer = createPolygonArrowRenderer({ width: 5 });

    const path = renderer({ direction, shift, arrowLength: 10 });

    expect(path).toBe("M 5 10 L 15 15 L 15 5 Z");
  });
});
