import { Point } from "@/point";
import { createGraphControllerParams } from "./create-graph-controller-params";
import { standardCenterFn } from "@/center-fn";
import { standardPriorityFn } from "@/priority";
import { BezierEdgeShape, StraightEdgeShape } from "@/edges";

describe("createGraphControllerParams", () => {
  it("should return standard nodes center fn", () => {
    const graphControllerParams = createGraphControllerParams({});

    expect(graphControllerParams.nodes.centerFn).toBe(standardCenterFn);
  });

  it("should return specified nodes center fn", () => {
    const fn = (): Point => ({ x: 0, y: 0 });

    const graphControllerParams = createGraphControllerParams({
      nodes: {
        centerFn: fn,
      },
    });

    expect(graphControllerParams.nodes.centerFn).toBe(fn);
  });

  it("should return standard nodes priority fn", () => {
    const graphControllerParams = createGraphControllerParams({});

    expect(graphControllerParams.nodes.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified nodes priority fn", () => {
    const fn = (): number => 0;

    const graphControllerParams = createGraphControllerParams({
      nodes: {
        priority: fn,
      },
    });

    expect(graphControllerParams.nodes.priorityFn).toBe(fn);
  });

  it("should return standard ports direction", () => {
    const graphControllerParams = createGraphControllerParams({});

    expect(graphControllerParams.ports.direction).toBe(0);
  });

  it("should return specified ports direction", () => {
    const graphControllerParams = createGraphControllerParams({
      ports: {
        direction: Math.PI,
      },
    });

    expect(graphControllerParams.ports.direction).toBe(Math.PI);
  });

  it("should return standard edges priority fn", () => {
    const graphControllerParams = createGraphControllerParams({});

    expect(graphControllerParams.edges.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified edges priority fn", () => {
    const fn = (): number => 0;

    const graphControllerParams = createGraphControllerParams({
      edges: {
        priority: fn,
      },
    });

    expect(graphControllerParams.edges.priorityFn).toBe(fn);
  });

  it("should return standard edges shape factory", () => {
    const graphControllerParams = createGraphControllerParams({});
    const shape = graphControllerParams.edges.shapeFactory("123");

    expect(shape instanceof BezierEdgeShape).toBe(true);
  });

  it("should return specified edges shape factory", () => {
    const graphControllerParams = createGraphControllerParams({
      edges: {
        shape: {
          type: "straight",
        },
      },
    });

    const shape = graphControllerParams.edges.shapeFactory("123");

    expect(shape instanceof StraightEdgeShape).toBe(true);
  });
});
