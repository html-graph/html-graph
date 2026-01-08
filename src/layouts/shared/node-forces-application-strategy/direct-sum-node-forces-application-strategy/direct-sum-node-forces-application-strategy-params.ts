import { DistanceVectorGenerator } from "../../distance-vector-generator";

export interface DirectSumNodeForcesApplicationStrategyParams {
  readonly nodeForceCoefficient: number;
  readonly nodeCharge: number;
  readonly effectiveDistance: number;
  readonly distance: DistanceVectorGenerator;
  readonly maxForce: number;
}
