import { EdgeControllerFactory } from "./edge-controller-factory";
import { EdgeType } from "./edge-type";
import { CycleSquareEdgeController } from "./cycle-square";
import { StraightEdgeController } from "./straight";

export const createStraightEdgeControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  minPortOffset: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
  cycleSquareSide: number;
  roundness: number;
}) => EdgeControllerFactory = (options) => (edgeType: EdgeType) => {
  if (edgeType === EdgeType.Cycle) {
    if (edgeType === "cycle") {
      return new CycleSquareEdgeController(
        options.color,
        options.width,
        options.arrowLength,
        options.arrowWidth,
        options.hasSourceArrow || options.hasTargetArrow,
        options.cycleSquareSide,
        options.minPortOffset,
        options.roundness,
      );
    }
  }

  return new StraightEdgeController(
    options.color,
    options.width,
    options.arrowLength,
    options.arrowWidth,
    options.minPortOffset,
    options.hasSourceArrow,
    options.hasTargetArrow,
    options.roundness,
  );
};
