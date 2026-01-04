export interface BarnesHutApproximationNodeForcesApplicationStrategyParams {
  readonly nodeCharge: number;
  readonly nodeMass: number;
  readonly minAreaSize: number;
  readonly rand: () => number;
  readonly theta: number;
}
