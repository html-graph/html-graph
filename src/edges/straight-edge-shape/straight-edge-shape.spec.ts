import { ConnectionCategory } from "../connection-category";
import { EdgeShape } from "../edge-shape";
import { StraightEdgeShape } from "./straight-edge-shape";

const color = "#FFFFFF";
const width = 2;
const arrowLength = 10;
const arrowWidth = 3;
const arrowOffset = 10;
const roundness = 5;

const createStraightEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new StraightEdgeShape({
    color,
    width,
    arrowLength,
    arrowWidth,
    arrowOffset,
    hasSourceArrow,
    hasTargetArrow,
    roundness,
    cycleSquareSide: 50,
    detourDistance: 100,
    detourDirection: -Math.PI / 2,
  });
};

describe("StraightEdgeShape", () => {
  it("should create line path without arrows", () => {
    const shape = createStraightEdge(false, false);

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
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 15 0 C 20 0 20 0 22.572478777137633 4.287464628562721 L 77.42752122286237 95.71253537143728 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createStraightEdge(false, true);

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
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 15 0 C 20 0 20 0 22.572478777137633 4.287464628562721 L 77.42752122286237 95.71253537143728 C 80 100 80 100 85 100 L 90 100",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createStraightEdge(true, false);

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
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 L 15 0 C 20 0 20 0 22.572478777137633 4.287464628562721 L 77.42752122286237 95.71253537143728 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create port cycle line path without arrows", () => {
    const shape = createStraightEdge(false, false);

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
      category: ConnectionCategory.PortCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 L 15 0 C 20 0 20 0 20 5 L 20 45 C 20 50 20 50 25 50 L 115 50 C 120 50 120 50 120 45 L 120 -45 C 120 -50 120 -50 115 -50 L 25 -50 C 20 -50 20 -50 20 -45 L 20 -5 C 20 0 20 0 15 0 L 10 0",
    );
  });

  it("should create node cycle line path without arrows", () => {
    const shape = createStraightEdge(false, false);

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
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 15 0 C 20 0 20 0 20 -5 L 20.000000000000007 -95 C 20.000000000000007 -100 20.000000000000007 -100 22.57247877713764 -95.71253537143728 L 77.42752122286237 -4.287464628562721 C 80 0 80 0 80 5 L 80 95 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create node cycle line path accounting for target arrow", () => {
    const shape = createStraightEdge(false, true);

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
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 15 0 C 20 0 20 0 20 -5 L 20.000000000000007 -95 C 20.000000000000007 -100 20.000000000000007 -100 22.57247877713764 -95.71253537143728 L 77.42752122286237 -4.287464628562721 C 80 0 80 0 80 5 L 80 95 C 80 100 80 100 85 100 L 90 100",
    );
  });

  it("should create node cycle line path accounting for source arrow", () => {
    const shape = createStraightEdge(true, false);

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
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 L 15 0 C 20 0 20 0 20 -5 L 20.000000000000007 -95 C 20.000000000000007 -100 20.000000000000007 -100 22.57247877713764 -95.71253537143728 L 77.42752122286237 -4.287464628562721 C 80 0 80 0 80 5 L 80 95 C 80 100 80 100 85 100 L 100 100",
    );
  });
});
