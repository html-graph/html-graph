import { Identifier } from "@/identifier";

export interface AnimatedLayoutApplierParams {
  readonly staticNodeResolver: (nodeId: Identifier) => boolean;
  readonly onBeforeApplied: () => void;
  readonly onAfterApplied: () => void;
}
