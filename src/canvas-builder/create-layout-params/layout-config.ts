import { LayoutApplyOn } from "./layout-apply-on";
import { LayoutAlgorithmConfig } from "./layout-algorithm-config";

export interface LayoutConfig {
  readonly algorithm?: LayoutAlgorithmConfig | undefined;
  readonly applyOn?: LayoutApplyOn | undefined;
}
