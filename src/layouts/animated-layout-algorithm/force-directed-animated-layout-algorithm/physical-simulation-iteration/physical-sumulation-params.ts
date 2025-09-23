import { Identifier } from "@/identifier";

export interface PhysicalSimulationParams {
  readonly rand: () => number;
  readonly dtSec: number;
  readonly nodeMass: number;
  readonly nodeCharge: number;
  readonly edgeEquilibriumLength: number;
  readonly edgeStiffness: number;
  readonly xFallbackResolver: (nodeId: Identifier) => number;
  readonly yFallbackResolver: (nodeId: Identifier) => number;
  readonly effectiveDistance: number;
}
