import { LayoutApplyOn } from "./layout-apply-on";
import { LayoutAlgorithmConfig } from "./layout-algorithm-config";
import { Identifier } from "@/identifier";

export interface LayoutConfig {
  readonly algorithm?: LayoutAlgorithmConfig | undefined;
  readonly applyOn?: LayoutApplyOn | undefined;
  readonly staticNodeResolver?: (nodeId: Identifier) => boolean;
  readonly onBeforeApplied?: () => void;
  readonly onAfterApplied?: () => void;
}
