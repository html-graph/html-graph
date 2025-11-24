import { LayoutAlgorithm } from "@/layouts";

export type LayoutAlgorithmConfig =
  | {
      readonly type: "custom";
      readonly instance: LayoutAlgorithm;
    }
  | {
      readonly type: "forceDirected";
      readonly dtSec: number;
      readonly maxIterations: number;
      readonly seed: string;
      readonly maxTimeDeltaSec: number;
      readonly nodeCharge: number;
      readonly nodeMass: number;
      readonly edgeEquilibriumLength: number;
      readonly edgeStiffness: number;
      readonly effectiveDistance: number;
    };
