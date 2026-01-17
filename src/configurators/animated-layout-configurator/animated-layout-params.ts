import { Identifier } from "@/identifier";
import { AnimatedLayoutAlgorithm } from "@/layouts";

export interface AnimatedLayoutParams {
  readonly algorithm: AnimatedLayoutAlgorithm;
  readonly staticNodeResolver: (nodeId: Identifier) => boolean;
}
