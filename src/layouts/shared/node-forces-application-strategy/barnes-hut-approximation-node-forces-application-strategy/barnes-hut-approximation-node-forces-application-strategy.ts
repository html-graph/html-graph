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
    nodesCoords: ReadonlyMap<Identifier, Point>,
    forces: ReadonlyMap<Identifier, MutablePoint>,
  ): void {
    const box = createAreaBox(nodesCoords);

    const tree = new QuadTree({
      box,
      coords: nodesCoords,
      minAreaSize: this.minAreaSize,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge,
    });

    nodesCoords.forEach((_coords, nodeId) => {
      const nodeForce = this.calculateForceForNode(
        tree.getRoot(),
        nodesCoords,
        nodeId,
      );
      const force = forces.get(nodeId)!;

      force.x += nodeForce.x;
      force.y += nodeForce.y;
    });
  }

  private calculateForceForNode(
    root: QuadTreeNode,
    nodesCoords: ReadonlyMap<Identifier, Point>,
    targetNodeId: Identifier,
  ): Point {
    const targetNodeCoords = nodesCoords.get(targetNodeId)!;
    const nodesStack: QuadTreeNode[] = [root];
    const totalForce: MutablePoint = { x: 0, y: 0 };

    while (nodesStack.length > 0) {
      const current = nodesStack.pop()!;

      const dx = targetNodeCoords.x - current.massCenter.x;
      const dy = targetNodeCoords.y - current.massCenter.y;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2);
      const isFarNode = current.box.radius * 2 < this.theta * d;

      if (isFarNode) {
        const ex = dx / d;
        const ey = dy / d;
        const f = (this.nodeCharge * current.totalCharge) / d2;
        const fx = f * ex;
        const fy = f * ey;

        totalForce.x += fx;
        totalForce.y += fy;
      } else if (current.nodeIds.size > 0) {
        current.nodeIds.forEach((nodeId) => {
          if (nodeId === targetNodeId) {
            return;
          }

          const nodeCoords = nodesCoords.get(nodeId)!;
          const dx = targetNodeCoords.x - nodeCoords.x;
          const dy = targetNodeCoords.y - nodeCoords.y;
          const d2 = dx * dx + dy * dy;

          if (d2 === 0) {
            return;
          }

          const d = Math.sqrt(d2);
          const ex = dx / d;
          const ey = dy / d;
          const f = (this.nodeCharge * this.nodeCharge) / d2;
          const fx = f * ex;
          const fy = f * ey;

          totalForce.x += fx;
          totalForce.y += fy;
        });
      } else {
        if (current.rb !== null) {
          nodesStack.push(current.rb);
        }

        if (current.rt !== null) {
          nodesStack.push(current.rt);
        }

        if (current.lb !== null) {
          nodesStack.push(current.lb);
        }

        if (current.lt !== null) {
          nodesStack.push(current.lt);
        }
      }
    }

    return totalForce;
  }
}
