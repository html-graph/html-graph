import { Identifier } from "@/identifier";
import { Radii } from "@/radii";

export interface VirtualScrollConfig {
  readonly nodeContainingRadius: Radii;
  readonly events?: {
    readonly onBeforeNodeAttached?: (nodeId: Identifier) => void;
    readonly onAfterNodeDetached?: (nodeId: Identifier) => void;
  };
}
