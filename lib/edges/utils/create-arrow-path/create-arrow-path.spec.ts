import { Point } from "@/point";
import { createArrowPath } from "./create-arrow-path";

describe("createArrowPath", () => {
  it("should create arrow path", () => {
    const vector: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };
    const arrowLength = 10;
    const arrowWidth = 5;

    const path = createArrowPath(vector, shift, arrowLength, arrowWidth);

    expect(path).toBe("M 0 0 L 10 5 L 10 -5");
  });

  it("should create rotated arrow path", () => {
    const vector: Point = { x: 0, y: 1 };
    const shift: Point = { x: 0, y: 0 };
    const arrowLength = 10;
    const arrowWidth = 5;

    const path = createArrowPath(vector, shift, arrowLength, arrowWidth);

    expect(path).toBe("M 0 0 L -5 10 L 5 10");
  });

  it("should create shifted arrow path", () => {
    const vector: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };
    const arrowLength = 10;
    const arrowWidth = 5;

    const path = createArrowPath(vector, shift, arrowLength, arrowWidth);

    expect(path).toBe("M 5 10 L 15 15 L 15 5");
  });
});
