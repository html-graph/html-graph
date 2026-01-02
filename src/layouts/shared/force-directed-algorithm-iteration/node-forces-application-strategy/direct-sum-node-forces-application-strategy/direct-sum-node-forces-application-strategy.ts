import { Identifier } from "@/identifier";
import { MutablePoint } from "../../../mutable-point";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { DirectSumNodeForcesApplicationStrategyParams } from "./direct-sum-node-forces-application-strategy-params";
import { NodeDistanceVectors } from "../../node-distance-vectors";
import { Point } from "@/point";

export class DirectSumNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly effectiveDistance: number;

  private readonly k: number;

  private readonly rand: () => number;

  public constructor(params: DirectSumNodeForcesApplicationStrategyParams) {
    this.effectiveDistance = params.effectiveDistance;
    this.k = params.nodeCharge * params.nodeCharge;
    this.rand = params.rand;
  }

  public apply(
    nodeCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void {
    const nodeIds = Array.from(forces.keys());

    const vectors = new NodeDistanceVectors(nodeCoords, this.rand);

    const size = nodeIds.length;

    for (let i = 0; i < size; i++) {
      const nodeIdFrom = nodeIds[i];

      for (let j = i + 1; j < size; j++) {
        const nodeIdTo = nodeIds[j];

        const vector = vectors.getVector(nodeIdFrom, nodeIdTo);

        if (vector.d > this.effectiveDistance) {
          continue;
        }

        const f = this.k / vector.d2;

        const fx = f * vector.ex;
        const fy = f * vector.ey;
        const f2x = fx / 2;
        const f2y = fy / 2;

        const forceFrom = forces.get(nodeIdFrom)!;
        const forceTo = forces.get(nodeIdTo)!;

        forceFrom.x -= f2x;
        forceFrom.y -= f2y;
        forceTo.x += f2x;
        forceTo.y += f2y;
      }
    }
  }
}
