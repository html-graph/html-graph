import {
  BezierEdgeShape,
  DirectEdgeShape,
  OrthogonalEdgeShape,
  StraightEdgeShape,
} from "@/edges";
import { EdgeShapeConfig } from "./edge-shape-config";
import { EdgeShapeFactory } from "@/graph-controller";

export const resolveEdgeShapeFactory = (
  config: EdgeShapeConfig,
): EdgeShapeFactory => {
  if (typeof config === "function") {
    return config;
  }

  switch (config.type) {
    case "straight":
      return () =>
        new StraightEdgeShape({
          color: config.color,
          width: config.width,
          arrowLength: config.arrowLength,
          arrowOffset: config.arrowOffset,
          arrowRenderer: config.arrowRenderer,
          hasSourceArrow: config.hasSourceArrow,
          hasTargetArrow: config.hasTargetArrow,
          cycleSquareSide: config.cycleSquareSide,
          roundness: config.roundness,
          detourDistance: config.detourDistance,
          detourDirection: config.detourDirection,
        });
    case "orthogonal":
      return () =>
        new OrthogonalEdgeShape({
          color: config.color,
          width: config.width,
          arrowLength: config.arrowLength,
          arrowOffset: config.arrowOffset,
          arrowRenderer: config.arrowRenderer,
          hasSourceArrow: config.hasSourceArrow,
          hasTargetArrow: config.hasTargetArrow,
          cycleSquareSide: config.cycleSquareSide,
          roundness: config.roundness,
          detourDistance: config.detourDistance,
        });
    case "direct":
      return () =>
        new DirectEdgeShape({
          color: config.color,
          width: config.width,
          arrowLength: config.arrowLength,
          arrowRenderer: config.arrowRenderer,
          hasSourceArrow: config.hasSourceArrow,
          hasTargetArrow: config.hasTargetArrow,
          sourceOffset: config.sourceOffset,
          targetOffset: config.targetOffset,
        });
    default:
      return () =>
        new BezierEdgeShape({
          color: config.color,
          width: config.width,
          arrowLength: config.arrowLength,
          arrowRenderer: config.arrowRenderer,
          hasSourceArrow: config.hasSourceArrow,
          hasTargetArrow: config.hasTargetArrow,
          cycleRadius: config.cycleRadius,
          smallCycleRadius: config.smallCycleRadius,
          curvature: config.curvature,
          detourDistance: config.detourDistance,
          detourDirection: config.detourDirection,
        });
  }
};
