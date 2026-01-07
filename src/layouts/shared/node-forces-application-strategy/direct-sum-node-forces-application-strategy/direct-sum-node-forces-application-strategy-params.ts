import { DistanceVectorGenerator } from "../../distance-vector-generator";

export interface DirectSumNodeForcesApplicationStrategyParams {
  readonly nodeCharge: number;
  readonly effectiveDistance: number;
  readonly distance: DistanceVectorGenerator;
}
