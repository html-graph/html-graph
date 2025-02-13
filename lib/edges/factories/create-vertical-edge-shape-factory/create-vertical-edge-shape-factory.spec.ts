import { VerticalEdgeShape } from "@/edges/shapes";
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
  it("should create vertical edge", () => {
    const edge = factory();

    expect(edge instanceof VerticalEdgeShape).toBe(true);
  });
});
