import { Identifier } from "@/identifier";
import { MouseEventVerifier } from "../shared";

export interface UserSelectableEdgesParams {
  readonly onEdgeSelected: (edgeId: Identifier) => void;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly movementThreshold: number;
}
