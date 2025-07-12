import { Point } from "@/point";

export interface PortPayload {
  readonly overlayId: unknown;
  readonly portCoords: Point;
  readonly portDirection: number;
}
