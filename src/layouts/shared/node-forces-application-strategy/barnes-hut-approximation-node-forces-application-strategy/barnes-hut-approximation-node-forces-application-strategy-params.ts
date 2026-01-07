import { DistanceVectorGenerator } from "../../distance-vector-generator";

export interface BarnesHutApproximationNodeForcesApplicationStrategyParams {
  readonly distance: DistanceVectorGenerator;
  readonly nodeCharge: number;
  readonly nodeMass: number;
  readonly minAreaSize: number;
  readonly theta: number;
}
