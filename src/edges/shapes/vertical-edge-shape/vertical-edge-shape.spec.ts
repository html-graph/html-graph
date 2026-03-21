import { ConnectionCategory } from "../../connection-category";
import { EdgeShape } from "../../edge-shape";
import { VerticalEdgeShape } from "./vertical-edge-shape";

const color = "#FFFFFF";
const width = 2;
const arrowLength = 10;
const arrowWidth = 3;
const arrowOffset = 10;
const roundness = 5;

const createVerticalEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new VerticalEdgeShape({
    color,
    width,
    arrowLength,
    arrowRenderer: {
      radius: arrowWidth,
    },
    arrowOffset,
    hasSourceArrow,
    hasTargetArrow,
    roundness,
    cycleSquareSide: 50,
    detourDistance: 100,
  });
};

describe("VerticalEdgeShape", () => {
  it("should create line path without arrows", () => {
    const shape = createVerticalEdge(false, false);

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
      "M 0 0 L 15 0 C 20 0 20 0 20 5 L 20 45 C 20 50 20 50 25 50 L 75 50 C 80 50 80 50 80 55 L 80 95 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createVerticalEdge(false, true);

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
      "M 0 0 L 15 0 C 20 0 20 0 20 5 L 20 45 C 20 50 20 50 25 50 L 75 50 C 80 50 80 50 80 55 L 80 95 C 80 100 80 100 85 100 L 90 100",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createVerticalEdge(true, false);

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
      "M 10 0 L 15 0 C 20 0 20 0 20 5 L 20 45 C 20 50 20 50 25 50 L 75 50 C 80 50 80 50 80 55 L 80 95 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create port cycle line path without arrows", () => {
    const shape = createVerticalEdge(false, false);

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

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 L 15 0 C 20 0 20 0 20 5 L 20 45 C 20 50 20 50 25 50 L 115 50 C 120 50 120 50 120 45 L 120 -45 C 120 -50 120 -50 115 -50 L 25 -50 C 20 -50 20 -50 20 -45 L 20 -5 C 20 0 20 0 15 0 L 10 0",
    );
  });

  it("should create node cycle line path without arrows", () => {
    const shape = createVerticalEdge(false, false);

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
      "M 0 0 L 15 0 C 20 0 20 0 25 0 L 195 0 C 200 0 200 0 200 5 L 200 95 C 200 100 200 100 195 100 L 85 100 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create node cycle line path accounting for target arrow", () => {
    const shape = createVerticalEdge(false, true);

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
      "M 0 0 L 15 0 C 20 0 20 0 25 0 L 195 0 C 200 0 200 0 200 5 L 200 95 C 200 100 200 100 195 100 L 85 100 C 80 100 80 100 85 100 L 90 100",
    );
  });

  it("should create node cycle line path accounting for source arrow", () => {
    const shape = createVerticalEdge(true, false);

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
      "M 10 0 L 15 0 C 20 0 20 0 25 0 L 195 0 C 200 0 200 0 200 5 L 200 95 C 200 100 200 100 195 100 L 85 100 C 80 100 80 100 85 100 L 100 100",
    );
  });
});
