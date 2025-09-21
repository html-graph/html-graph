import { AnimatedLayoutAlgorithm } from "@/layout-algorithm";

export interface AnimatedLayoutConfig {
  readonly algorithm: AnimatedLayoutAlgorithm;
  readonly maxTimeDeltaSec?: number | undefined;
}
