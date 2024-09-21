import { standardCenterFn } from "../../const/standard-center-fn/standard-center-fn";
import { ApiOptions } from "../../models/options/api-options";
import { Options } from "../../models/options/options";
import { resolveBackgroundDrawingFn } from "../resolve-background-drawing-fn/resolve-background-drawing-fn";
import { resolveConnectionControllerFactory } from "../resolve-connection-controller-factory/resolve-connection-controller-factory";

export const createOptions: (apiOptions: ApiOptions) => Options = (
  apiOptions: ApiOptions,
) => {
  return {
    scale: {
      enabled: apiOptions.scale?.enabled ?? false,
      velocity: apiOptions.scale?.velocity ?? 1.2,
      min: apiOptions.scale?.min ?? null,
      max: apiOptions.scale?.max ?? null,
      trigger: apiOptions.scale?.trigger ?? "wheel",
    },
    background: {
      drawingFn: resolveBackgroundDrawingFn(apiOptions.background),
    },
    shift: { enabled: apiOptions.shift?.enabled ?? false },
    nodes: {
      draggable: apiOptions.nodes?.draggable ?? false,
      centerFn: apiOptions.nodes?.centerFn ?? standardCenterFn,
    },
    ports: {
      centerFn: apiOptions.ports?.centerFn ?? standardCenterFn,
    },
    connections: {
      controllerFactory: resolveConnectionControllerFactory(
        apiOptions.connections ?? { type: "bezier" },
      ),
    },
    layers: {
      mode: apiOptions.layers?.mode ?? "connections-follow-node",
    },
  };
};
