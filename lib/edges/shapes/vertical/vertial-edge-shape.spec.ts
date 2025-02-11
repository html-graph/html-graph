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
  return new VerticalEdgeShape(
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

describe("VerticalEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createVerticalEdge(false, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createVerticalEdge(true, false);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createVerticalEdge(true, true);

    const childrenCount = shape.svg.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should apply specified mirroring to group", () => {
    const shape = createVerticalEdge(false, false);

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

  it("should create line path without arrows without flip y", () => {
    const shape = createVerticalEdge(false, false);

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
      "M 0 0 L 10 0 C 15 0 15 0 15 5 L 15 45 C 15 50 15 50 20 50 L 45 50 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 55 50 L 80 50 C 85 50 85 50 85 55 L 85 95 C 85 100 85 100 90 100 L 100 100",
    );
  });

  it("should create line path without arrows with flip y", () => {
    const shape = createVerticalEdge(false, false);

    shape.render({
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: -1,
      fromDir: 0,
      toDir: 0,
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
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
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
      target: { x: 100, y: 100 },
      flipX: 1,
      flipY: 1,
      fromDir: 0,
      toDir: 0,
    });

    const g = shape.svg.children[0];
    const line = g.children[0];

    expect(line.getAttribute("d")).toBe(
      "M 10 0 L 10 0 C 15 0 15 0 15 5 L 15 45 C 15 50 15 50 20 50 L 45 50 C 50 50 50 50 50 50 L 50 50 C 50 50 50 50 55 50 L 80 50 C 85 50 85 50 85 55 L 85 95 C 85 100 85 100 90 100 L 100 100",
    );
  });

  it("should create path for target arrow", () => {
    const shape = createVerticalEdge(false, true);

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
    const shape = createVerticalEdge(true, false);

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
