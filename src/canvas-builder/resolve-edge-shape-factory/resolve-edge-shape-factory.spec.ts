import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import {
  BezierEdgeShape,
  DirectEdgeShape,
  EdgeShape,
  HorizontalEdgeShape,
  StraightEdgeShape,
  VerticalEdgeShape,
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

  it("should return horizontal function for horizontal type", () => {
    const factory = resolveEdgeShapeFactory({ type: "horizontal" });

    const shape = factory("123");

    expect(shape instanceof HorizontalEdgeShape).toBe(true);
  });

  it("should return vertical function for vertical type", () => {
    const factory = resolveEdgeShapeFactory({ type: "vertical" });

    const shape = factory("123");

    expect(shape instanceof VerticalEdgeShape).toBe(true);
  });

  it("should return direct function for direct type", () => {
    const factory = resolveEdgeShapeFactory({ type: "direct" });

    const shape = factory("123");

    expect(shape instanceof DirectEdgeShape).toBe(true);
  });
});
