import { Identifier } from "@/identifier";

export interface VirtualScrollHtmlViewParams {
  readonly onBeforeNodeAttached: (nodeId: Identifier) => void;
  readonly onAfterNodeDetached: (nodeId: Identifier) => void;
}
