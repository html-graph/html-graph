import { DistanceVectorGenerator } from "../../distance-vector-generator";

export interface BarnesHutApproximationNodeForcesApplicationStrategyParams {
  readonly nodeForceCoefficient: number;
  readonly distance: DistanceVectorGenerator;
  readonly nodeCharge: number;
  readonly nodeMass: number;
  readonly areaRadiusThreshold: number;
  readonly theta: number;
  readonly maxForce: number;
}
