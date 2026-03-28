import { MouseEventVerifier } from "@/configurators";
import { Identifier } from "@/identifier";

export interface UserSelectableNodesConfig {
  readonly onNodeSelected?: ((nodeId: Identifier) => void) | undefined;
  readonly mouseDownEventVerifier?: MouseEventVerifier | undefined;
  readonly mouseUpEventVerifier?: MouseEventVerifier | undefined;
  readonly movementThreshold?: number | undefined;
}
