import {
  BezierEdgeShape,
  CycleCircleEdgeShape,
  DetourBezierEdgeShape,
} from "../../shapes";
import { EdgeShapeFactory } from "../edge-shape-factory";
import { EdgeType } from "../edge-type";

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
