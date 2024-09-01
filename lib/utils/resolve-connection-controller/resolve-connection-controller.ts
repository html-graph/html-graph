import { BezierArrowConnectionController } from "../../const/bezier-arrow-connection-controller/bezier-arrow-connection-controller";
import { ConnectionController } from "../../models/connection/connection-controller";
import { ConnectionOptions } from "../../models/options/connection-options";

export const resolveConnectionController = (
  options: ConnectionOptions | undefined,
) => {
  let controller: ConnectionController = new BezierArrowConnectionController(
    "#5c5c5c",
  );

  switch (options?.type) {
    case "custom":
      controller = options.controller;
      break;
    default:
      break;
  }

  return controller;
};
