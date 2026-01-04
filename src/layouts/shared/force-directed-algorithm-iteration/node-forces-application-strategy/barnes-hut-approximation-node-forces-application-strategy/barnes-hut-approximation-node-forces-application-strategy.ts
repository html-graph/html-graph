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

      const nodeForce = this.calculateNodeForce(coords, leaf);
      const force = forces.get(nodeId)!;

      force.x += nodeForce.x;
      force.y += nodeForce.y;
    });
  }

  private calculateNodeForce(coords: Point, leaf: QuadTreeNode): Point {
    const nodesStack: QuadTreeNode[] = [leaf];
    const visited = new Set<QuadTreeNode>([leaf]);

    const totalForce: MutablePoint = { x: 0, y: 0 };

    while (nodesStack.length > 0) {
      const current = nodesStack.pop()!;

      visited.add(current);

      const dx = coords.x - current.massCenter.x;
      const dy = coords.y - current.massCenter.y;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2);
      const isFarNode = current.box.radius * 2 < this.theta * d;

      if (isFarNode || current.nodeIds.size > 0) {
        const ex = dx / d;
        const ey = dy / d;
        const f = (this.nodeCharge * current.totalCharge) / d2;
        const fx = f * ex;
        const fy = f * ey;

        totalForce.x = fx;
        totalForce.y = fy;
      } else {
        if (current.rb !== null && !visited.has(current.rb)) {
          nodesStack.push(current.rb);
        }

        if (current.rt !== null && !visited.has(current.rt)) {
          nodesStack.push(current.rt);
        }

        if (current.lb !== null && !visited.has(current.lb)) {
          nodesStack.push(current.lb);
        }

        if (current.lt !== null && !visited.has(current.lt)) {
          nodesStack.push(current.lt);
        }
      }
    }

    return totalForce;
  }
}
