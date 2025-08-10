import { ConnectionCategory } from "../../connection-category";
import { DirectEdgeShape } from "./direct-edge-shape";

describe("DirectEdgeShape", () => {
  it("should create edge shape with only line", () => {
    const shape = new DirectEdgeShape();

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should create edge with line and arrow element", () => {
    const shape = new DirectEdgeShape({ hasSourceArrow: true });

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should create edge with line and 2 arrows element", () => {
    const shape = new DirectEdgeShape({
      hasSourceArrow: true,
      hasTargetArrow: true,
    });

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = new DirectEdgeShape();

    shape.render({
      from: {
        x: 0,
        y: 100,
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

    const g = shape.svg.children[0] as SVGGElement;

    expect(g.style.transform).toBe("scale(1, -1)");
  });

  it("should create line path", () => {
    const shape = new DirectEdgeShape();

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

    const g = shape.svg.children[0];
    const arrow = g.children[0];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 100 0");
  });

  it("should create path for source arrow", () => {
    const shape = new DirectEdgeShape({ hasSourceArrow: true });

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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 15 4 L 15 -4 Z");
  });

  it("should create path for target arrow", () => {
    const shape = new DirectEdgeShape({ hasTargetArrow: true });

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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 0 L 85 -4 L 85 4 Z");
  });

  it("should render empty line when diagonal distance is 0", () => {
    const shape = new DirectEdgeShape({ hasTargetArrow: true });

    shape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe("");
  });

  it("should not render source arrow when diagonal distance is 0", () => {
    const shape = new DirectEdgeShape({ hasSourceArrow: true });

    shape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("");
  });

  it("should not render target arrow when diagonal distance is 0", () => {
    const shape = new DirectEdgeShape({ hasTargetArrow: true });

    shape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 0,
      },
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("");
  });

  it("should account for source arrow offset", () => {
    const shape = new DirectEdgeShape({
      hasSourceArrow: true,
      sourceOffset: 10,
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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 10 0 L 25 4 L 25 -4 Z");
  });

  it("should account for target arrow offset", () => {
    const shape = new DirectEdgeShape({
      hasTargetArrow: true,
      targetOffset: 10,
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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 90 0 L 75 -4 L 75 4 Z");
  });

  it("should account for legacy target arrow offset", () => {
    const shape = new DirectEdgeShape({
      hasTargetArrow: true,
      targetOffset: 10,
      arrowRenderer: {
        radius: 10,
      },
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

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 90 0 L 75 -10 L 75 10 Z");
  });
});
