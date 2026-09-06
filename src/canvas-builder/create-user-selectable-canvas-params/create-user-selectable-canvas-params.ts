import { UserSelectableCanvasParams } from "@/configurators";
import { UserSelectableCanvasConfig } from "./user-selectable-canvas-config";
import {
  lmbMouseEventVerifier,
  lmbNoCtrlMouseEventVerifier,
  selectionMovementThreshold,
} from "../shared";

export const createUserSelectableCanvasParams = (
  config: UserSelectableCanvasConfig,
): UserSelectableCanvasParams => {
  return {
    onCanvasSelected: config.onCanvasSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? lmbNoCtrlMouseEventVerifier,
    mouseUpEventVerifier: config.mouseUpEventVerifier ?? lmbMouseEventVerifier,
    movementThreshold: config.movementThreshold ?? selectionMovementThreshold,
  };
};
