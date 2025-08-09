import { Identifier } from "@/identifier";

export interface BoxHtmlViewParams {
  readonly onBeforeNodeAttached: (nodeId: Identifier) => void;
  readonly onAfterNodeDetached: (nodeId: Identifier) => void;
}
