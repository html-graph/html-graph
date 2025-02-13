import { BezierEdgeShape } from "@/edges/shapes";
import { createBezierEdgeShapeFactory } from "./create-bezier-edge-shape-factory";

const factory = createBezierEdgeShapeFactory({
  color: "#FFFFFF",
  width: 1,
  arrowLength: 10,
  arrowWidth: 5,
  curvature: 5,
  hasSourceArrow: false,
  hasTargetArrow: false,
  cycleRadius: 50,
  smallCycleRadius: 10,
  detourDistance: 50,
  detourDirection: -Math.PI / 2,
});

describe("createBezierEdgeShapeFactory", () => {
  it("should create bezier edge", () => {
    const edge = factory();

    expect(edge instanceof BezierEdgeShape).toBe(true);
  });
});
