import { describe, expect, it } from "vitest";
import { BezierEdgeShape } from "../../bezier-edge-shape";
import { ConnectionCategory } from "../connection-category";
import { configureMidpoint } from "./configure-midpoint";

describe("configureMidpoint", () => {
  it("should append specified midpoint element to svg", () => {
    const baseShape = new BezierEdgeShape();

    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    configureMidpoint(baseShape, midpointElement);

    expect(baseShape.element.lastChild).toBe(midpointElement);
  });

  it("should update midpoint element transformation", () => {
    const baseShape = new BezierEdgeShape();

    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    configureMidpoint(baseShape, midpointElement);

    baseShape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    expect(midpointElement.style.transform).toBe("translate(100px, 100px)");
  });
});
