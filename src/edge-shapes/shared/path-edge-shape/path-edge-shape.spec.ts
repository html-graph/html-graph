import { describe, expect, it } from "vitest";
import { resolveArrowRenderer } from "../arrow-renderer";
import { ConnectionCategory } from "../connection-category";
import {
  BezierEdgePath,
  CycleCircleEdgePath,
  DetourBezierEdgePath,
} from "../paths";
import { PathEdgeShape } from "./path-edge-shape";

const createPathEdge = (
  hasSourceArrow: boolean,
  hasTargetArrow: boolean,
): PathEdgeShape => {
  return new PathEdgeShape({
    color: "#FFFFFF",
    width: 2,
    arrowRenderer: resolveArrowRenderer({ type: "triangle", radius: 3 }),
    arrowLength: 10,
    hasSourceArrow,
    hasTargetArrow,
    createLinePath: () =>
      new BezierEdgePath({
        from: {
          coords: { x: 0, y: 0 },
          dir: { x: 1, y: 0 },
          hasArrow: false,
        },
        to: {
          coords: { x: 0, y: 0 },
          dir: { x: 1, y: 0 },
          hasArrow: false,
        },
        arrowLength: 10,
        curvature: 90,
      }),
    createNodeCyclePath: () =>
      new DetourBezierEdgePath({
        from: {
          coords: { x: 0, y: 0 },
          dir: { x: 1, y: 0 },
          hasArrow: false,
        },
        to: {
          coords: { x: 0, y: 0 },
          dir: { x: 1, y: 0 },
          hasArrow: false,
        },
        arrowLength: 10,
        curvature: 90,
        detourDistance: 100,
        detourDir: 0,
      }),
    createPortCyclePath: () =>
      new CycleCircleEdgePath({
        from: {
          coords: { x: 0, y: 0 },
          dir: { x: 1, y: 0 },
          hasArrow: false,
        },
        to: {
          coords: { x: 0, y: 0 },
          dir: { x: 1, y: 0 },
          hasArrow: false,
        },
        radius: 10,
        smallRadius: 2,
        arrowLength: 10,
      }),
    padding: 0,
  });
};

describe("PathEdgeShape", () => {
  it("should have only line element", () => {
    const shape = createPathEdge(false, false);

    const childrenCount = shape.element.children[0].children.length;

    expect(childrenCount).toBe(1);
  });

  it("should have line and arrow element", () => {
    const shape = createPathEdge(true, false);

    const childrenCount = shape.element.children[0].children.length;

    expect(childrenCount).toBe(2);
  });

  it("should have line and 2 arrows element", () => {
    const shape = createPathEdge(true, true);

    const childrenCount = shape.element.children[0].children.length;

    expect(childrenCount).toBe(3);
  });

  it("should create path for target arrow", () => {
    const shape = createPathEdge(false, true);

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

    const g = shape.element.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 97 L 90 103 Z");
  });

  it("should create path for source arrow", () => {
    const shape = createPathEdge(true, false);

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

    const g = shape.element.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3 Z");
  });

  it("should create port cycle target arrow path", () => {
    const shape = createPathEdge(false, true);

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

    const line = shape.element.children[0].children[1];

    expect(line.getAttribute("d")).toBe("M 0 0 L 10 3 L 10 -3 Z");
  });

  it("should create node cycle target arrow path", () => {
    const shape = createPathEdge(false, true);

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

    const g = shape.element.children[0];
    const arrow = g.children[1];

    expect(arrow.getAttribute("d")).toBe("M 100 100 L 90 97 L 90 103 Z");
  });
});
