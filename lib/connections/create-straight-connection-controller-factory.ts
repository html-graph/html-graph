import { ConnectionControllerFactory } from "./connection-controller-factory";
import { ConnectionType } from "./connection-type";
import { CycleSquareConnectionController } from "./cycle-square";
import { StraightConnectionController } from "./straight";

export const createStraightConnectionControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  minPortOffset: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
  cycleSquareSide: number;
  cycleGap: number;
  roundness: number;
}) => ConnectionControllerFactory =
  (options) => (connectionType: ConnectionType) => {
    if (connectionType === ConnectionType.Cycle) {
      if (connectionType === "cycle") {
        return new CycleSquareConnectionController(
          options.color,
          options.width,
          options.arrowLength,
          options.arrowWidth,
          options.hasSourceArrow || options.hasTargetArrow,
          options.cycleSquareSide,
          options.cycleGap,
          options.roundness,
        );
      }
    }

    return new StraightConnectionController(
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
