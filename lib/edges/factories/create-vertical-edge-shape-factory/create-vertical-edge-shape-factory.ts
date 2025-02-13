import {
  CycleSquareEdgeShape,
  DetourStraightEdgeShape,
  VerticalEdgeShape,
} from "../../shapes";
import { EdgeShapeFactory } from "../edge-shape-factory";
import { EdgeType } from "../edge-type";

export const createVerticalEdgeShapeFactory: (options: {
  readonly color: string;
  readonly width: number;
  readonly arrowLength: number;
  readonly arrowWidth: number;
  readonly arrowOffset: number;
  readonly hasSourceArrow: boolean;
  readonly hasTargetArrow: boolean;
  readonly cycleSquareSide: number;
  readonly roundness: number;
  readonly detourDistance: number;
  readonly detourDirection: number;
}) => EdgeShapeFactory = (options) => (edgeType: EdgeType) => {
  if (edgeType === EdgeType.PortCycle) {
    return new CycleSquareEdgeShape(
      options.color,
      options.width,
      options.arrowLength,
      options.arrowWidth,
      options.hasSourceArrow || options.hasTargetArrow,
      options.cycleSquareSide,
      options.arrowOffset,
      options.roundness,
    );
  }

  if (edgeType === EdgeType.NodeCycle) {
    return new DetourStraightEdgeShape(
      options.color,
      options.width,
      options.arrowLength,
      options.arrowWidth,
      options.arrowOffset,
      options.hasSourceArrow,
      options.hasTargetArrow,
      options.roundness,
      options.detourDistance,
      options.detourDirection,
    );
  }

  return new VerticalEdgeShape(options);
};
