import { DistanceVectorGenerator } from "../distance-vector-generator";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";

export interface ForceDirectedAlgorithmIterationParams {
  readonly distanceVectorGenerator: DistanceVectorGenerator;
  readonly nodeForcesApplicationStrategy: NodeForcesApplicationStrategy;
  readonly dtSec: number;
  readonly nodeMass: number;
  readonly edgeEquilibriumLength: number;
  readonly edgeStiffness: number;
}
