import { UserSelectableEdgesParams } from "@/configurators";
import { UserSelectableEdgesConfig } from "./user-selectable-edges-config";
import { selectionDefaults } from "../shared";

export const createUserSelectableEdgesParams = (
  config: UserSelectableEdgesConfig,
): UserSelectableEdgesParams => {
  return {
    onEdgeSelected: config.onEdgeSelected,
    mouseDownEventVerifier:
      config.mouseDownEventVerifier ?? selectionDefaults.mouseDownEventVerifier,
    mouseUpEventVerifier:
      config.mouseUpEventVerifier ?? selectionDefaults.mouseUpEventVerifier,
    movementThreshold:
      config.movementThreshold ?? selectionDefaults.movementThreshold,
  };
};
