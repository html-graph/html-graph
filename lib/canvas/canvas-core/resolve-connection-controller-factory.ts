import {
  ConnectionControllerFactory,
  createBezierConnectionControllerFactory,
  createStraightConnectionControllerFactory,
} from "../../connections";
import { ConnectionOptions } from "../connection-options";

export const resolveConnectionControllerFactory: (
  options: ConnectionOptions,
) => ConnectionControllerFactory = (options: ConnectionOptions) => {
  switch (options?.type) {
    case "custom":
      return options.controllerFactory;
    case "straight":
      return createStraightConnectionControllerFactory({
        color: options.color ?? "#5c5c5c",
        width: options.width ?? 1,
        arrowLength: options.arrowLength ?? 15,
        arrowWidth: options.arrowWidth ?? 4,
        minPortOffset: options.minPortOffset ?? 15,
        hasSourceArrow: options.hasSourceArrow ?? false,
        hasTargetArrow: options.hasTargetArrow ?? false,
      });
    default:
      return createBezierConnectionControllerFactory({
        color: options.color ?? "#5c5c5c",
        width: options.width ?? 1,
        curvature: options.curvature ?? 90,
        arrowLength: options.arrowLength ?? 15,
        arrowWidth: options.arrowWidth ?? 4,
        hasSourceArrow: options.hasSourceArrow ?? false,
        hasTargetArrow: options.hasTargetArrow ?? false,
      });
  }
};