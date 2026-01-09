export interface CalculateNodeRepulsiveForceParams {
  readonly coefficient: number;
  readonly sourceCharge: number;
  readonly targetCharge: number;
  readonly distance: number;
  readonly maxForce: number;
}
