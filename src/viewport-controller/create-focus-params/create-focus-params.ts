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
        contentPadding: controllerParams.focus.contentPadding,
        animationDuration: controllerParams.focus.animationDuration,
      }
    : {
        minContentScale:
          config.minContentScale ?? controllerParams.focus.minContentScale,
        nodes: config.nodes ?? [],
        contentPadding:
          config.contentPadding ??
          config.contentOffset ??
          controllerParams.focus.contentPadding,
        animationDuration:
          config.animationDuration ?? controllerParams.focus.animationDuration,
      };
};
