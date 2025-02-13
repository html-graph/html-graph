import { HorizontalEdgeShape } from "@/edges/shapes";
import { createHorizontalEdgeShapeFactory } from "./create-horizontal-edge-shape-factory";

const factory = createHorizontalEdgeShapeFactory({
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

describe("createHorizontalEdgeShapeFactory", () => {
  it("should create horizontal edge", () => {
    const edge = factory();

    expect(edge instanceof HorizontalEdgeShape).toBe(true);
  });
});
