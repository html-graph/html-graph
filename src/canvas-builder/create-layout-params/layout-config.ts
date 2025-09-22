import { LayoutAlgorithm } from "@/layout-algorithm";
import { LayoutApplyOn } from "./layout-apply-on";

export interface LayoutConfig {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: LayoutApplyOn;
}
