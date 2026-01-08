export interface ForceDirectedLayoutAlgorithmParams {
  readonly dtSec: number;
  readonly maxIterations: number;
  readonly rand: () => number;
  readonly nodeMass: number;
  readonly nodeCharge: number;
  readonly edgeEquilibriumLength: number;
  readonly effectiveDistance: number;
  readonly edgeStiffness: number;
  readonly convergenceDelta: number;
  readonly maxForce: number;
  readonly minSignificantForce: number;
  readonly nodeForceCoefficient: number;
}
