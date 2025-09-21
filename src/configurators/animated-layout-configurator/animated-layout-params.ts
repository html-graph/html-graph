import { AnimatedLayoutAlgorithm } from "@/layout-algorithm";

export interface AnimatedLayoutParams {
  readonly algorithm: AnimatedLayoutAlgorithm;
  readonly maxTimeDeltaSec: number;
}
