export interface RandomFillerLayoutAlgorithmParams {
  readonly rand: () => number;
  readonly sparcity: number;
}
