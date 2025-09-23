import { LayoutAlgorithm } from "@/layouts";
import { LayoutApplyOn } from "./layout-apply-on";

export interface LayoutConfig {
  readonly algorithm: {
    readonly type: "custom";
    readonly instance: LayoutAlgorithm;
  };
  readonly applyOn: LayoutApplyOn;
}
