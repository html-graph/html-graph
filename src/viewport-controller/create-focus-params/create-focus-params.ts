import { FocusConfig } from "../focus-config";
import { ViewportControllerParams } from "../viewport-controller-params";
import { FocusParams } from "./focus-params";

export const createFocusParams = (
  config: FocusConfig,
  controllerParams: ViewportControllerParams,
): FocusParams => {
  return Symbol.iterator in config
    ? {
        minContentScale: controllerParams.focus.minContentScale,
        nodes: config,
        contentOffset: controllerParams.focus.contentOffset,
      }
    : {
        minContentScale:
          config.minContentScale ?? controllerParams.focus.minContentScale,
        nodes: config.nodes ?? [],
        contentOffset:
          config.contentOffset ?? controllerParams.focus.contentOffset,
      };
};
