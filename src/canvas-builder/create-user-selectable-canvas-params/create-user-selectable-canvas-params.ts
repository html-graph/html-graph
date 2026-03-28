import { UserSelectableCanvasParams } from "@/configurators";
import { Canvas } from "@/canvas";
import { defaults } from "./defaults";
import { UserSelectableCanvasConfig } from "./user-selectable-canvas-config";

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
      config.mouseDownEventVerifier ?? defaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? defaults.mouseUpEventVerifier,
    movementThreshold: config.movementThreshold ?? defaults.movementThreshold,
  };
};
