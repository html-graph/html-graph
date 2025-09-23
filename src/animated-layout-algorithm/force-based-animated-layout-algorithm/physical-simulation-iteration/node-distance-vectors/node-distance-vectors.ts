import { Identifier } from "@/identifier";
import { DistanceVector } from "./distance-vector";
import { Point } from "@/point";

export class NodeDistanceVectors {
  public constructor(
    private readonly coordinates: ReadonlyMap<Identifier, Point>,
  ) {}

  public getVector(
    nodeIdFrom: Identifier,
    nodeIdTo: Identifier,
  ): DistanceVector {
    const nodeFrom = this.coordinates.get(nodeIdFrom)!;
    const nodeTo = this.coordinates.get(nodeIdTo)!;

    const dx = nodeTo.x - nodeFrom.x;
    const dy = nodeTo.y - nodeFrom.y;
    const d2 = dx * dx + dy * dy;

    if (d2 === 0) {
      return { ex: 1, ey: 0, d2: 1, d: 1 };
    }

    const d = Math.sqrt(d2);
    const ex = dx / d;
    const ey = dy / d;

    return { ex, ey, d2, d };
  }
}
