import { BezierConnectionController } from "../../const/bezier-connection-controller/bezier-connection-controller";
import { StraightConnectionController } from "../../const/straight-connection-controller/straight-connection-controller";
import { BezierConnectionOptions } from "../../models/options/bezier-connection-options";
import { ConnectionControllerFactory } from "../../models/options/connection-controller-factory";
import { ConnectionOptions } from "../../models/options/connection-options";
import { StraightConnectionOptions } from "../../models/options/straight-connection-options";

const createStraightConnectionControllerFactory =
  (options: StraightConnectionOptions) => () =>
    new StraightConnectionController(
      options.color ?? "#5c5c5c",
      options.width ?? 1,
      options.arrowLength ?? 15,
      options.arrowWidth ?? 4,
      options.minPortOffset ?? 15,
      options.hasSourceArrow ?? false,
      options.hasTargetArrow ?? false,
    );

const createBezierConnectionControllerFactory =
  (options: BezierConnectionOptions) => () =>
    new BezierConnectionController(
      options.color ?? "#5c5c5c",
      options.width ?? 1,
      options.curvature ?? 90,
      options.arrowLength ?? 15,
      options.arrowWidth ?? 4,
      options.hasSourceArrow ?? false,
      options.hasTargetArrow ?? false,
    );

export const resolveConnectionControllerFactory: (
  options: ConnectionOptions,
) => ConnectionControllerFactory = (options: ConnectionOptions) => {
  switch (options?.type) {
    case "custom":
      return options.controllerFactory;
    case "straight":
      return createStraightConnectionControllerFactory(options);
    default:
      return createBezierConnectionControllerFactory(options);
  }
};
