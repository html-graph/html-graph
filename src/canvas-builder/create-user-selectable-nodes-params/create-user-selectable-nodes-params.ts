import { UserSelectableNodesParams } from "@/configurators";
import { Canvas } from "@/canvas";
import { defaults } from "./defaults";
import { UserSelectableNodesConfig } from "./user-selectable-nodes-config";

export const createUserSelectableNodesParams = (
  canvas: Canvas,
  element: HTMLElement,
  window: Window,
  config: UserSelectableNodesConfig,
): UserSelectableNodesParams => {
  return {
    canvas,
    element,
    window,
    onNodeSelected: config.onNodeSelected ?? defaults.onNodeSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? defaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaults.mouseUpEventVerifier,
    movementThreshold: config.movementThreshold ?? defaults.movementThreshold,
  };
};
