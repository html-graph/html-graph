import { UserSelectableCanvasParams } from "@/configurators";
import { Canvas } from "@/canvas";
import { UserSelectableCanvasConfig } from "./user-selectable-canvas-config";
import { selectionDefaults } from "../shared";

export const createUserSelectableCanvasParams = (
  canvas: Canvas,
  element: HTMLElement,
  window: Window,
  config: UserSelectableCanvasConfig,
): UserSelectableCanvasParams => {
  return {
    canvas,
    element,
    window,
    onCanvasSelected: config.onCanvasSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold:
      config.movementThreshold ?? selectionDefaults.movementThreshold,
  };
};
