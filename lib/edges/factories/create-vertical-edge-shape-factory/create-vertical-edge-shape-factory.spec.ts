import {
  CycleSquareEdgeShape,
  DetourStraightEdgeShape,
  VerticalEdgeShape,
} from "@/edges/shapes";
import { EdgeType } from "../edge-type";
import { createVerticalEdgeShapeFactory } from "./create-vertical-edge-shape-factory";

const factory = createVerticalEdgeShapeFactory({
  color: "#FFFFFF",
  width: 1,
  arrowLength: 10,
  arrowWidth: 5,
  arrowOffset: 5,
  hasSourceArrow: false,
  hasTargetArrow: false,
  cycleSquareSide: 50,
  roundness: 5,
  detourDistance: 50,
  detourDirection: -Math.PI / 2,
});

describe("createVerticalEdgeShapeFactory", () => {
  it("should create cycle square port cycle edge", () => {
    const edge = factory(EdgeType.PortCycle);

    expect(edge instanceof CycleSquareEdgeShape).toBe(true);
  });

  it("should create detour straight node cycle edge", () => {
    const edge = factory(EdgeType.NodeCycle);

    expect(edge instanceof DetourStraightEdgeShape).toBe(true);
  });

  it("should create vertical edge", () => {
    const edge = factory(EdgeType.Regular);

    expect(edge instanceof VerticalEdgeShape).toBe(true);
  });
});
