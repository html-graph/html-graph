export interface RandomFillerLayoutAlgorithmParams {
  readonly rand: () => number;
  readonly density: number;
}
