import { EdgeShape } from "../edge-shape";
import { DetourStraightEdgeShape } from "./detour-straight-edge-shape";

const color = "#FFFFFF";
const width = 2;
const arrowOffset = 10;
const arrowLength = 10;
const arrowWidth = 3;
const detourDistance = 100;
const detourDirection = -Math.PI / 2;
const roundness = 5;

const createDetourStraightEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new DetourStraightEdgeShape(
    color,
    width,
    arrowLength,
    arrowWidth,
    arrowOffset,
    hasSourceArrow,
    hasTargetArrow,
    roundness,
    detourDistance,
    detourDirection,
  );
};

describe("DetourStraightEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createDetourStraightEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createDetourStraightEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createDetourStraightEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createDetourStraightEdge(false, false);

    shape.render({ x: 100, y: 100 }, 1, -1, 0, 0);

    const g = shape.svg.children[0] as SVGGElement;

    expect(g.style.transform).toBe("scale(1, -1)");
  });

  it("should create line path without arrows", () => {
    const shape = createDetourStraightEdge(false, false);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 15 0 C 20 0 20 0 20 -5 L 20.000000000000007 -95 C 20.000000000000007 -100 20.000000000000007 -100 22.57247877713764 -95.71253537143728 L 77.42752122286237 -4.287464628562721 C 80 0 80 0 80 5 L 80 95 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createDetourStraightEdge(false, true);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 0 0 L 15 0 C 20 0 20 0 20 -5 L 20.000000000000007 -95 C 20.000000000000007 -100 20.000000000000007 -100 22.57247877713764 -95.71253537143728 L 77.42752122286237 -4.287464628562721 C 80 0 80 0 80 5 L 80 95 C 80 100 80 100 85 100 L 90 100",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createDetourStraightEdge(true, false);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 L 15 0 C 20 0 20 0 20 -5 L 20.000000000000007 -95 C 20.000000000000007 -100 20.000000000000007 -100 22.57247877713764 -95.71253537143728 L 77.42752122286237 -4.287464628562721 C 80 0 80 0 80 5 L 80 95 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create path for target arrow", () => {
    const shape = createDetourStraightEdge(false, true);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 103 L 90 97");
  });

  it("should create path for source arrow", () => {
    const shape = createDetourStraightEdge(true, false);

    shape.render({ x: 100, y: 100 }, 1, 1, 0, 0);

    const g = shape.svg.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3");
  });
});
