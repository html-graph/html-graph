import { AnimatedLayoutAlgorithm } from "@/animated-layout-algorithm";

export type AnimatedLayoutConfig =
  | {
      readonly type: "custom";
      readonly algorithm: AnimatedLayoutAlgorithm;
    }
  | {
      readonly type?: "forceBased";
      readonly maxTimeDeltaSec?: number;
      readonly nodeCharge?: number;
      readonly nodeMass?: number;
      readonly edgeEquilibriumLength?: number;
      readonly edgeStiffness?: number;
    }
  | undefined;
