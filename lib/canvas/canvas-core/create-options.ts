import { standardCenterFn } from "@/center-fn";
import { CoreOptions } from "./core-options";
import { Options } from "./options";
import { resolveBackgroundDrawingFn } from "./resolve-background-drawing-fn";
import { resolveEdgeControllerFactory } from "./resolve-edge-controller-factory";

export const createOptions: (apiOptions: CoreOptions) => Options = (
  apiOptions: CoreOptions,
) => {
  return {
    background: {
      drawingFn: resolveBackgroundDrawingFn(
        apiOptions.background ?? { type: "none" },
      ),
    },
    nodes: {
      centerFn: apiOptions.nodes?.centerFn ?? standardCenterFn,
    },
    ports: {
      centerFn: apiOptions.ports?.centerFn ?? standardCenterFn,
    },
    edges: {
      controllerFactory: resolveEdgeControllerFactory(apiOptions.edges ?? {}),
    },
    layers: {
      mode: apiOptions.layers?.mode ?? "edges-follow-node",
    },
  };
};
