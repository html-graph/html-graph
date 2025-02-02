import { Point } from "@/point";
import { createOptions } from "./create-options";
import { standardCenterFn } from "@/center-fn";
import { standardPriorityFn } from "@/priority";
import { BezierEdgeShape, EdgeType, StraightEdgeShape } from "@/edges";

describe("createOptions", () => {
  it("should return standard nodes center fn", () => {
    const options = createOptions({});

    expect(options.nodes.centerFn).toBe(standardCenterFn);
  });

  it("should return specified nodes center fn", () => {
    const fn = (): Point => ({ x: 0, y: 0 });

    const options = createOptions({
      nodes: {
        centerFn: fn,
      },
    });

    expect(options.nodes.centerFn).toBe(fn);
  });

  it("should return standard nodes priority fn", () => {
    const options = createOptions({});

    expect(options.nodes.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified nodes priority fn", () => {
    const fn = (): number => 0;

    const options = createOptions({
      nodes: {
        priority: fn,
      },
    });

    expect(options.nodes.priorityFn).toBe(fn);
  });

  it("should return standard ports center fn", () => {
    const options = createOptions({});

    expect(options.ports.centerFn).toBe(standardCenterFn);
  });

  it("should return specified nodes center fn", () => {
    const fn = (): Point => ({ x: 0, y: 0 });

    const options = createOptions({
      ports: {
        centerFn: fn,
      },
    });

    expect(options.ports.centerFn).toBe(fn);
  });

  it("should return standard ports direction", () => {
    const options = createOptions({});

    expect(options.ports.direction).toBe(0);
  });

  it("should return specified ports direction", () => {
    const options = createOptions({
      ports: {
        direction: Math.PI,
      },
    });

    expect(options.ports.direction).toBe(Math.PI);
  });

  it("should return standard edges priority fn", () => {
    const options = createOptions({});

    expect(options.edges.priorityFn).toBe(standardPriorityFn);
  });

  it("should return specified edges priority fn", () => {
    const fn = (): number => 0;

    const options = createOptions({
      edges: {
        priority: fn,
      },
    });

    expect(options.edges.priorityFn).toBe(fn);
  });

  it("should return standard edges shape factory", () => {
    const options = createOptions({});
    const shape = options.edges.shapeFactory(EdgeType.Regular);

    expect(shape instanceof BezierEdgeShape).toBe(true);
  });

  it("should return specified edges shape factory", () => {
    const options = createOptions({
      edges: {
        shape: {
          type: "straight",
        },
      },
    });

    const shape = options.edges.shapeFactory(EdgeType.Regular);

    expect(shape instanceof StraightEdgeShape).toBe(true);
  });
});
