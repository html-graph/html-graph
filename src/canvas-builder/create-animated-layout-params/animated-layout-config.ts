import { Identifier } from "@/identifier";
import { AnimatedLayoutAlgorithmConfig } from "./animated-layout-algorithm-config";

export interface AnimatedLayoutConfig {
  readonly algorithm?: AnimatedLayoutAlgorithmConfig | undefined;
  readonly staticNodeResolver?: ((nodeId: Identifier) => boolean) | undefined;
  readonly events?: {
    readonly onBeforeApplied?: () => void;
    readonly onAfterApplied?: () => void;
  };
}
