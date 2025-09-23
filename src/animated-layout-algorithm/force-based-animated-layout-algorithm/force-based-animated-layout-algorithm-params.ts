import { Identifier } from "@/identifier";

export interface ForceBasedAnimatedLayoutAlgorithmParams {
  readonly rand: () => number;
  readonly maxTimeDeltaSec: number;
  readonly nodeMass: number;
  readonly nodeCharge: number;
  readonly edgeEquilibriumLength: number;
  readonly edgeStiffness: number;
  readonly xFallbackResolver: (nodeId: Identifier) => number;
  readonly yFallbackResolver: (nodeId: Identifier) => number;
}
