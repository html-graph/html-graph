export interface DirectSumNodeForcesApplicationStrategyParams {
  readonly nodeCharge: number;
  readonly rand: () => number;
  readonly effectiveDistance: number;
  readonly equilibriumEdgeLength: number;
}
