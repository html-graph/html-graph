import { BezierEdgeController } from "./bezier";
import { EdgeControllerFactory } from "./edge-controller-factory";
import { EdgeType } from "./edge-type";
import { CycleCircleEdgeController } from "./cycle-circle";
import { DetourBezierEdgeController } from "./detour-bezier";

export const createBezierEdgeControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  curvature: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
  cycleRadius: number;
  smallCycleRadius: number;
  detourDistance: number;
  detourDirection: number;
}) => EdgeControllerFactory = (options) => (edgeType: EdgeType) => {
  if (edgeType === EdgeType.PortCycle) {
    return new CycleCircleEdgeController(
      options.color,
      options.width,
      options.arrowLength,
      options.arrowWidth,
      options.hasSourceArrow || options.hasTargetArrow,
      options.cycleRadius,
      options.smallCycleRadius,
    );
  }

  if (edgeType === EdgeType.NodeCycle) {
    return new DetourBezierEdgeController(
      options.color,
      options.width,
      options.curvature,
      options.arrowLength,
      options.arrowWidth,
      options.hasSourceArrow,
      options.hasTargetArrow,
      options.detourDistance,
      options.detourDirection,
    );
  }

  return new BezierEdgeController(
    options.color,
    options.width,
    options.curvature,
    options.arrowLength,
    options.arrowWidth,
    options.hasSourceArrow,
    options.hasTargetArrow,
  );
};
