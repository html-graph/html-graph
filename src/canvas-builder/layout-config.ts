import { LayoutAlgorithm } from "@/layout-algorithm";

export interface LayoutConfig {
  readonly algorithm: LayoutAlgorithm;
  readonly strategy: {
    readonly type: "topologyChange";
  };
}
