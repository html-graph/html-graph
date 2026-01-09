import { Point } from "@/point";

export interface CalculateNodeRepulsiveForceParams {
  readonly sourceCoords: Point;
  readonly targetCoords: Point;
  readonly sourceCharge: number;
  readonly targetCharge: number;
}
