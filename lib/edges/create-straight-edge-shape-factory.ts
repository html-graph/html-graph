import { EdgeShapeFactory } from "./edge-shape-factory";
import { EdgeType } from "./edge-type";
import { CycleSquareEdgeShape } from "./cycle-square";
import { StraightEdgeShape } from "./straight";
import { DetourStraightEdgeShape } from "./detour-straight";

export const createStraightEdgeShareFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  arrowOffset: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
  cycleSquareSide: number;
  roundness: number;
  detourDistance: number;
  detourDirection: number;
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

  return new StraightEdgeShape(
    options.color,
    options.width,
    options.arrowLength,
    options.arrowWidth,
    options.arrowOffset,
    options.hasSourceArrow,
    options.hasTargetArrow,
    options.roundness,
  );
};
