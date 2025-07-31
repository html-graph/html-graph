import { ConnectionCategory } from "../connection-category";
import { EdgeShape } from "../edge-shape";
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
    arrowWidth,
    arrowOffset,
    hasSourceArrow,
    hasTargetArrow,
    roundness,
    cycleSquareSide: 50,
    detourDistance: 100,
  });
};

describe("VerticalEdgeShape", () => {
  it("should create line path without arrows without flip y", () => {
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
      "M 0 0 L 10 0 C 15 0 15 0 15 5 L 15 45 C 15 50 15 50 20 50 L 45 50 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 55 50 L 80 50 C 85 50 85 50 85 55 L 85 95 C 85 100 85 100 90 100 L 100 100",
    );
  });

  it("should create line path without arrows with flip y", () => {
    const shape = createVerticalEdge(false, false);

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

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 C 15 0 15 0 15 -5 L 15 -15 C 15 -20 15 -20 20 -20 L 45 -20 C 50 -20 50 -20 50 -15 L 50 115 C 50 120 50 120 55 120 L 80 120 C 85 120 85 120 85 115 L 85 105 C 85 100 85 100 90 100 L 100 100",
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
      "M 0 0 L 10 0 C 15 0 15 0 15 5 L 15 45 C 15 50 15 50 20 50 L 45 50 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 55 50 L 80 50 C 85 50 85 50 85 55 L 85 95 C 85 100 85 100 90 100 L 90 100",
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
      "M 10 0 L 10 0 C 15 0 15 0 15 5 L 15 45 C 15 50 15 50 20 50 L 45 50 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 55 50 L 80 50 C 85 50 85 50 85 55 L 85 95 C 85 100 85 100 90 100 L 100 100",
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
