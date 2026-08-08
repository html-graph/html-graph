import { describe, expect, it } from "vitest";
import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import {
  BezierEdgeShape,
  DirectEdgeShape,
  EdgeShape,
  OrthogonalEdgeShape,
  StraightEdgeShape,
} from "@/edges";

describe("resolveEdgeShapeFactory", () => {
  it("should return bezier function by default", () => {
    const factory = resolveEdgeShapeFactory({});

    const shape = factory("123");

    expect(shape instanceof BezierEdgeShape).toBe(true);
  });

  it("should set specified functions for custom type", () => {
    const factoryFn = (): EdgeShape => new BezierEdgeShape();

    const factory = resolveEdgeShapeFactory(factoryFn);

    expect(factory).toBe(factoryFn);
  });

  it("should return straight function for straight type", () => {
    const factory = resolveEdgeShapeFactory({ type: "straight" });

    const shape = factory("123");

    expect(shape instanceof StraightEdgeShape).toBe(true);
  });

  it("should return orthogonal function for orthogonal type", () => {
    const factory = resolveEdgeShapeFactory({ type: "orthogonal" });

    const shape = factory("123");

    expect(shape instanceof OrthogonalEdgeShape).toBe(true);
  });

  it("should return direct function for direct type", () => {
    const factory = resolveEdgeShapeFactory({ type: "direct" });

    const shape = factory("123");

    expect(shape instanceof DirectEdgeShape).toBe(true);
  });
});
