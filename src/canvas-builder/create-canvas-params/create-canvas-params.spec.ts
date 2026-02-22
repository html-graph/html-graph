import { Point } from "@/point";
import { createCanvasParams } from "./create-canvas-params";
import { standardCenterFn } from "@/center-fn";
import { standardPriorityFn } from "@/priority";
import { BezierEdgeShape, StraightEdgeShape } from "@/edges";

describe("createCanvasParams", () => {
  it("should return standard nodes center fn", () => {
    const { graphControllerParams } = createCanvasParams({});

    expect(graphControllerParams.nodes.centerFn).toBe(standardCenterFn);
  });

  it("should return specified nodes center fn", () => {
    const fn = (): Point => ({ x: 0, y: 0 });

    const { graphControllerParams } = createCanvasParams({
      nodes: {
        centerFn: fn,
      },
    });

    expect(graphControllerParams.nodes.centerFn).toBe(fn);
  });

  it("should return standard nodes priority fn", () => {
    const { graphControllerParams } = createCanvasParams({});

    expect(graphControllerParams.nodes.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified nodes priority fn", () => {
    const fn = (): number => 0;

    const { graphControllerParams } = createCanvasParams({
      nodes: {
        priority: fn,
      },
    });

    expect(graphControllerParams.nodes.priorityFn).toBe(fn);
  });

  it("should return standard ports direction", () => {
    const { graphControllerParams } = createCanvasParams({});

    expect(graphControllerParams.ports.direction).toBe(0);
  });

  it("should return specified ports direction", () => {
    const { graphControllerParams } = createCanvasParams({
      ports: {
        direction: Math.PI,
      },
    });

    expect(graphControllerParams.ports.direction).toBe(Math.PI);
  });

  it("should return standard edges priority fn", () => {
    const { graphControllerParams } = createCanvasParams({});

    expect(graphControllerParams.edges.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified edges priority fn", () => {
    const fn = (): number => 0;

    const { graphControllerParams } = createCanvasParams({
      edges: {
        priority: fn,
      },
    });

    expect(graphControllerParams.edges.priorityFn).toBe(fn);
  });

  it("should return standard edges shape factory", () => {
    const { graphControllerParams } = createCanvasParams({});
    const shape = graphControllerParams.edges.shapeFactory("123");

    expect(shape instanceof BezierEdgeShape).toBe(true);
  });

  it("should return specified edges shape factory", () => {
    const { graphControllerParams } = createCanvasParams({
      edges: {
        shape: {
          type: "straight",
        },
      },
    });

    const shape = graphControllerParams.edges.shapeFactory("123");

    expect(shape instanceof StraightEdgeShape).toBe(true);
  });

  it("should return default focus content offset", () => {
    const { viewportControllerParams } = createCanvasParams({});

    expect(viewportControllerParams.focus.contentOffset).toBe(100);
  });

  it("should return specified focus content offset", () => {
    const { viewportControllerParams } = createCanvasParams({
      focus: {
        contentOffset: 200,
      },
    });

    expect(viewportControllerParams.focus.contentOffset).toBe(200);
  });

  it("should return default minimum content scale", () => {
    const { viewportControllerParams } = createCanvasParams({});

    expect(viewportControllerParams.focus.minContentScale).toBe(0);
  });

  it("should return specified minimum content scale", () => {
    const { viewportControllerParams } = createCanvasParams({
      focus: {
        minContentScale: 0.25,
      },
    });

    expect(viewportControllerParams.focus.minContentScale).toBe(0.25);
  });
});
