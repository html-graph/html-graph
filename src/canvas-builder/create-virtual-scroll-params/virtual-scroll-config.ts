import { Identifier } from "@/identifier";
import { Radius } from "@/radius";

export interface VirtualScrollConfig {
  readonly nodeContainingRadius: Radius;
  readonly events?: {
    readonly onBeforeNodeAttached?: (nodeId: Identifier) => void;
    readonly onAfterNodeDetached?: (nodeId: Identifier) => void;
  };
}
