import { UserSelectableNodesParams } from "@/configurators";
import { UserSelectableNodesConfig } from "./user-selectable-nodes-config";
import { selectionDefaults } from "../shared";

export const createUserSelectableNodesParams = (
  config: UserSelectableNodesConfig,
): UserSelectableNodesParams => {
  return {
    onNodeSelected: config.onNodeSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold:
      config.movementThreshold ?? selectionDefaults.movementThreshold,
  };
};
