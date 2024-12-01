import { ConnectionControllerFactory } from "../../models/options/connection-controller-factory";
import { BezierConnectionController } from "../bezier-connection-controller/bezier-connection-controller";

export const createBezierConnectionControllerFactory: (options: {
  color: string;
  width: number;
  arrowLength: number;
  arrowWidth: number;
  curvature: number;
  hasSourceArrow: boolean;
  hasTargetArrow: boolean;
}) => ConnectionControllerFactory = (options) => () =>
  new BezierConnectionController(
    options.color ?? "#5c5c5c",
    options.width ?? 1,
    options.curvature ?? 90,
    options.arrowLength ?? 15,
    options.arrowWidth ?? 4,
    options.hasSourceArrow ?? false,
    options.hasTargetArrow ?? false,
  );
