import { ArcConnectionController } from "../../const/arc-connection-controller/arc-connection-controller";
import { BezierConnectionController } from "../../const/bezier-connection-controller/bezier-connection-controller";
import { ConnectionOptions } from "../../models/options/connection-options";

export const resolveConnectionController = (options: ConnectionOptions) => {
  switch (options?.type) {
    case "custom":
      return options.controller;
    case "arc":
      return new ArcConnectionController(options?.color ?? "#5c5c5c");
    default:
      return new BezierConnectionController(
        options?.color ?? "#5c5c5c",
        options?.curvature ?? 0.4,
        options?.arowLength ?? 15,
        options?.arowWidth ?? 4,
        options?.hasSourceArrow ?? false,
        options?.hasTargetArrow ?? true,
      );
  }
};
