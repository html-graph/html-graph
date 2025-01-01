import { EdgeControllerFactory } from "./edge-controller-factory";
import { EdgeType } from "./edge-type";
import { CycleSquareEdgeController } from "./cycle-square";
import { StraightEdgeController } from "./straight";
import { DetourRoundedEdgeController } from "./detour-rounded";

export const createStraightEdgeControllerFactory: (options: {
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
}) => EdgeControllerFactory = (options) => (edgeType: EdgeType) => {
  if (edgeType === EdgeType.PortCycle) {
    return new CycleSquareEdgeController(
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
    return new DetourRoundedEdgeController(
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

  return new StraightEdgeController(
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
