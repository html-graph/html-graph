import {
  EdgeControllerFactory,
  createBezierEdgeControllerFactory,
  createHorizontalEdgeControllerFactory,
  createStraightEdgeControllerFactory,
  createVerticalEdgeControllerFactory,
} from "@/edges";
import { EdgeOptions } from "../canvas/edge-options";

export const resolveEdgeControllerFactory: (
  options: EdgeOptions,
) => EdgeControllerFactory = (options: EdgeOptions) => {
  switch (options?.type) {
    case "custom":
      return options.controllerFactory;
    case "straight":
      return createStraightEdgeControllerFactory({
        color: options.color ?? "#5c5c5c",
        width: options.width ?? 1,
        arrowLength: options.arrowLength ?? 15,
        arrowWidth: options.arrowWidth ?? 4,
        arrowOffset: options.arrowOffset ?? 15,
        hasSourceArrow: options.hasSourceArrow ?? false,
        hasTargetArrow: options.hasTargetArrow ?? false,
        cycleSquareSide: options.cycleSquareSide ?? 30,
        roundness: options.roundness ?? 10,
        detourDistance: options.detourDistance ?? 100,
        detourDirection: options.detourDirection ?? -Math.PI / 2,
      });
    case "horizontal":
      return createHorizontalEdgeControllerFactory({
        color: options.color ?? "#5c5c5c",
        width: options.width ?? 1,
        arrowLength: options.arrowLength ?? 15,
        arrowWidth: options.arrowWidth ?? 4,
        arrowOffset: options.arrowOffset ?? 15,
        hasSourceArrow: options.hasSourceArrow ?? false,
        hasTargetArrow: options.hasTargetArrow ?? false,
        cycleSquareSide: options.cycleSquareSide ?? 30,
        roundness: options.roundness ?? 10,
        detourDistance: options.detourDistance ?? 100,
        detourDirection: options.detourDirection ?? -Math.PI / 2,
      });
    case "vertical":
      return createVerticalEdgeControllerFactory({
        color: options.color ?? "#5c5c5c",
        width: options.width ?? 1,
        arrowLength: options.arrowLength ?? 15,
        arrowWidth: options.arrowWidth ?? 4,
        arrowOffset: options.arrowOffset ?? 15,
        hasSourceArrow: options.hasSourceArrow ?? false,
        hasTargetArrow: options.hasTargetArrow ?? false,
        cycleSquareSide: options.cycleSquareSide ?? 30,
        roundness: options.roundness ?? 10,
        detourDistance: options.detourDistance ?? 100,
        detourDirection: options.detourDirection ?? -Math.PI / 2,
      });
    default:
      return createBezierEdgeControllerFactory({
        color: options.color ?? "#5c5c5c",
        width: options.width ?? 1,
        curvature: options.curvature ?? 90,
        arrowLength: options.arrowLength ?? 15,
        arrowWidth: options.arrowWidth ?? 4,
        hasSourceArrow: options.hasSourceArrow ?? false,
        hasTargetArrow: options.hasTargetArrow ?? false,
        cycleRadius: options.cycleRadius ?? 30,
        smallCycleRadius: options.smallCycleRadius ?? 15,
        detourDistance: options.detourDistance ?? 100,
        detourDirection: options.detourDirection ?? -Math.PI / 2,
      });
  }
};
