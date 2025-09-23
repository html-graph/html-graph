import { AnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

export interface AnimatedLayoutConfig {
  readonly algorithm?:
    | {
        readonly type: "custom";
        readonly instance: AnimatedLayoutAlgorithm;
      }
    | {
        readonly type?: "forceBased";
        readonly maxTimeDeltaSec?: number;
        readonly nodeCharge?: number;
        readonly nodeMass?: number;
        readonly edgeEquilibriumLength?: number;
        readonly edgeStiffness?: number;
        readonly seed?: string;
        readonly effectiveDistance?: number;
      }
    | undefined;
}
