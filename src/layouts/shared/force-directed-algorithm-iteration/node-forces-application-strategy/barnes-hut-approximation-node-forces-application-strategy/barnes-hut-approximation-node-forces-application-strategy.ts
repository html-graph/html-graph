import { Identifier } from "@/identifier";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { BarnesHutApproximationNodeForcesApplicationStrategyParams } from "./barnes-hut-approximation-node-forces-application-strategy-params";
import type { Point, MutablePoint } from "@/point";
import { createAreaBox } from "./create-area-box";
import { QuadTree, QuadTreeNode } from "./quad-tree";

export class BarnesHutApproximationNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly minAreaSize: number;

  private readonly nodeMass: number;

  private readonly nodeCharge: number;

  private readonly theta: number;

  public constructor(
    params: BarnesHutApproximationNodeForcesApplicationStrategyParams,
  ) {
    this.minAreaSize = params.minAreaSize;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;
    this.theta = params.theta;
  }

  public apply(
    nodeCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void {
    const box = createAreaBox(nodeCoords);

    const tree = new QuadTree({
      box,
      coords: nodeCoords,
      minAreaSize: this.minAreaSize,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge,
    });

    nodeCoords.forEach((coords, nodeId) => {
      const leaf = tree.getLeaf(nodeId)!;

      let current: QuadTreeNode | null = leaf;

      while (current !== null) {
        const parent: QuadTreeNode | null = current.parent;

        if (parent !== null) {
          const dx = parent.massCenter.x - coords.x;
          const dy = parent.massCenter.y - coords.y;
          const distance = dx * dx + dy * dy;

          if (parent.box.radius / distance < this.theta) {
            // far nodes
          } else {
            // near nodes
          }
        }

        current = parent;
      }
    });

    console.log(forces);
  }
}
