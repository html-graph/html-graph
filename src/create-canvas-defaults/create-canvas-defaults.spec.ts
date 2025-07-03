import { Point } from "@/point";
import { createCanvasDefaults } from "./create-canvas-defaults";
import { standardCenterFn } from "@/center-fn";
import { standardPriorityFn } from "@/priority";
import { BezierEdgeShape, StraightEdgeShape } from "@/edges";

describe("createCanvasDefaults", () => {
  it("should return standard nodes center fn", () => {
    const options = createCanvasDefaults({});

    expect(options.nodes.centerFn).toBe(standardCenterFn);
  });

  it("should return specified nodes center fn", () => {
    const fn = (): Point => ({ x: 0, y: 0 });

    const options = createCanvasDefaults({
      nodes: {
        centerFn: fn,
      },
    });

    expect(options.nodes.centerFn).toBe(fn);
  });

  it("should return standard nodes priority fn", () => {
    const options = createCanvasDefaults({});

    expect(options.nodes.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified nodes priority fn", () => {
    const fn = (): number => 0;

    const options = createCanvasDefaults({
      nodes: {
        priority: fn,
      },
    });

    expect(options.nodes.priorityFn).toBe(fn);
  });

  it("should return standard ports direction", () => {
    const options = createCanvasDefaults({});

    expect(options.ports.direction).toBe(0);
  });

  it("should return specified ports direction", () => {
    const options = createCanvasDefaults({
      ports: {
        direction: Math.PI,
      },
    });

    expect(options.ports.direction).toBe(Math.PI);
  });

  it("should return standard edges priority fn", () => {
    const options = createCanvasDefaults({});

    expect(options.edges.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified edges priority fn", () => {
    const fn = (): number => 0;

    const options = createCanvasDefaults({
      edges: {
        priority: fn,
      },
    });

    expect(options.edges.priorityFn).toBe(fn);
  });

  it("should return standard edges shape factory", () => {
    const options = createCanvasDefaults({});
    const shape = options.edges.shapeFactory("123");

    expect(shape instanceof BezierEdgeShape).toBe(true);
  });

  it("should return specified edges shape factory", () => {
    const options = createCanvasDefaults({
      edges: {
        shape: {
          type: "straight",
        },
      },
    });

    const shape = options.edges.shapeFactory("123");

    expect(shape instanceof StraightEdgeShape).toBe(true);
  });
});
