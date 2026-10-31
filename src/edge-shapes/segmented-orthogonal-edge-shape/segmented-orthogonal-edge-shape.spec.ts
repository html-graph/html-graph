import { describe, expect, it, vi } from "vitest";
import { ConnectionCategory } from "../shared";
import { SegmentedOrthogonalEdgeShape } from "./segmented-orthogonal-edge-shape";

describe("SegmentedOrthogonalEdgeShape", () => {
  it("should call specified callback on render", () => {
    const shape = new SegmentedOrthogonalEdgeShape();

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
    const shape = new SegmentedOrthogonalEdgeShape();

    const g = shape.element.children[0];
    const line = g.children[0];

    const spy = vi.spyOn(line, "setAttribute");

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

    expect(spy).toHaveBeenCalledWith("d", expect.anything());
  });

  it("should configure midpoint element", () => {
    const midpointElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );

    const shape = new SegmentedOrthogonalEdgeShape({ midpointElement });

    expect(shape.element.lastChild).toBe(midpointElement);
  });

  it("should configure interactive shape", () => {
    const shape = new SegmentedOrthogonalEdgeShape({ interactiveDistance: 10 });
    const handle = shape.element.children[0].children[1];

    expect(handle.children[0].nodeName).toBe("path");
  });
});
