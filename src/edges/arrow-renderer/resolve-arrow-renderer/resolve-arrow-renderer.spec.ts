import { Point } from "@/point";
import { resolveArrowRenderer } from "./resolve-arrow-renderer";
import { ArrowRenderer } from "../arrow-renderer";

describe("resolveArrowRenderer", () => {
  it("should resolve wedge arrow renderer by default", () => {
    const renderer = resolveArrowRenderer({});
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };

    expect(renderer({ direction, shift, arrowLength: 15 })).toBe(
      "M 0 0 A 100 100 0 0 1 15.681483474218634 5.176380902050416 A 20 20 0 0 1 15.681483474218634 -5.176380902050416 A 100 100 0 0 1 0 0",
    );
  });

  it("should resolve wedge arrow renderer with specified radius and angle", () => {
    const renderer = resolveArrowRenderer({
      type: "wedge",
      radius: 10,
      angle: Math.PI / 6,
    });
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };

    expect(renderer({ direction, shift, arrowLength: 15 })).toBe(
      "M 0 0 A 10 10 0 0 1 16.33974596215561 4.999999999999999 A 10 10 0 0 1 16.33974596215561 -4.999999999999999 A 10 10 0 0 1 0 0",
    );
  });

  it("should resolve arc arrow renderer with specified radius", () => {
    const renderer = resolveArrowRenderer({ type: "arc", radius: 15 });
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };

    expect(renderer({ direction, shift, arrowLength: 15 })).toBe(
      "M 0 0 A 22.5 22.5 0 0 0 18 -9 A 15 15 0 0 0 18 9 A 22.5 22.5 0 0 0 0 0",
    );
  });

  it("should resolve arc arrow renderer with default radius", () => {
    const renderer = resolveArrowRenderer({ type: "arc" });
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };

    expect(renderer({ direction, shift, arrowLength: 15 })).toBe(
      "M 0 0 A 29.0625 29.0625 0 0 0 18.035413153457 -6.27318718381113 A 8 8 0 0 0 18.035413153457 6.27318718381113 A 29.0625 29.0625 0 0 0 0 0",
    );
  });

  it("should resolve polygon arrow renderer with specified radius", () => {
    const renderer = resolveArrowRenderer({ type: "triangle", radius: 10 });
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };

    expect(renderer({ direction, shift, arrowLength: 15 })).toBe(
      "M 0 0 L 15 10 L 15 -10 Z",
    );
  });

  it("should resolve specified custom arrow renderer", () => {
    const renderer: ArrowRenderer = () => "path";

    expect(resolveArrowRenderer(renderer)).toBe(renderer);
  });
});
