import { Identifier } from "@/identifier";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { BarnesHutApproximationNodeForcesApplicationStrategyParams } from "./barnes-hut-approximation-node-forces-application-strategy-params";
import type { Point, MutablePoint } from "@/point";
import { createAreaBox } from "./create-area-box";
import { QuadTree, QuadTreeNode } from "./quad-tree";
import { DistanceVectorGenerator } from "../../distance-vector-generator";
import { calculateNodeRepulsiveForce } from "../../calculate-node-repulsive-force";

export class BarnesHutApproximationNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly minAreaSize: number;

  private readonly nodeMass: number;

  private readonly nodeCharge: number;

  private readonly theta: number;

  private readonly distance: DistanceVectorGenerator;

  private readonly nodeForceCoefficient: number;

  private readonly maxForce: number;

  public constructor(
    params: BarnesHutApproximationNodeForcesApplicationStrategyParams,
  ) {
    this.minAreaSize = params.minAreaSize;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;
    this.theta = params.theta;
    this.distance = params.distance;
    this.nodeForceCoefficient = params.nodeForceCoefficient;
    this.maxForce = params.maxForce;
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
        tree.getLeaf(nodeId)!,
        nodeId,
        nodesCoords,
      );
      const force = forces.get(nodeId)!;

      force.x += nodeForce.x;
      force.y += nodeForce.y;
    });
  }

  private calculateForceForNode(
    leaf: QuadTreeNode,
    targetNodeId: Identifier,
    nodesCoords: ReadonlyMap<Identifier, Point>,
  ): Point {
    const targetNodeCoords = nodesCoords.get(targetNodeId)!;
    const totalForce: MutablePoint = { x: 0, y: 0 };

    let current: QuadTreeNode | null = leaf;

    while (current !== null) {
      const parent: QuadTreeNode | null = current.parent;

      if (parent !== null) {
        const vector = this.distance.create(
          parent.massCenter,
          targetNodeCoords,
        );
        const isFar = parent.box.radius * 2 < vector.d * this.theta;

        if (isFar) {
          //
        } else {
          if (parent.rt !== null && parent.rt !== current) {
            const rtVector = this.distance.create(
              parent.rt.massCenter,
              targetNodeCoords,
            );

            const f = calculateNodeRepulsiveForce({
              coefficient: this.nodeForceCoefficient,
              charge1: this.nodeCharge,
              charge2: parent.rt.totalCharge,
              distance: rtVector.d,
              maxForce: this.maxForce,
            });

            totalForce.x += f * rtVector.ex;
            totalForce.y += f * rtVector.ey;
          }
        }
      }

      current = current.parent;
    }

    return totalForce;
  }
}
