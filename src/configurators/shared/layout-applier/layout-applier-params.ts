import { Identifier } from "@/identifier";

export interface LayoutApplierParams {
  readonly staticNodeResolver: (nodeId: Identifier) => boolean;
}
