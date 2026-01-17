import { Identifier } from "@/identifier";
import { AnimatedLayoutAlgorithmConfig } from "./animated-layout-algorithm-config";

export interface AnimatedLayoutConfig {
  readonly algorithm?: AnimatedLayoutAlgorithmConfig | undefined;
  readonly staticNodeResolver?: ((nodeId: Identifier) => boolean) | undefined;
}
