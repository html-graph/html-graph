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

const pi2 = Math.PI / 2;

describe("VerticalEdgeShape", () => {
  it("should create line path without arrows", () => {
    const shape = createVerticalEdge(false, false);

    shape.render({
      from: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: pi2,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 50.00000000000001 94.99999999999999 C 50.00000000000001 99.99999999999999 50.00000000000001 99.99999999999999 55.00000000000001 99.99999999999999 L 145 99.99999999999999 C 150 99.99999999999999 150 99.99999999999999 150 104.99999999999999 L 150 150",
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
        direction: pi2,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 50.00000000000001 94.99999999999999 C 50.00000000000001 99.99999999999999 50.00000000000001 99.99999999999999 55.00000000000001 99.99999999999999 L 145 99.99999999999999 C 150 99.99999999999999 150 99.99999999999999 150 104.99999999999999 L 150 139.99999999999997",
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
        direction: pi2,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.Line,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50.00000000000001 59.99999999999999 L 50.00000000000001 94.99999999999999 C 50.00000000000001 99.99999999999999 50.00000000000001 99.99999999999999 55.00000000000001 99.99999999999999 L 145 99.99999999999999 C 150 99.99999999999999 150 99.99999999999999 150 104.99999999999999 L 150 150",
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
        direction: pi2,
      },
      to: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.PortCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 50 60 M 50 60 L 50 65 C 50 70 50 70 45 70 L 5 70 C 0 70 0 70 3.552713678800501e-16 75 L 6.7501559897209515e-15 165 C 7.105427357601002e-15 170 7.105427357601002e-15 170 5.000000000000007 170 L 95 170 C 100 170 100 170 100 165 L 100 75 C 100 70 100 70 95 70 L 55 70 C 50 70 50 70 50 65 L 50 60",
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
        direction: pi2,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 50.00000000000001 65 C 50.00000000000001 70 50.00000000000001 70 55.00000000000001 70 L 245 70 C 250 70 250 70 250 75 L 250 124.99999999999997 C 250 129.99999999999997 250 129.99999999999997 245 129.99999999999997 L 155 129.99999999999997 C 150 129.99999999999997 150 129.99999999999997 150 134.99999999999997 L 150 150",
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
        direction: pi2,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50 50 L 50.00000000000001 65 C 50.00000000000001 70 50.00000000000001 70 55.00000000000001 70 L 245 70 C 250 70 250 70 250 75 L 250 124.99999999999997 C 250 129.99999999999997 250 129.99999999999997 245 129.99999999999997 L 155 129.99999999999997 C 150 129.99999999999997 150 129.99999999999997 150 134.99999999999997 L 150 139.99999999999997",
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
        direction: pi2,
      },
      to: {
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        direction: pi2,
      },
      category: ConnectionCategory.NodeCycle,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 50.00000000000001 59.99999999999999 L 50.00000000000001 65 C 50.00000000000001 70 50.00000000000001 70 55.00000000000001 70 L 245 70 C 250 70 250 70 250 75 L 250 124.99999999999997 C 250 129.99999999999997 250 129.99999999999997 245 129.99999999999997 L 155 129.99999999999997 C 150 129.99999999999997 150 129.99999999999997 150 134.99999999999997 L 150 150",
    );
  });
});
