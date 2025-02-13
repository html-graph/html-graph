import { StraightEdgeShape } from "@/edges/shapes";
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
  it("should create straight edge", () => {
    const edge = factory();

    expect(edge instanceof StraightEdgeShape).toBe(true);
  });
});
