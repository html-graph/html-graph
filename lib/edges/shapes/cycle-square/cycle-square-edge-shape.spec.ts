import { EdgeShape } from "../edge-shape";
import { CycleSquareEdgeShape } from "./cycle-square-edge-shape";

const arrowLength = 10;
const color = "#FFFFFF";
const width = 2;
const arrowWidth = 3;
const side = 50;
const minPortOffset = 10;
const roundness = 5;

const createCycleCircleEdge = (hasArrow: boolean): EdgeShape => {
  return new CycleSquareEdgeShape(
    color,
    width,
    arrowLength,
    arrowWidth,
    hasArrow,
    side,
    minPortOffset,
    roundness,
  );
};

describe("CycleSquareEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createCycleCircleEdge(false);

    const childrenCount = shape.svg.children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createCycleCircleEdge(true);

    const childrenCount = shape.svg.children.length;

    expect(childrenCount).toBe(2);
  });

  it("should create line path without arrows", () => {
    const shape = createCycleCircleEdge(false);

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
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const line = shape.svg.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 L 15 0 C 20 0 20 0 20 5 L 20 45 C 20 50 20 50 25 50 L 115 50 C 120 50 120 50 120 45 L 120 -45 C 120 -50 120 -50 115 -50 L 25 -50 C 20 -50 20 -50 20 -45 L 20 -5 C 20 0 20 0 15 0 L 10 0",
    );
  });

  it("should create line path accounting for arrow", () => {
    const shape = createCycleCircleEdge(true);

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
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        portId: "port-1",
        nodeId: "node-1",
        direction: 0,
      },
    });

    const line = shape.svg.children[1];

    expect(line.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });
});
