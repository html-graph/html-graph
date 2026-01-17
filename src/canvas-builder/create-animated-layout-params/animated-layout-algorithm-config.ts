import { AnimatedLayoutAlgorithm } from "@/layouts";

export type AnimatedLayoutAlgorithmConfig =
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
      readonly convergenceVelocity?: number;
      readonly maxForce?: number;
      readonly nodeForceCoefficient?: number;
      readonly barnesHut?: {
        readonly theta?: number;
        readonly areaRadiusThreshold?: number;
      };
    };
