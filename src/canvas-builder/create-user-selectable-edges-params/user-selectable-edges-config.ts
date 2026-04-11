import { MouseEventVerifier } from "@/configurators";
import { Identifier } from "@/identifier";

export interface UserSelectableEdgesConfig {
  readonly onEdgeSelected: (edgeId: Identifier) => void;
  readonly mouseDownEventVerifier?: MouseEventVerifier | undefined;
  readonly mouseUpEventVerifier?: MouseEventVerifier | undefined;
  readonly movementThreshold?: number | undefined;
}
