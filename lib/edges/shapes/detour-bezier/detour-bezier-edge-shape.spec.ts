import { EdgeShape } from "../edge-shape";
import { DetourBezierEdgeShape } from "./detour-bezier-edge-shape";

const color = "#FFFFFF";
const width = 2;
const curvature = 40;
const arrowLength = 10;
const arrowWidth = 3;
const detourDistance = 100;
const detourDirection = -Math.PI / 2;

const createDetourBezierEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new DetourBezierEdgeShape(
    color,
    width,
    curvature,
    arrowLength,
    arrowWidth,
    hasSourceArrow,
    hasTargetArrow,
    detourDistance,
    detourDirection,
  );
};

describe("DetourBezierEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createDetourBezierEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createDetourBezierEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createDetourBezierEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createDetourBezierEdge(false, false);

    shape.render({ x: 100, y: 100 }, 1, -1, 0, 0);

    const g = shape.svg.children[0] as SVGGElement;

    expect(g.style.transform).toBe("scale(1, -1)");
  });

  it("should create line path without arrows", () => {
    const shape = createDetourBezierEdge(false, false);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 C 50 0 10.000000000000005 -100 50 -50 C 90 0 50 100 90 100 L 100 100",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createDetourBezierEdge(false, true);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 10 0 C 50 0 10.000000000000005 -100 50 -50 C 90 0 50 100 90 100 L 90 100",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createDetourBezierEdge(true, false);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 L 10 0 C 50 0 10.000000000000005 -100 50 -50 C 90 0 50 100 90 100 L 100 100",
    );
  });

  it("should create path for target arrow", () => {
    const shape = createDetourBezierEdge(false, true);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 103 L 90 97");
  });

  it("should create path for source arrow", () => {
    const shape = createDetourBezierEdge(true, false);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });
});
