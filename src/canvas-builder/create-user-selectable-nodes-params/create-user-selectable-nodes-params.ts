import { UserSelectableNodesParams } from "@/configurators";
import { UserSelectableNodesConfig } from "./user-selectable-nodes-config";
import {
  lmbNoCtrlMouseEventVerifier,
  selectionMovementThreshold,
} from "../shared";

export const createUserSelectableNodesParams = (
  config: UserSelectableNodesConfig,
): UserSelectableNodesParams => {
  return {
    onNodeSelected: config.onNodeSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? lmbNoCtrlMouseEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? lmbNoCtrlMouseEventVerifier,
    movementThreshold: config.movementThreshold ?? selectionMovementThreshold,
  };
};
