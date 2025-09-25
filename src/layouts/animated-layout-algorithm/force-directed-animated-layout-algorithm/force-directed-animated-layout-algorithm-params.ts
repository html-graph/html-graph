export interface ForceDirectedAnimatedLayoutAlgorithmParams {
  readonly rand: () => number;
  readonly maxTimeDeltaSec: number;
  readonly nodeMass: number;
  readonly nodeCharge: number;
  readonly edgeEquilibriumLength: number;
  readonly effectiveDistance: number;
  readonly edgeStiffness: number;
}
