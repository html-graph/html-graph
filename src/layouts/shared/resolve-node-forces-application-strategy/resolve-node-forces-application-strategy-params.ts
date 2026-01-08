import { DistanceVectorGenerator } from "../distance-vector-generator";

export interface ResolveNodeForcesApplicationStrategyParams {
  readonly theta: number;
  readonly nodeForceCoefficient: number;
  readonly nodeCharge: number;
  readonly effectiveDistance: number;
  readonly distance: DistanceVectorGenerator;
  readonly maxForce: number;
  readonly nodeMass: number;
  readonly minAreaSize: number;
}
