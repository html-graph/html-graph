import { describe, expect, it, vi } from "vitest";
import { ConnectionCategory } from "../connection-category";
import {
  BezierEdgePath,
  CycleCircleEdgePath,
  DetourBezierEdgePath,
} from "../paths";
import { PathEdgeShape } from "./path-edge-shape";
import { svgPadding } from "../svg-padding";

const createPathEdge = (): PathEdgeShape => {
  return new PathEdgeShape({
    color: "#FFFFFF",
    width: 2,
    hasSourceArrow: false,
    hasTargetArrow: false,
    createLinePath: (from, to) =>
      new BezierEdgePath({
        from,
        to,
        arrowLength: 10,
        curvature: 90,
      }),
    createNodeCyclePath: (from, to) =>
      new DetourBezierEdgePath({
        from,
        to,
        arrowLength: 10,
        curvature: 90,
        detourDistance: 100,
        detourDir: 0,
      }),
    createPortCyclePath: (from, to) =>
      new CycleCircleEdgePath({
        from,
        to,
        radius: 10,
        smallRadius: 2,
        arrowLength: 10,
      }),
    arrowRenderer: () => "",
    arrowLength: 10,
    padding: svgPadding,
  });
};

describe("PathEdgeShape", () => {
  it("should call model change callback on render", () => {
    const shape = createPathEdge();

    const modelChange = vi.fn();

    shape.onModelChange.subscribe((model) => {
      modelChange(model);
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

    expect(modelChange).toHaveBeenCalled();
  });

  it("should update view on render", () => {
    const shape = createPathEdge();

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

    expect(shape.view.line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 M 60 50 C 150 50, 50 150, 140 150 M 140 150 L 150 150",
    );
  });
});
