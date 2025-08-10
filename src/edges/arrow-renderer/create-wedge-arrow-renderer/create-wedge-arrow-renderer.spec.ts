import { Point } from "@/point";
import { createWedgeArrowRenderer } from "./create-wedge-arrow-renderer";

describe("createWedgeArrowRenderer", () => {
  it("should create arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createWedgeArrowRenderer({
      smallRadius: 8,
      radius: 30,
      angle: Math.PI / 4,
    });

    const path = renderer({ direction, shift, arrowLength: 20 });

    expect(path).toBe(
      "M 0 0 L 22.343145750507617 5.656854249492378 A 8 8 0 0 1 22.343145750507617 -5.656854249492378 L 0 0",
    );
  });

  it("should create rotated arrow path", () => {
    const direction: Point = { x: 0, y: 1 };
    const shift: Point = { x: 0, y: 0 };
    const renderer = createWedgeArrowRenderer({
      smallRadius: 8,
      radius: 30,
      angle: Math.PI / 4,
    });

    const path = renderer({ direction, shift, arrowLength: 20 });

    expect(path).toBe(
      "M 0 0 L -5.656854249492378 22.343145750507617 A 8 8 0 0 1 5.656854249492378 22.343145750507617 L 0 0",
    );
  });

  it("should create shifted arrow path", () => {
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 5, y: 10 };
    const renderer = createWedgeArrowRenderer({
      smallRadius: 8,
      radius: 30,
      angle: Math.PI / 4,
    });

    const path = renderer({ direction, shift, arrowLength: 20 });

    expect(path).toBe(
      "M 5 10 L 27.343145750507617 15.656854249492378 A 8 8 0 0 1 27.343145750507617 4.343145750507622 L 5 10",
    );
  });
});
