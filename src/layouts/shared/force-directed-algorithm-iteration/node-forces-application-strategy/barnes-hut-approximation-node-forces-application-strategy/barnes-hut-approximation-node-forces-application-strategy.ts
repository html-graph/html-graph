import { Identifier } from "@/identifier";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { BarnesHutApproximationNodeForcesApplicationStrategyParams } from "./barnes-hut-approximation-node-forces-application-strategy-params";
import type { Point, MutablePoint } from "@/point";

export class BarnesHutApproximationNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  public constructor(
    params: BarnesHutApproximationNodeForcesApplicationStrategyParams,
  ) {
    console.log(params);
  }

  public apply(
    nodeCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void {
    console.log(nodeCoords, forces);
  }
}
