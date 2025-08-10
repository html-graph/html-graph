import { Point } from "@/point";
import { resolveArrowRenderer } from "./resolve-arrow-renderer";
import { ArrowRenderer } from "../arrow-renderer";

describe("resolveArrowRenderer", () => {
  it("should resolve polygon arrow renderer by default", () => {
    const renderer = resolveArrowRenderer({});
    const direction: Point = { x: 1, y: 0 };
    const shift: Point = { x: 0, y: 0 };

    expect(renderer({ direction, shift, arrowLength: 15 })).toBe(
      "M 0 0 L 15 4 L 15 -4 Z",
    );
  });

  it("should resolve polygon arrow renderer with specified radius", () => {
    const renderer = resolveArrowRenderer({ radius: 10 });
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
