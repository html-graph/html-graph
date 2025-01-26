import {
  CycleSquareEdgeShape,
  DetourStraightEdgeShape,
  StraightEdgeShape,
} from "@/edges/shapes";
import { EdgeType } from "../edge-type";
import { createStraightEdgeShareFactory } from "./create-straight-edge-shape-factory";

const factory = createStraightEdgeShareFactory({
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

describe("createStraightEdgeShapeFactory", () => {
  it("should create cycle square port cycle edge", () => {
    const edge = factory(EdgeType.PortCycle);

    expect(edge instanceof CycleSquareEdgeShape).toBe(true);
  });

  it("should create detour straight node cycle edge", () => {
    const edge = factory(EdgeType.NodeCycle);

    expect(edge instanceof DetourStraightEdgeShape).toBe(true);
  });

  it("should create straight edge", () => {
    const edge = factory(EdgeType.Regular);

    expect(edge instanceof StraightEdgeShape).toBe(true);
  });
});
