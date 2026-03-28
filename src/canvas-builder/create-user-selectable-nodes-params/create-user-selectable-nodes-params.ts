import { UserSelectableNodesParams } from "@/configurators";
import { Canvas } from "@/canvas";
import { UserSelectableNodesConfig } from "./user-selectable-nodes-config";
import { selectionDefaults } from "../shared";

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
    onNodeSelected: config.onNodeSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold:
      config.movementThreshold ?? selectionDefaults.movementThreshold,
  };
};
