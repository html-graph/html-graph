import { UserSelectableEdgesParams } from "@/configurators";
import { UserSelectableEdgesConfig } from "./user-selectable-edges-config";
import {
  lmbMouseEventVerifier,
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
    mouseUpEventVerifier: config.mouseUpEventVerifier ?? lmbMouseEventVerifier,
    movementThreshold: config.movementThreshold ?? selectionMovementThreshold,
  };
};
