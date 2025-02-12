import { EdgeShape } from "../edge-shape";
import { HorizontalEdgeShape } from "./horizontal-edge-shape";

const color = "#FFFFFF";
const width = 2;
const arrowLength = 10;
const arrowWidth = 3;
const arrowOffset = 10;
const roundness = 5;

const createHorizontalEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new HorizontalEdgeShape({
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

describe("HorizontalEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createHorizontalEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createHorizontalEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createHorizontalEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createHorizontalEdge(false, false);

    shape.render({
      source: {
        x: 0,
        y: 100,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
        x: 100,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-2",
        nodeId: "node-2",
        direction: 0,
      },
    });

    const g = shape.svg.children[0] as SVGGElement;

    expect(g.style.transform).toBe("scale(1, -1)");
  });

  it("should create line path without arrows without flip x", () => {
    const shape = createHorizontalEdge(false, false);

    shape.render({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
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
      "M 0 0 L 10 0 C 15 0 15 0 20 0 L 45 0 C 50 0 50 0 50 5 L 50 45 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 50 55 L 50 95 C 50 100 50 100 55 100 L 80 100 C 85 100 85 100 90 100 L 100 100",
    );
  });

  it("should create line path without arrows with flip x", () => {
    const shape = createHorizontalEdge(false, false);

    shape.render({
      source: {
        x: 100,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
        x: 0,
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
      "M 0 0 L -10 0 C -15 0 -15 0 -17.5 0 L -17.5 0 C -20 0 -20 0 -20 5 L -20 45 C -20 50 -20 50 -15 50 L 115 50 C 120 50 120 50 120 55 L 120 95 C 120 100 120 100 117.5 100 L 117.5 100 C 115 100 115 100 110 100 L 100 100",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createHorizontalEdge(false, true);

    shape.render({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
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
      "M 0 0 L 10 0 C 15 0 15 0 20 0 L 45 0 C 50 0 50 0 50 5 L 50 45 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 50 55 L 50 95 C 50 100 50 100 55 100 L 80 100 C 85 100 85 100 90 100 L 90 100",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createHorizontalEdge(true, false);

    shape.render({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
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
      "M 10 0 L 10 0 C 15 0 15 0 20 0 L 45 0 C 50 0 50 0 50 5 L 50 45 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 50 55 L 50 95 C 50 100 50 100 55 100 L 80 100 C 85 100 85 100 90 100 L 100 100",
    );
  });

  it("should create path for target arrow", () => {
    const shape = createHorizontalEdge(false, true);

    shape.render({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
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
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 103 L 90 97");
  });

  it("should create path for source arrow", () => {
    const shape = createHorizontalEdge(true, false);

    shape.render({
      source: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
      target: {
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
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });
});
