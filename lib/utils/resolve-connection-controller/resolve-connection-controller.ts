import { BezierAdaptiveArcConnectionController } from "../../const/arc-connection-controller/arc-connection-controller";
import { BezierConnectionController } from "../../const/bezier-connection-controller/bezier-connection-controller";
import { LineConnectionController } from "../../const/line-connection-controller/line-connection-controller";
import { ConnectionOptions } from "../../models/options/connection-options";

export const resolveConnectionController = (options: ConnectionOptions) => {
  switch (options?.type) {
    case "custom":
      return options.controller;
    case "arc":
      return new BezierAdaptiveArcConnectionController(
        options.color ?? "#5c5c5c",
        options.arowLength ?? 15,
        options.arowWidth ?? 4,
        options.hasSourceArrow ?? false,
        options.hasTargetArrow ?? true,
      );
    case "line":
      return new LineConnectionController(
        options.color ?? "#5c5c5c",
        options.arowLength ?? 15,
        options.arowWidth ?? 4,
        options.hasSourceArrow ?? false,
        options.hasTargetArrow ?? true,
      );
    default:
      return new BezierConnectionController(
        options.color ?? "#5c5c5c",
        options.curvature ?? 90,
        options.arowLength ?? 15,
        options.arowWidth ?? 4,
        options.hasSourceArrow ?? false,
        options.hasTargetArrow ?? true,
      );
  }
};
