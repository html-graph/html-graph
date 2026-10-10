import { describe, expect, it, vi } from "vitest";
import { ConnectionCategory } from "../shared";
import { OrthogonalEdgeShape } from "./orthogonal-edge-shape";

describe("OrthogonalEdgeShape", () => {
  it("should call specified callback on render", () => {
    const shape = new OrthogonalEdgeShape();

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
    const shape = new OrthogonalEdgeShape();

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
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    expect(shape.view.line.getAttribute("d")).toBe(
      "M 50 50 L 90 50 C 100 50 100 50 100 50 L 100 50 C 100 50 100 50 110 50 L 150 50",
    );
  });

  it("should configure midpoint element", () => {
    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const shape = new OrthogonalEdgeShape({ midpointElement });

    expect(shape.element.lastChild).toBe(midpointElement);
  });

  it("should configure interactive shape", () => {
    const shape = new OrthogonalEdgeShape({ interactiveDistance: 10 });
    const handle = shape.element.children[0].children[1];

    expect(handle.children[0].nodeName).toBe("path");
  });
});
