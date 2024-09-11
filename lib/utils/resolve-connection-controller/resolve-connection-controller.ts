import { ArcAdaptiveArrowConnectionController } from "../../const/arc-adaptive-arrow-connection-controller/arc-adaptive-arrow-connection-controller";
import { BezierAdaptiveArrowConnectionController } from "../../const/bezier-adaptive-arrow-connection-controller/bezier-adaptive-arrow-connection-controller";
import { ConnectionController } from "../../models/connection/connection-controller";
import { ConnectionOptions } from "../../models/options/connection-options";

export const resolveConnectionController = (options: ConnectionOptions) => {
  let controller: ConnectionController;

  switch (options?.type) {
    case "custom":
      controller = options.controller;
      break;
    case "arc-adaptive-arrow":
      controller = new ArcAdaptiveArrowConnectionController(
        options?.color ?? "#5c5c5c",
      );
      break;
    default:
      controller = new BezierAdaptiveArrowConnectionController(
        options?.color ?? "#5c5c5c",
        options?.curvature ?? 0.4,
        options?.adaptiveCurvature ?? 1.2,
        options?.arowLength ?? 15,
        options?.arowWidth ?? 4,
      );
      break;
  }

  return controller;
};
