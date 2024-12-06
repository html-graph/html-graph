import { ConnectionControllerFactory } from "../connection-controller-factory";
import { StraightConnectionController } from "./straight-connection-controller";

export const createStraightConnectionControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  minPortOffset: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
}) => ConnectionControllerFactory = (options) => () =>
  new StraightConnectionController(
    options.color,
    options.width,
    options.arrowLength,
    options.arrowWidth,
    options.minPortOffset,
    options.hasSourceArrow,
    options.hasTargetArrow,
  );
