import { BezierConnectionController } from "../../const/bezier-connection-controller/bezier-connection-controller";
import { ConnectionOptions } from "../../models/options/connection-options";

export const resolveConnectionControllerFactory = (
  options: ConnectionOptions,
) => {
  switch (options?.type) {
    case "custom":
      return options.controllerFactory;
    default:
      return () =>
        new BezierConnectionController(
          options.color ?? "#5c5c5c",
          options.width ?? 1,
          options.curvature ?? 90,
          options.arowLength ?? 15,
          options.arowWidth ?? 4,
          options.hasSourceArrow ?? false,
          options.hasTargetArrow ?? true,
        );
  }
};
