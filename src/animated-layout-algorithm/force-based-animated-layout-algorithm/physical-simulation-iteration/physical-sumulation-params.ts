import { Identifier } from "@/identifier";

export interface PhysicalSimulationParams {
  readonly nodeCharge: number;
  readonly nodeMass: number;
  readonly dtSec: number;
  readonly xFallbackResolver: (nodeId: Identifier) => number;
  readonly yFallbackResolver: (nodeId: Identifier) => number;
}
