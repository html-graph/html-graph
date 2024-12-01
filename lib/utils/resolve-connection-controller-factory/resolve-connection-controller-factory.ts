import { createBezierConnectionControllerFactory } from "../../const/create-bezier-connection-controller-factory/create-bezier-connection-controller-factory";
import { createStraightConnectionControllerFactory } from "../../const/create-straight-connection-controller-factory/create-straight-connection-controller-factory";
import { ConnectionControllerFactory } from "../../models/options/connection-controller-factory";
import { ConnectionOptions } from "../../models/options/connection-options";

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
