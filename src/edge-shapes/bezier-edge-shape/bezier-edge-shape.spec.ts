import { describe, expect, it, vi } from "vitest";
import { ConnectionCategory } from "../shared";
import { BezierEdgeShape } from "./bezier-edge-shape";

describe("BezierEdgeShape", () => {
  it("should call specified callback on render", () => {
    const shape = new BezierEdgeShape();

    const spy = vi.fn();

    shape.onModelChange.subscribe((model) => {
      spy(model);
    });

    shape.render({
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

    expect(spy).toHaveBeenCalled();
  });

  it("should update view on render", () => {
    const shape = new BezierEdgeShape();

    shape.render({
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

    const g = shape.element.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 70 50 M 70 50 C 160 50, 40 150, 130 150 M 130 150 L 150 150",
    );
  });

  it("should configure midpoint element", () => {
    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const shape = new BezierEdgeShape({ midpointElement });

    expect(shape.element.lastChild).toBe(midpointElement);
  });

  it("should configure interactive shape", () => {
    const shape = new BezierEdgeShape({ interactiveDistance: 10 });
    const handle = shape.element.children[0].children[1];

    expect(handle.children[0].nodeName).toBe("path");
  });
});
