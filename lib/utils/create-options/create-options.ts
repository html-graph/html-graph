import { standardCenterFn } from "../../const/standard-center-fn/standard-center-fn";
import { CoreOptions } from "../../models/options/core-options";
import { Options } from "../../models/options/options";
import { resolveBackgroundDrawingFn } from "../resolve-background-drawing-fn/resolve-background-drawing-fn";
import { resolveConnectionControllerFactory } from "../resolve-connection-controller-factory/resolve-connection-controller-factory";

export const createOptions: (apiOptions: CoreOptions) => Options = (
  apiOptions: CoreOptions,
) => {
  return {
    background: {
      drawingFn: resolveBackgroundDrawingFn(apiOptions.background),
    },
    nodes: {
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
