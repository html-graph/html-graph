import { LayoutAlgorithm } from "@/layouts";
import { LayoutApplyOnParam } from "./layout-apply-on-param";

export interface LayoutParams {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: LayoutApplyOnParam;
}
