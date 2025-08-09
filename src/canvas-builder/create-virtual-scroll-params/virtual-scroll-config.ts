import { Identifier } from "@/identifier";

export interface VirtualScrollConfig {
  readonly nodeContainingRadius: {
    readonly vertical: number;
    readonly horizontal: number;
  };
  readonly events?: {
    readonly onBeforeNodeAttached?: (nodeId: Identifier) => void;
    readonly onAfterNodeDetached?: (nodeId: Identifier) => void;
  };
}
