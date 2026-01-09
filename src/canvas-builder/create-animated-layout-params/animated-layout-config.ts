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
        /**
         * @deprecated
         * this parameter results in slow convergence
         * use convergenceDelta instead
         */
        readonly convergenceDelta?: number;
        readonly maxForce?: number;
        readonly nodeForceCoefficient?: number;
        readonly barnesHut?: {
          readonly theta?: number;
          readonly areaRadiusThreshold?: number;
        };
      }
    | undefined;
}
