import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export interface UserSelectableNodesParams {
  readonly onNodeSelected: (nodeId: Identifier) => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly movementThreshold: number;
}
