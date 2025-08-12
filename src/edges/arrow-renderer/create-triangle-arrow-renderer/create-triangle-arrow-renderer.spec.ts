import { Point } from "@/point";
import { createTriangleArrowRenderer } from "./create-triangle-arrow-renderer";

describe("createTriangleArrowRenderer", () => {
  it("should create arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createTriangleArrowRenderer({ radius: 5 });

    const path = renderer({ direction, shift, arrowLength: 10 });

    expect(path).toBe("M 0 0 L 10 5 L 10 -5 Z");
  });

  it("should create rotated arrow path", () => {
    const direction: Point = { x: 0, y: 1 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createTriangleArrowRenderer({ radius: 5 });

    const path = renderer({ direction, shift, arrowLength: 10 });

    expect(path).toBe("M 0 0 L -5 10 L 5 10 Z");
  });

  it("should create shifted arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 5, y: 10 };
    const renderer = createTriangleArrowRenderer({ radius: 5 });

    const path = renderer({ direction, shift, arrowLength: 10 });

    expect(path).toBe("M 5 10 L 15 15 L 15 5 Z");
  });
});
