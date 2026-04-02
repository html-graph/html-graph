import { UserSelectableCanvasParams } from "@/configurators";
import { UserSelectableCanvasConfig } from "./user-selectable-canvas-config";
import { selectionDefaults } from "../shared";

export const createUserSelectableCanvasParams = (
  config: UserSelectableCanvasConfig,
): UserSelectableCanvasParams => {
  return {
    onCanvasSelected: config.onCanvasSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold:
      config.movementThreshold ?? selectionDefaults.movementThreshold,
  };
};
