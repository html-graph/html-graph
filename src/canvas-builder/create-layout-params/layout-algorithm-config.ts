import { LayoutAlgorithm } from "@/layouts";

export type LayoutAlgorithmConfig = {
  readonly type: "custom";
  readonly instance: LayoutAlgorithm;
};
