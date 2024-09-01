import { defaultConnectionController } from "../../const/default-connection-controller/default-connection-controller";
import { ConnectionController } from "../../models/connection/connection-controller";
import { ApiOptions } from "../../models/options/api-options";
import { BackgroundDrawingFn } from "../../models/options/background-drawing-fn";
import { Options } from "../../models/options/options";
import {
  createColorBackgroundDrawingFn,
  createDotsBackgroundDrawingFn,
  createNoopBackgroundDrawingFn,
} from "../create-background-drawing-fn/create-background-drawing-fn";

export const createOptions: (apiOptions: ApiOptions) => Options = (
  apiOptions: ApiOptions,
) => {
  let drawingFn: BackgroundDrawingFn = createNoopBackgroundDrawingFn();

  switch (apiOptions?.background?.type) {
    case "custom":
      drawingFn = apiOptions.background.drawingFn;
      break;

    case "dots":
      drawingFn = createDotsBackgroundDrawingFn(
        apiOptions.background.dotColor ?? "#d8d8d8",
        apiOptions.background.dotGap ?? 25,
        apiOptions.background.dotRadius ?? 1.5,
        apiOptions.background.color ?? "#ffffff",
      );
      break;
    case "color":
      drawingFn = createColorBackgroundDrawingFn(
        apiOptions.background.color ?? "#ffffff",
      );
      break;
    default:
      break;
  }

  let controller: ConnectionController = defaultConnectionController;

  switch (apiOptions?.connections?.type) {
    case "custom":
      controller = apiOptions.connections.controller;
      break;
    default:
      break;
  }

  return {
    scale: {
      enabled: apiOptions?.scale?.enabled ?? false,
      velocity: apiOptions?.scale?.velocity ?? 1.2,
      min: apiOptions?.scale?.min ?? null,
      max: apiOptions?.scale?.max ?? null,
      trigger: apiOptions?.scale?.trigger ?? "wheel",
    },
    background: { drawingFn },
    shift: { enabled: apiOptions?.shift?.enabled ?? false },
    nodes: { draggable: apiOptions?.nodes?.draggable ?? false },
    connections: { controller },
  };
};
