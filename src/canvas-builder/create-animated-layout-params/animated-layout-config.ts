import { Identifier } from "@/identifier";
import { AnimatedLayoutAlgorithm } from "@/layouts";

export interface AnimatedLayoutConfig {
  readonly algorithm?:
    | {
        readonly type: "custom";
        readonly instance: AnimatedLayoutAlgorithm;
      }
    | {
        readonly type?: "forceDirected";
        readonly maxTimeDeltaSec?: number;
        readonly nodeCharge?: number;
        readonly nodeMass?: number;
        readonly edgeEquilibriumLength?: number;
        readonly edgeStiffness?: number;
        readonly seed?: string;
        readonly effectiveDistance?: number;
        readonly xFallbackResolver?: (nodeId: Identifier) => number;
        readonly yFallbackResolver?: (nodeId: Identifier) => number;
      }
    | undefined;
}
