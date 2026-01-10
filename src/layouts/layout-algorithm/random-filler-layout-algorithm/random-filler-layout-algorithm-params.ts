export interface RandomFillerLayoutAlgorithmParams {
  readonly rand: () => number;
  readonly preferredEdgeLength: number;
}
