import { LayoutAlgorithm } from "@/layout-algorithm";
import { LayourApplyOnParam } from "./layout-apply-on-param";

export interface LayoutParams {
  readonly algorithm: LayoutAlgorithm;
  readonly applyOn: LayourApplyOnParam;
}
