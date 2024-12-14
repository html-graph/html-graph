import {
  BezierConnectionController,
  CycleBezierConnectionController,
} from "./bezier";
import { ConnectionControllerFactory } from "./connection-controller-factory";
import { ConnectionType } from "./connection-type";

export const createBezierConnectionControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  curvature: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
  cycleRadius: number;
}) => ConnectionControllerFactory =
  (options) => (connectionType: ConnectionType) => {
    if (connectionType === "cycle") {
      return new CycleBezierConnectionController(
        options.color,
        options.width,
        options.arrowLength,
        options.arrowWidth,
        options.hasSourceArrow || options.hasTargetArrow,
        options.cycleRadius,
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
