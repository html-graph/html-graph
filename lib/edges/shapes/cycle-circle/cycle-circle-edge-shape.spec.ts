import { EdgeShape } from "../edge-shape";
import { CycleCircleEdgeShape } from "./cycle-circle-edge-shape";

const smallRadius = 20;
const radius = 30;
const arrowLength = 10;
const color = "#FFFFFF";
const width = 2;
const arrowWidth = 3;

const createCycleCircleEdge = (hasArrow: boolean): EdgeShape => {
  return new CycleCircleEdgeShape(
    color,
    width,
    arrowLength,
    arrowWidth,
    hasArrow,
    radius,
    smallRadius,
  );
};

describe("CycleCircleEdgeShape", () => {
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
      target: { x: 0, y: 0 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });

    const line = shape.svg.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 M 10 0 A 20 20 0 0 1 24.42220510185596 12 A 30 30 0 1 0 24.42220510185596 -12 A 20 20 0 0 1 10 0",
    );
  });

  it("should create line path accounting for arrow", () => {
    const shape = createCycleCircleEdge(true);

    shape.render({
      target: { x: 0, y: 0 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });

    const line = shape.svg.children[1];

    expect(line.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });
});
