import { Identifier } from "@/identifier";

export interface LayoutApplierParams {
  readonly staticNodeResolver: (nodeId: Identifier) => boolean;
  readonly onBeforeApplied: () => void;
  readonly onAfterApplied: () => void;
}
