import { LayoutAlgorithm } from "@/layouts";

export type LayoutAlgorithmConfig =
  | {
      readonly type: "custom";
      readonly instance: LayoutAlgorithm;
    }
  | {
      readonly type: "forceDirected";
      readonly dtSec?: number;
      readonly maxIterations?: number;
      readonly seed?: string;
      readonly nodeCharge?: number;
      readonly nodeMass?: number;
      readonly edgeEquilibriumLength?: number;
      readonly edgeStiffness?: number;
      readonly convergenceVelocity?: number;
      readonly maxForce?: number;
      readonly nodeForceCoefficient?: number;
      readonly barnesHut?: {
        readonly theta?: number;
        readonly areaRadiusThreshold?: number;
      };
    }
  | {
      readonly type: "hierarchical";
      readonly layerWidth?: number;
      readonly layerSpace?: number;
    };
