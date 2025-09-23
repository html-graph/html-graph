export interface PhysicalSimulationParams {
  readonly rand: () => number;
  readonly dtSec: number;
  readonly nodeMass: number;
  readonly nodeCharge: number;
  readonly edgeEquilibriumLength: number;
  readonly edgeStiffness: number;
  readonly effectiveDistance: number;
}
