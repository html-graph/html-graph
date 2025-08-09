import { Identifier } from "@/identifier";
import { Point } from "@/point";

export interface OverlayNodeParams {
  readonly overlayId: Identifier;
  readonly portCoords: Point;
  readonly portDirection: number;
}
