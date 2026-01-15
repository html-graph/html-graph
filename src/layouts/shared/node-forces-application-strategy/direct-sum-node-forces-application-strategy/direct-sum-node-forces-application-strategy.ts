import { Identifier } from "@/identifier";
import { MutablePoint, Point } from "@/point";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { DirectSumNodeForcesApplicationStrategyParams } from "./direct-sum-node-forces-application-strategy-params";
import { DistanceVectorGenerator } from "../../distance-vector-generator";
import { calculateNodeRepulsiveForce } from "../../calculate-node-repulsive-force";

export class DirectSumNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly nodeCharge: number;

  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  private readonly maxForce: number;

  public constructor(params: DirectSumNodeForcesApplicationStrategyParams) {
    this.nodeCharge = params.nodeCharge;
    this.distanceVectorGenerator = params.distanceVectorGenerator;
    this.maxForce = params.maxForce;
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

        const vector = this.distanceVectorGenerator.create(
          sourceCoords,
          targetCoords,
        );

        const f = calculateNodeRepulsiveForce({
          coefficient: 1,
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          distance: vector.d,
          maxForce: this.maxForce,
        });

        const fx = f * vector.ex;
        const fy = f * vector.ey;
        const forceFrom = forces.get(nodeIdFrom)!;
        const forceTo = forces.get(nodeIdTo)!;

        forceFrom.x -= fx;
        forceFrom.y -= fy;
        forceTo.x += fx;
        forceTo.y += fy;
      }
    }
  }
}
