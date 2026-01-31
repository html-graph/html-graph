import { LayoutAlgorithm } from "@/layouts";
import { CoordsTransformConfig } from "./resolve-layout-algorithm";

export type LayoutAlgorithmConfig =
  | {
      readonly type: "custom";
      readonly instance: LayoutAlgorithm;
    }
  | {
      readonly type: "forceDirected";
      readonly dtSec?: number | undefined;
      readonly maxIterations?: number | undefined;
      readonly seed?: string | undefined;
      readonly nodeCharge?: number | undefined;
      readonly nodeMass?: number | undefined;
      readonly edgeEquilibriumLength?: number | undefined;
      readonly edgeStiffness?: number | undefined;
      readonly convergenceVelocity?: number | undefined;
      readonly maxForce?: number | undefined;
      readonly nodeForceCoefficient?: number | undefined;
      readonly barnesHut?:
        | {
            readonly theta?: number | undefined;
            readonly areaRadiusThreshold?: number | undefined;
          }
        | undefined;
    }
  | {
      readonly type: "hierarchical";
      readonly layerWidth?: number | undefined;
      readonly layerSpace?: number | undefined;
      readonly transform?: CoordsTransformConfig | undefined;
    };
