import { Point } from "@/point";
import { createArcArrowRenderer } from "./create-arc-arrow-renderer";

describe("createArcArrowRenderer", () => {
  it("should create arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createArcArrowRenderer({ radius: 8 });

    const path = renderer({ direction, shift, arrowLength: 20 });

    expect(path).toBe(
      "M 0 0 A 45 45 0 0 0 23.77358490566038 -6.7924528301886795 A 8 8 0 0 0 23.77358490566038 6.7924528301886795 A 45 45 0 0 0 0 0",
    );
  });

  it("should create rotated arrow path", () => {
    const direction: Point = { x: 0, y: 1 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createArcArrowRenderer({ radius: 8 });

    const path = renderer({ direction, shift, arrowLength: 20 });

    expect(path).toBe(
      "M 0 0 A 45 45 0 0 0 6.7924528301886795 23.77358490566038 A 8 8 0 0 0 -6.7924528301886795 23.77358490566038 A 45 45 0 0 0 0 0",
    );
  });

  it("should create shifted arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 5, y: 10 };
    const renderer = createArcArrowRenderer({ radius: 8 });

    const path = renderer({ direction, shift, arrowLength: 20 });

    expect(path).toBe(
      "M 5 10 A 45 45 0 0 0 28.77358490566038 3.2075471698113205 A 8 8 0 0 0 28.77358490566038 16.79245283018868 A 45 45 0 0 0 5 10",
    );
  });
});
