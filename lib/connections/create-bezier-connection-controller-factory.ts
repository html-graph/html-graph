import { BezierConnectionController } from "./bezier";
import { ConnectionControllerFactory } from "./connection-controller-factory";
import { ConnectionType } from "./connection-type";
import { CycleCircleConnectionController } from "./cycle-circle";

export const createBezierConnectionControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  curvature: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
  cycleRadius: number;
  smallCycleRadius: number;
}) => ConnectionControllerFactory =
  (options) => (connectionType: ConnectionType) => {
    if (connectionType === "cycle") {
      return new CycleCircleConnectionController(
        options.color,
        options.width,
        options.arrowLength,
        options.arrowWidth,
        options.hasSourceArrow || options.hasTargetArrow,
        options.cycleRadius,
        options.smallCycleRadius,
      );
    }

    return new BezierConnectionController(
      options.color,
      options.width,
      options.curvature,
      options.arrowLength,
      options.arrowWidth,
      options.hasSourceArrow,
      options.hasTargetArrow,
    );
  };
