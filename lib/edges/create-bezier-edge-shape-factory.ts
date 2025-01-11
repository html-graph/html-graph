import { BezierEdgeShape } from "./bezier";
import { EdgeShapeFactory } from "./edge-shape-factory";
import { EdgeType } from "./edge-type";
import { CycleCircleEdgeShape } from "./cycle-circle";
import { DetourBezierEdgeShape } from "./detour-bezier";

export const createBezierEdgeShapeFactory: (options: {
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
}) => EdgeShapeFactory = (options) => (edgeType: EdgeType) => {
  if (edgeType === EdgeType.PortCycle) {
    return new CycleCircleEdgeShape(
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
    return new DetourBezierEdgeShape(
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

  return new BezierEdgeShape(
    options.color,
    options.width,
    options.curvature,
    options.arrowLength,
    options.arrowWidth,
    options.hasSourceArrow,
    options.hasTargetArrow,
  );
};
