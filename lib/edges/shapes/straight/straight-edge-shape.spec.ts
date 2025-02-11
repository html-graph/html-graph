import { EdgeShape } from "../edge-shape";
import { StraightEdgeShape } from "./straight-edge-shape";

const color = "#FFFFFF";
const width = 2;
const arrowLength = 10;
const arrowWidth = 3;
const arrowOffset = 10;
const roundness = 5;

const createStraightEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): EdgeShape => {
  return new StraightEdgeShape(
    color,
    width,
    arrowLength,
    arrowWidth,
    arrowOffset,
    hasSourceArrow,
    hasTargetArrow,
    roundness,
  );
};

describe("StraightEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createStraightEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createStraightEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createStraightEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createStraightEdge(false, false);

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
    const shape = createStraightEdge(false, false);

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
      "M 0 0 L 15 0 C 20 0 20 0 22.572478777137633 4.287464628562721 L 77.42752122286237 95.71253537143728 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create line path accounting for target arrow", () => {
    const shape = createStraightEdge(false, true);

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
      "M 0 0 L 15 0 C 20 0 20 0 22.572478777137633 4.287464628562721 L 77.42752122286237 95.71253537143728 C 80 100 80 100 85 100 L 90 100",
    );
  });

  it("should create line path accounting for source arrow", () => {
    const shape = createStraightEdge(true, false);

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
      "M 10 0 L 15 0 C 20 0 20 0 22.572478777137633 4.287464628562721 L 77.42752122286237 95.71253537143728 C 80 100 80 100 85 100 L 100 100",
    );
  });

  it("should create path for target arrow", () => {
    const shape = createStraightEdge(false, true);

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
    const shape = createStraightEdge(true, false);

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
