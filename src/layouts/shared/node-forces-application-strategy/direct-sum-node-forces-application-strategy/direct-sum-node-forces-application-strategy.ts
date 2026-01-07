import { Identifier } from "@/identifier";
import { MutablePoint } from "@/point";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { DirectSumNodeForcesApplicationStrategyParams } from "./direct-sum-node-forces-application-strategy-params";
import { Point } from "@/point";
import { DistanceVectorGenerator } from "../../../shared";

export class DirectSumNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly effectiveDistance: number;

  private readonly nodeCharge: number;

  private readonly distance: DistanceVectorGenerator;

  public constructor(params: DirectSumNodeForcesApplicationStrategyParams) {
    this.effectiveDistance = params.effectiveDistance;
    this.nodeCharge = params.nodeCharge;
    this.distance = params.distance;
  }

  public apply(
    nodesCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void {
    const nodeIds = Array.from(forces.keys());

    const size = nodeIds.length;

    for (let i = 0; i < size; i++) {
      const nodeIdFrom = nodeIds[i];

      for (let j = i + 1; j < size; j++) {
        const nodeIdTo = nodeIds[j];

        const sourceCoords = nodesCoords.get(nodeIdFrom)!;
        const targetCoords = nodesCoords.get(nodeIdTo)!;

        const vector = this.distance.create(sourceCoords, targetCoords);

        if (vector.d > this.effectiveDistance) {
          continue;
        }

        // d might be 0
        const f = (this.nodeCharge * this.nodeCharge) / (vector.d * vector.d);
        const fx = f * vector.ex;
        const fy = f * vector.ey;
        // division by 2 is incorrect
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
