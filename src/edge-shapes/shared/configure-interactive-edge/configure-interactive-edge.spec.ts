import { describe, expect, it } from "vitest";
import { BezierEdgeShape } from "../../bezier-edge-shape";
import { ConnectionCategory } from "../connection-category";
import { EdgeRenderParams } from "../edge-render-params";
import { configureInteractiveEdge } from "./configure-interactive-edge";

const edgeRenderParams: EdgeRenderParams = {
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
    direction: 100,
  },
  category: ConnectionCategory.Line,
};

describe("configureInteractiveEdge", () => {
  it("should create interactive group with line", () => {
    const shape = new BezierEdgeShape();
    configureInteractiveEdge(shape, 10);
    const handle = shape.element.children[0].children[1];

    expect(handle.children[0].nodeName).toBe("path");
  });

  it("should create interactive group with line of specified width", () => {
    const shape = new BezierEdgeShape();
    configureInteractiveEdge(shape, 10);
    const handle = shape.element.children[0].children[1];

    const width = handle.children[0].getAttribute("stroke-width");

    expect(width).toBe("10");
  });

  it("should create interactive group with source arrow", () => {
    const shape = new BezierEdgeShape({ hasSourceArrow: true });
    configureInteractiveEdge(shape, 10);
    const handle = shape.element.children[0];

    expect(handle.children[1].nodeName).toBe("path");
  });

  it("should create interactive group with target arrow", () => {
    const shape = new BezierEdgeShape({ hasTargetArrow: true });
    configureInteractiveEdge(shape, 10);
    const handle = shape.element.children[0];

    expect(handle.children[1].nodeName).toBe("path");
  });

  it("should set interactive line path to shape line path", () => {
    const shape = new BezierEdgeShape();
    configureInteractiveEdge(shape, 10);

    shape.render(edgeRenderParams);

    const path = shape.element.children[0].children[0] as SVGPathElement;
    const interactivePath = shape.element.children[0].children[1]
      .children[0] as SVGPathElement;

    expect(path.getAttribute("d")).toBe(interactivePath.getAttribute("d"));
  });

  it("should set interactive source arrow path to shape source arrow path", () => {
    const shape = new BezierEdgeShape({ hasSourceArrow: true });
    configureInteractiveEdge(shape, 10);

    shape.render(edgeRenderParams);

    const path = shape.element.children[0].children[1] as SVGPathElement;
    const interactivePath = shape.element.children[0].children[2]
      .children[1] as SVGPathElement;

    expect(path.getAttribute("d")).toBe(interactivePath.getAttribute("d"));
  });

  it("should set interactive target arrow path to shape target arrow path", () => {
    const shape = new BezierEdgeShape({ hasTargetArrow: true });
    configureInteractiveEdge(shape, 10);

    shape.render(edgeRenderParams);

    const path = shape.element.children[0].children[1] as SVGPathElement;
    const interactivePath = shape.element.children[0].children[2]
      .children[1] as SVGPathElement;

    expect(path.getAttribute("d")).toBe(interactivePath.getAttribute("d"));
  });
});
