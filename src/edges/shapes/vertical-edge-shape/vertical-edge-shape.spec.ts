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
      "M 50 50 L 68.14304661822948 95.3576165455737 C 70 100 70 100 75 100 L 125 100 C 130 100 130 100 131.85695338177052 104.6423834544263 L 150 150",
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
      "M 50 50 L 68.14304661822948 95.3576165455737 C 70 100 70 100 75 100 L 125 100 C 130 100 130 100 130.98058067569093 104.9029033784546 L 140 150",
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
      "M 60 50 L 69.01941932430908 95.0970966215454 C 70 100 70 100 75 100 L 125 100 C 130 100 130 100 131.85695338177052 104.6423834544263 L 150 150",
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
      "M 50 50 L 60 50 M 60 50 L 65 50 C 70 50 70 50 70 55 L 70 95 C 70 100 70 100 75 100 L 165 100 C 170 100 170 100 170 95 L 170 5 C 170 0 170 0 165 0 L 75 0 C 70 0 70 0 70 5 L 70 45 C 70 50 70 50 65 50 L 60 50",
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
      "M 50 50 L 65 50 C 70 50 70 50 75 50 L 225 50 C 230 50 230 50 230 55 L 230 145 C 230 150 230 150 225 150 L 135 150 C 130 150 130 150 135 150 L 150 150",
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
      "M 50 50 L 65 50 C 70 50 70 50 75 50 L 225 50 C 230 50 230 50 230 55 L 230 145 C 230 150 230 150 225 150 L 135 150 C 130 150 130 150 135 150 L 140 150",
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
      "M 60 50 L 65 50 C 70 50 70 50 75 50 L 225 50 C 230 50 230 50 230 55 L 230 145 C 230 150 230 150 225 150 L 135 150 C 130 150 130 150 135 150 L 150 150",
    );
  });
});
