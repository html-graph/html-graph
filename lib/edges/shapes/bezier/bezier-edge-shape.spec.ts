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
  return new BezierEdgeShape(
    color,
    width,
    curvature,
    arrowLength,
    arrowWidth,
    hasSourceArrow,
    hasTargetArrow,
  );
};

describe("BezierEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createBezierEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createBezierEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createBezierEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createBezierEdge(false, false);

    shape.render({
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: -1,
      fromDir: 0,
      toDir: 0,
    });

    const g = shape.svg.children[0] as SVGGElement;

    expect(g.style.transform).toBe("scale(1, -1)");
  });

  it("should create line path without arrows", () => {
    const shape = createBezierEdge(false, false);

    shape.render({
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
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
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
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
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 C 50 0, 50 100, 90 100 M 90 100 L 100 100",
    );
  });

  it("should create path for target arrow", () => {
    const shape = createBezierEdge(false, true);

    shape.render({
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 103 L 90 97");
  });

  it("should create path for source arrow", () => {
    const shape = createBezierEdge(true, false);

    shape.render({
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });
});
