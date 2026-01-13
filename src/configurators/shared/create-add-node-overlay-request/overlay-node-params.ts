import { Identifier } from "@/identifier";
import { Point } from "@/point";

export interface OverlayNodeParams {
  readonly overlayNodeId: Identifier;
  readonly portCoords: Point;
  readonly portDirection: number;
}
