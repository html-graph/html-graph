import { Point } from "@/point";

export interface OverlayNodeParams {
  readonly overlayId: unknown;
  readonly portCoords: Point;
  readonly portDirection: number;
}
