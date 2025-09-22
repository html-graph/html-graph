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
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ex = dx / distance;
    const ey = dy / distance;

    return { ex, ey, distance };
  }
}
