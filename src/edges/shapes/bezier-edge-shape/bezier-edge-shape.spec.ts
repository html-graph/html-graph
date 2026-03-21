import { ConnectionCategory } from "../../connection-category";
import { EdgeShape } from "../../edge-shape";
import { BezierEdgeShape } from "./bezier-edge-shape";

const color = "#FFFFFF";
const width = 2;
const curvature = 40;
const arrowLength = 10;
const arrowWidth = 3;

const createBezierEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new BezierEdgeShape({
    color,
    width,
    curvature,
    arrowLength,
    arrowRenderer: {
      radius: arrowWidth,
    },
    hasSourceArrow,
    hasTargetArrow,
    cycleRadius: 30,
    smallCycleRadius: 20,
    detourDistance: 100,
    detourDirection: -Math.PI / 2,
  });
};

describe("BezierEdgeShape", () => {
  it("should create line path without arrows", () => {
    const shape = createBezierEdge(false, false);

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

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 M 60 50 C 100 50, 100 150, 140 150 M 140 150 L 150 150",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createBezierEdge(false, true);

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

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 M 60 50 C 100 50, 100 150, 140 150",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createBezierEdge(true, false);

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

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 60 50 C 100 50, 100 150, 140 150 M 140 150 L 150 150",
    );
  });

  it("should create port cycle path without arrows", () => {
    const shape = createBezierEdge(false, false);

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
      category: ConnectionCategory.PortCycle,
    });

    const line = shape.svg.children[0].children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 M 60 50 A 20 20 0 0 1 78.33030277982336 62 A 30 30 0 1 0 78.33030277982336 38 A 20 20 0 0 1 60 50",
    );
  });

  it("should create node cycle path without arrows", () => {
    const shape = createBezierEdge(false, false);

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
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 C 100 50 60.00000000000001 -50 100 0 C 140 50 100 150 140 150 L 150 150",
    );
  });

  it("should create node cycle path accounting for target arrow", () => {
    const shape = createBezierEdge(false, true);

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
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 60 50 C 100 50 60.00000000000001 -50 100 0 C 140 50 100 150 140 150 L 140 150",
    );
  });

  it("should create node cycle path accounting for source arrow", () => {
    const shape = createBezierEdge(true, false);

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
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 60 50 L 60 50 C 100 50 60.00000000000001 -50 100 0 C 140 50 100 150 140 150 L 150 150",
    );
  });
});
