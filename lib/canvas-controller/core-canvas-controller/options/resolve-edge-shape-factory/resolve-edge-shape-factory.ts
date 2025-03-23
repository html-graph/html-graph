import {
  BezierEdgeShape,
  HorizontalEdgeShape,
  StraightEdgeShape,
  VerticalEdgeShape,
} from "@/edges";
import { EdgeShapeConfig } from "../edge-shape-config";
import { EdgeShapeFactory } from "../edge-shape-factory";

export const resolveEdgeShapeFactory: (
  options: EdgeShapeConfig,
) => EdgeShapeFactory = (options: EdgeShapeConfig) => {
  if (typeof options === "function") {
    return options;
  }

  switch (options?.type) {
    case "straight":
      return () =>
        new StraightEdgeShape({
          color: options.color,
          width: options.width,
          arrowLength: options.arrowLength,
          arrowWidth: options.arrowWidth,
          arrowOffset: options.arrowOffset,
          hasSourceArrow: options.hasSourceArrow,
          hasTargetArrow: options.hasTargetArrow,
          cycleSquareSide: options.cycleSquareSide,
          roundness: options.roundness,
          detourDistance: options.detourDistance,
          detourDirection: options.detourDirection,
        });
    case "horizontal":
      return () =>
        new HorizontalEdgeShape({
          color: options.color,
          width: options.width,
          arrowLength: options.arrowLength,
          arrowWidth: options.arrowWidth,
          arrowOffset: options.arrowOffset,
          hasSourceArrow: options.hasSourceArrow,
          hasTargetArrow: options.hasTargetArrow,
          cycleSquareSide: options.cycleSquareSide,
          roundness: options.roundness,
          detourDistance: options.detourDistance,
          detourDirection: options.detourDirection,
        });
    case "vertical":
      return () =>
        new VerticalEdgeShape({
          color: options.color,
          width: options.width,
          arrowLength: options.arrowLength,
          arrowWidth: options.arrowWidth,
          arrowOffset: options.arrowOffset,
          hasSourceArrow: options.hasSourceArrow,
          hasTargetArrow: options.hasTargetArrow,
          cycleSquareSide: options.cycleSquareSide,
          roundness: options.roundness,
          detourDistance: options.detourDistance,
          detourDirection: options.detourDirection,
        });
    default:
      return () =>
        new BezierEdgeShape({
          color: options.color,
          width: options.width,
          arrowLength: options.arrowLength,
          arrowWidth: options.arrowWidth,
          hasSourceArrow: options.hasSourceArrow,
          hasTargetArrow: options.hasTargetArrow,
          cycleRadius: options.cycleRadius,
          smallCycleRadius: options.smallCycleRadius,
          curvature: options.curvature,
          detourDistance: options.detourDistance,
          detourDirection: options.detourDirection,
        });
  }
};
