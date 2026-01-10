export interface RandomFillerLayoutAlgorithmParams {
  readonly rand: () => number;
  readonly sparsity: number;
}
