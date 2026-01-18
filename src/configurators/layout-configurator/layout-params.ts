import { LayoutAlgorithm } from "@/layouts";
import { LayoutApplyOnParam } from "./layout-apply-on-param";
import { Identifier } from "@/identifier";

export interface LayoutParams {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: LayoutApplyOnParam;
  readonly staticNodeResolver: (nodeId: Identifier) => boolean;
  readonly onBeforeApplied: () => void;
  readonly onAfterApplied: () => void;
}
