import { BezierEdgeShape } from "../bezier-edge-shape";
import { ConnectionCategory } from "../connection-category";
import { EdgeRenderParams } from "../edge-render-params";
import { InteractiveEdgeError } from "./interactive-edge-error";
import { InteractiveEdgeShape } from "./interactive-edge-shape";

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

describe("InteractiveEdgeShape", () => {
  it("should create interactive group with line", () => {
    const shape = new BezierEdgeShape();
    const interactiveShape = new InteractiveEdgeShape(shape);

    expect(interactiveShape.handle.children[0].nodeName).toBe("path");
  });

  it("should create interactive group with line of default width when no parameters specified", () => {
    const shape = new BezierEdgeShape();
    const interactiveShape = new InteractiveEdgeShape(shape);

    const width =
      interactiveShape.handle.children[0].getAttribute("stroke-width");

    expect(width).toBe("10");
  });

  it("should create interactive group with line of default width", () => {
    const shape = new BezierEdgeShape();
    const interactiveShape = new InteractiveEdgeShape(shape, {});

    const width =
      interactiveShape.handle.children[0].getAttribute("stroke-width");

    expect(width).toBe("10");
  });

  it("should create interactive group with line of specified width", () => {
    const shape = new BezierEdgeShape();
    const interactiveShape = new InteractiveEdgeShape(shape, { distance: 20 });

    const width =
      interactiveShape.handle.children[0].getAttribute("stroke-width");

    expect(width).toBe("20");
  });

  it("should create interactive group with source arrow", () => {
    const shape = new BezierEdgeShape({ hasSourceArrow: true });
    const interactiveShape = new InteractiveEdgeShape(shape, {});

    expect(interactiveShape.handle.children[1].nodeName).toBe("path");
  });

  it("should create interactive group with target arrow", () => {
    const shape = new BezierEdgeShape({ hasTargetArrow: true });
    const interactiveShape = new InteractiveEdgeShape(shape, {});

    expect(interactiveShape.handle.children[1].nodeName).toBe("path");
  });

  it("should append interactive group to specified shape", () => {
    const shape = new BezierEdgeShape();
    const interactiveShape = new InteractiveEdgeShape(shape, {});

    expect(interactiveShape.svg.children[0].children[1]).toBe(
      interactiveShape.handle,
    );
  });

  it("should render specified edge", () => {
    const shape = new BezierEdgeShape();
    const spy = jest.spyOn(shape, "render");
    const interactiveShape = new InteractiveEdgeShape(shape);

    interactiveShape.render(edgeRenderParams);

    expect(spy).toHaveBeenCalledWith(edgeRenderParams);
  });

  it("should set interactive line path to parent shape line path", () => {
    const shape = new BezierEdgeShape();
    const interactiveShape = new InteractiveEdgeShape(shape);

    interactiveShape.render(edgeRenderParams);

    const path = interactiveShape.svg.children[0].children[0] as SVGPathElement;
    const interactivePath = interactiveShape.svg.children[0].children[1]
      .children[0] as SVGPathElement;

    expect(path.getAttribute("d")).toBe(interactivePath.getAttribute("d"));
  });

  it("should set interactive source arrow path to parent shape source arrow path", () => {
    const shape = new BezierEdgeShape({ hasSourceArrow: true });
    const interactiveShape = new InteractiveEdgeShape(shape);

    interactiveShape.render(edgeRenderParams);

    const path = interactiveShape.svg.children[0].children[1] as SVGPathElement;
    const interactivePath = interactiveShape.svg.children[0].children[2]
      .children[1] as SVGPathElement;

    expect(path.getAttribute("d")).toBe(interactivePath.getAttribute("d"));
  });

  it("should set interactive target arrow path to parent shape target arrow path", () => {
    const shape = new BezierEdgeShape({ hasTargetArrow: true });
    const interactiveShape = new InteractiveEdgeShape(shape);

    interactiveShape.render(edgeRenderParams);

    const path = interactiveShape.svg.children[0].children[1] as SVGPathElement;
    const interactivePath = interactiveShape.svg.children[0].children[2]
      .children[1] as SVGPathElement;

    expect(path.getAttribute("d")).toBe(interactivePath.getAttribute("d"));
  });

  it("should throw error when trying to decorate already interactive edge", () => {
    const shape = new BezierEdgeShape({ hasTargetArrow: true });
    const interactiveShape = new InteractiveEdgeShape(shape);

    expect(() => {
      new InteractiveEdgeShape(interactiveShape);
    }).toThrow(InteractiveEdgeError);
  });
});
