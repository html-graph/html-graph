import {
  BezierEdgeShape,
  EdgeShapeFactory,
  HorizontalEdgeShape,
  StraightEdgeShape,
  VerticalEdgeShape,
} from "@/edges";
import { EdgeShape } from "../../edge-options";
import { defaultConstants } from "./default-constants";

export const resolveEdgeShapeFactory: (
  options: EdgeShape,
) => EdgeShapeFactory = (options: EdgeShape) => {
  switch (options?.type) {
    case "custom":
      return options.factory;
    case "straight":
      return () =>
        new StraightEdgeShape({
          color: options.color ?? defaultConstants.edgeColor,
          width: options.width ?? defaultConstants.edgeWidth,
          arrowLength: options.arrowLength ?? defaultConstants.edgeArrowLength,
          arrowWidth: options.arrowWidth ?? defaultConstants.edgeArrowWidth,
          arrowOffset: options.arrowOffset ?? defaultConstants.edgeArrowOffset,
          hasSourceArrow:
            options.hasSourceArrow ?? defaultConstants.hasSourceArrow,
          hasTargetArrow:
            options.hasTargetArrow ?? defaultConstants.hasTargetArrow,
          cycleSquareSide:
            options.cycleSquareSide ?? defaultConstants.cycleSize,
          roundness: options.roundness ?? defaultConstants.roundness,
          detourDistance:
            options.detourDistance ?? defaultConstants.detourDistance,
          detourDirection:
            options.detourDirection ?? defaultConstants.detourDirection,
        });
    case "horizontal":
      return () =>
        new HorizontalEdgeShape({
          color: options.color ?? defaultConstants.edgeColor,
          width: options.width ?? defaultConstants.edgeWidth,
          arrowLength: options.arrowLength ?? defaultConstants.edgeArrowLength,
          arrowWidth: options.arrowWidth ?? defaultConstants.edgeArrowWidth,
          arrowOffset: options.arrowOffset ?? defaultConstants.edgeArrowOffset,
          hasSourceArrow:
            options.hasSourceArrow ?? defaultConstants.hasSourceArrow,
          hasTargetArrow:
            options.hasTargetArrow ?? defaultConstants.hasTargetArrow,
          cycleSquareSide:
            options.cycleSquareSide ?? defaultConstants.cycleSize,
          roundness: options.roundness ?? defaultConstants.roundness,
          detourDistance:
            options.detourDistance ?? defaultConstants.detourDistance,
          detourDirection:
            options.detourDirection ?? defaultConstants.detourDirection,
        });
    case "vertical":
      return () =>
        new VerticalEdgeShape({
          color: options.color ?? defaultConstants.edgeColor,
          width: options.width ?? defaultConstants.edgeWidth,
          arrowLength: options.arrowLength ?? defaultConstants.edgeArrowLength,
          arrowWidth: options.arrowWidth ?? defaultConstants.edgeArrowWidth,
          arrowOffset: options.arrowOffset ?? defaultConstants.edgeArrowOffset,
          hasSourceArrow:
            options.hasSourceArrow ?? defaultConstants.hasSourceArrow,
          hasTargetArrow:
            options.hasTargetArrow ?? defaultConstants.hasTargetArrow,
          cycleSquareSide:
            options.cycleSquareSide ?? defaultConstants.cycleSize,
          roundness: options.roundness ?? defaultConstants.roundness,
          detourDistance:
            options.detourDistance ?? defaultConstants.detourDistance,
          detourDirection:
            options.detourDirection ?? defaultConstants.detourDirection,
        });
    default:
      return () =>
        new BezierEdgeShape({
          color: options.color ?? defaultConstants.edgeColor,
          width: options.width ?? defaultConstants.edgeWidth,
          arrowLength: options.arrowLength ?? defaultConstants.edgeArrowLength,
          arrowWidth: options.arrowWidth ?? defaultConstants.edgeArrowWidth,
          hasSourceArrow:
            options.hasSourceArrow ?? defaultConstants.hasSourceArrow,
          hasTargetArrow:
            options.hasTargetArrow ?? defaultConstants.hasTargetArrow,
          cycleRadius: options.cycleRadius ?? defaultConstants.cycleSize,
          smallCycleRadius:
            options.smallCycleRadius ?? defaultConstants.smallCycleSize,
          curvature: options.curvature ?? defaultConstants.curvature,
          detourDistance:
            options.detourDistance ?? defaultConstants.detourDistance,
          detourDirection:
            options.detourDirection ?? defaultConstants.detourDirection,
        });
  }
};
