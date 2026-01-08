export interface CalculateNodeRepulsiveForceParams {
  readonly coefficient: number;
  readonly charge1: number;
  readonly charge2: number;
  readonly distance: number;
  readonly maxForce: number;
}
