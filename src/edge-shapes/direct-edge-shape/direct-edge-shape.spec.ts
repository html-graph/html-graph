import { describe, expect, it, vi } from "vitest";
import { ConnectionCategory } from "../shared";
import { DirectEdgeShape } from "./direct-edge-shape";

describe("DirectEdgeShape", () => {
  it("should call specified callback on render", () => {
    const shape = new DirectEdgeShape();

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

    expect(spy).toHaveBeenCalledWith({
      box: {
        height: 100,
        width: 200,
        x: -50,
        y: -50,
      },
      linePath: "M 50 50 L 150 50",
      sourceArrowPath: "",
      sourcePoint: {
        x: 50,
        y: 50,
      },
      targetArrowPath: "",
      targetPoint: {
        x: 150,
        y: 50,
      },
    });
  });

  it("should update view on render", () => {
    const shape = new DirectEdgeShape();

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

    expect(shape.view.line.getAttribute("d")).toBe("M 50 50 L 150 50");
  });
});
