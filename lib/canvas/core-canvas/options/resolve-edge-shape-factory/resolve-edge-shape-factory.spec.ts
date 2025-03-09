import { resolveEdgeShapeFactory } from "./resolve-edge-shape-factory";
import {
  BezierEdgeShape,
  EdgeShape,
  EdgeShapeMock,
  HorizontalEdgeShape,
  StraightEdgeShape,
  VerticalEdgeShape,
} from "@/edges";

describe("resolveEdgeShapeFactory", () => {
  it("should return bezier function by default", () => {
    const factory = resolveEdgeShapeFactory({});

    const shape = factory();

    expect(shape instanceof BezierEdgeShape).toBe(true);
  });

  it("should set specified functions for custom type", () => {
    const factoryFn = (): EdgeShape => new EdgeShapeMock();

    const factory = resolveEdgeShapeFactory(factoryFn);

    expect(factory).toBe(factoryFn);
  });

  it("should return straight function for straight type", () => {
    const factory = resolveEdgeShapeFactory({ type: "straight" });

    const shape = factory();

    expect(shape instanceof StraightEdgeShape).toBe(true);
  });

  it("should return horizontal function for horizontal type", () => {
    const factory = resolveEdgeShapeFactory({ type: "horizontal" });

    const shape = factory();

    expect(shape instanceof HorizontalEdgeShape).toBe(true);
  });

  it("should return vertical function for vertical type", () => {
    const factory = resolveEdgeShapeFactory({ type: "vertical" });

    const shape = factory();

    expect(shape instanceof VerticalEdgeShape).toBe(true);
  });
});
