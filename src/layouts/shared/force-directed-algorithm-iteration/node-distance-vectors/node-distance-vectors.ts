import { Identifier } from "@/identifier";
import { DistanceVector } from "../distance-vector";
import { Point } from "@/point";

export class NodeDistanceVectors {
  public constructor(
    private readonly coordinates: ReadonlyMap<Identifier, Point>,
    private readonly rand: () => number,
    private readonly equilibriumEdgeLength: number,
  ) {}

  public getVector(
    nodeIdFrom: Identifier,
    nodeIdTo: Identifier,
  ): DistanceVector {
    const sourceCoords = this.coordinates.get(nodeIdFrom)!;
    const targetCoords = this.coordinates.get(nodeIdTo)!;

    const dx = targetCoords.x - sourceCoords.x;
    const dy = targetCoords.y - sourceCoords.y;
    const d2 = dx * dx + dy * dy;

    if (d2 === 0) {
      const ang = this.rand() * 2 * Math.PI;

      return {
        ex: Math.cos(ang),
        ey: Math.sin(ang),
        d2: this.equilibriumEdgeLength * this.equilibriumEdgeLength,
        d: this.equilibriumEdgeLength,
      };
    }

    const d = Math.sqrt(d2);
    const ex = dx / d;
    const ey = dy / d;

    return { ex, ey, d2, d };
  }
}
