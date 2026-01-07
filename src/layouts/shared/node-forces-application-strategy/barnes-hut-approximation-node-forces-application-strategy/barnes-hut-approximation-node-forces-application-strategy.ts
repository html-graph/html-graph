import { Identifier } from "@/identifier";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { BarnesHutApproximationNodeForcesApplicationStrategyParams } from "./barnes-hut-approximation-node-forces-application-strategy-params";
import type { Point, MutablePoint } from "@/point";
import { createAreaBox } from "./create-area-box";
import { QuadTree, QuadTreeNode } from "./quad-tree";
import { DistanceVectorGenerator } from "../../distance-vector-generator";

export class BarnesHutApproximationNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly minAreaSize: number;

  private readonly nodeMass: number;

  private readonly nodeCharge: number;

  private readonly theta: number;

  private readonly distance: DistanceVectorGenerator;

  public constructor(
    params: BarnesHutApproximationNodeForcesApplicationStrategyParams,
  ) {
    this.minAreaSize = params.minAreaSize;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;
    this.theta = params.theta;
    this.distance = params.distance;
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

      const vector = this.distance.create(current.massCenter, targetNodeCoords);

      const isFarNode = current.box.radius * 2 < this.theta * vector.d;

      if (isFarNode) {
        const f =
          (this.nodeCharge * current.totalCharge) / (vector.d * vector.d);
        const fx = f * vector.ex;
        const fy = f * vector.ey;

        totalForce.x += fx;
        totalForce.y += fy;
      } else if (current.nodeIds.size > 0) {
        current.nodeIds.forEach((nodeId) => {
          if (nodeId === targetNodeId) {
            return;
          }

          const nodeCoords = nodesCoords.get(nodeId)!;
          const localVector = this.distance.create(
            nodeCoords,
            targetNodeCoords,
          );

          // d might be 0
          const f =
            (this.nodeCharge * this.nodeCharge) /
            (localVector.d * localVector.d);
          const fx = f * localVector.ex;
          const fy = f * localVector.ey;

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
