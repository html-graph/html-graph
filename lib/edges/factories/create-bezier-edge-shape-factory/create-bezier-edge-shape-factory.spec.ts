import {
  BezierEdgeShape,
  CycleCircleEdgeShape,
  DetourBezierEdgeShape,
} from "@/edges/shapes";
import { EdgeType } from "../edge-type";
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
  it("should create bezier port cycle edge", () => {
    const edge = factory(EdgeType.PortCycle);

    expect(edge instanceof CycleCircleEdgeShape).toBe(true);
  });

  it("should create bezier node cycle edge", () => {
    const edge = factory(EdgeType.NodeCycle);

    expect(edge instanceof DetourBezierEdgeShape).toBe(true);
  });

  it("should create bezier edge", () => {
    const edge = factory(EdgeType.Regular);

    expect(edge instanceof BezierEdgeShape).toBe(true);
  });
});
