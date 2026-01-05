import { DistanceVector } from "./distance-vector";
import { Point } from "@/point";

export class NodeDistanceVectors {
  public constructor(private readonly rand: () => number) {}

  public getVector(sourceCoords: Point, targetCoords: Point): DistanceVector {
    const dx = targetCoords.x - sourceCoords.x;
    const dy = targetCoords.y - sourceCoords.y;
    const d2 = dx * dx + dy * dy;

    if (d2 === 0) {
      const ang = this.rand() * 2 * Math.PI;

      return {
        ex: Math.cos(ang),
        ey: Math.sin(ang),
        d2: 0,
        d: 0,
      };
    }

    const d = Math.sqrt(d2);
    const ex = dx / d;
    const ey = dy / d;

    return { ex, ey, d2, d };
  }
}
