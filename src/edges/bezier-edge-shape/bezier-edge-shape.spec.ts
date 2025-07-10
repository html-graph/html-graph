import { EdgeShape } from "../edge-shape";
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
    arrowWidth,
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 C 50 0, 50 100, 90 100 M 90 100 L 100 100",
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 C 50 0, 50 100, 90 100",
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 C 50 0, 50 100, 90 100 M 90 100 L 100 100",
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const line = shape.svg.children[0].children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 A 20 20 0 0 1 24.42220510185596 12 A 30 30 0 1 0 24.42220510185596 -12 A 20 20 0 0 1 10 0",
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 C 50 0 10.000000000000005 -100 50 -50 C 90 0 50 100 90 100 L 100 100",
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 C 50 0 10.000000000000005 -100 50 -50 C 90 0 50 100 90 100 L 90 100",
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
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 L 10 0 C 50 0 10.000000000000005 -100 50 -50 C 90 0 50 100 90 100 L 100 100",
    );
  });
});
