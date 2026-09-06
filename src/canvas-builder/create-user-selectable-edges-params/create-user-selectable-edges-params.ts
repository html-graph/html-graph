import { UserSelectableEdgesParams } from "@/configurators";
import { UserSelectableEdgesConfig } from "./user-selectable-edges-config";
import {
  lmbNoCtrlMouseEventVerifier,
  selectionMovementThreshold,
} from "../shared";

export const createUserSelectableEdgesParams = (
  config: UserSelectableEdgesConfig,
): UserSelectableEdgesParams => {
  return {
    onEdgeSelected: config.onEdgeSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? lmbNoCtrlMouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? lmbNoCtrlMouseEventVerifier,
    movementThreshold: config.movementThreshold ?? selectionMovementThreshold,
  };
};
