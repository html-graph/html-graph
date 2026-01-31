import { LayoutApplyOn } from "./layout-apply-on";
import { Identifier } from "@/identifier";
import { LayoutAlgorithmConfig } from "./resolve-layout-algorithm";

export interface LayoutConfig {
  readonly algorithm?: LayoutAlgorithmConfig | undefined;
  readonly applyOn?: LayoutApplyOn | undefined;
  readonly staticNodeResolver?: (nodeId: Identifier) => boolean;
  readonly events?: {
    readonly onBeforeApplied?: () => void;
    readonly onAfterApplied?: () => void;
  };
}
