import { Identifier } from "@/identifier";
import { NodeForcesApplicationStrategy } from "../node-forces-application-strategy";
import { BarnesHutApproximationNodeForcesApplicationStrategyParams } from "./barnes-hut-approximation-node-forces-application-strategy-params";
import type { Point, MutablePoint } from "@/point";
import { createAreaBox } from "./create-area-box";
import { QuadTree, QuadTreeNode } from "./quad-tree";
import { DistanceVectorGenerator } from "../../distance-vector-generator";
import { calculateNodeRepulsiveForce } from "../../calculate-node-repulsive-force";
import { CalculateNodeRepulsiveForceParams } from "./calculate-node-repulsive-force-params";

export class BarnesHutApproximationNodeForcesApplicationStrategy
  implements NodeForcesApplicationStrategy
{
  private readonly areaRadiusThreshold: number;

  private readonly nodeMass: number;

  private readonly nodeCharge: number;

  private readonly theta: number;

  private readonly distanceVectorGenerator: DistanceVectorGenerator;

  private readonly nodeForceCoefficient: number;

  private readonly maxForce: number;

  public constructor(
    params: BarnesHutApproximationNodeForcesApplicationStrategyParams,
  ) {
    this.areaRadiusThreshold = params.areaRadiusThreshold;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;
    this.theta = params.theta;
    this.distanceVectorGenerator = params.distanceVectorGenerator;
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
      areaRadiusThreshold: this.areaRadiusThreshold,
      nodeMass: this.nodeMass,
      nodeCharge: this.nodeCharge,
    });

    nodesCoords.forEach((_coords, nodeId) => {
      const force = this.calculateForceForNode(
        tree.getLeaf(nodeId)!,
        nodeId,
        nodesCoords,
      );

      const totalForce = forces.get(nodeId)!;
      this.applyForce(totalForce, force);
    });
  }

  private calculateForceForNode(
    leaf: QuadTreeNode,
    targetNodeId: Identifier,
    nodesCoords: ReadonlyMap<Identifier, Point>,
  ): Point {
    const targetCoords = nodesCoords.get(targetNodeId)!;
    const totalForce: MutablePoint = { x: 0, y: 0 };

    leaf.nodeIds.forEach((nodeId) => {
      if (nodeId !== targetNodeId) {
        const sourceCoords = nodesCoords.get(nodeId)!;

        const force = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords,
          targetCoords,
        });

        this.applyForce(totalForce, force);
      }
    });

    let current: QuadTreeNode | null = leaf;

    while (current !== null) {
      const parent: QuadTreeNode | null = current.parent;

      if (parent !== null) {
        const vector = this.distanceVectorGenerator.create(
          parent.massCenter,
          targetCoords,
        );
        const isFar = parent.box.radius * 2 < vector.d * this.theta;

        if (isFar) {
          this.tryApplyFarForce(totalForce, targetCoords, parent.lb, current);
          this.tryApplyFarForce(totalForce, targetCoords, parent.rb, current);
          this.tryApplyFarForce(totalForce, targetCoords, parent.rt, current);
          this.tryApplyFarForce(totalForce, targetCoords, parent.lt, current);
        } else {
          this.tryApplyNearForce(
            totalForce,
            targetCoords,
            parent.lb,
            current,
            nodesCoords,
          );
          this.tryApplyNearForce(
            totalForce,
            targetCoords,
            parent.rb,
            current,
            nodesCoords,
          );
          this.tryApplyNearForce(
            totalForce,
            targetCoords,
            parent.rt,
            current,
            nodesCoords,
          );
          this.tryApplyNearForce(
            totalForce,
            targetCoords,
            parent.lt,
            current,
            nodesCoords,
          );
        }
      }

      current = current.parent;
    }

    return totalForce;
  }

  private calculateExactForce(
    root: QuadTreeNode,
    targetCoords: Point,
    nodesCoords: ReadonlyMap<Identifier, Point>,
  ): Point {
    const totalForce: MutablePoint = { x: 0, y: 0 };
    const stack: QuadTreeNode[] = [root];

    while (stack.length > 0) {
      const current = stack.pop()!;

      current.nodeIds.forEach((nodeId) => {
        const sourceCoords = nodesCoords.get(nodeId)!;

        const f = this.calculateNodeRepulsiveForce({
          sourceCharge: this.nodeCharge,
          targetCharge: this.nodeCharge,
          sourceCoords,
          targetCoords,
        });

        totalForce.x += f.x;
        totalForce.y += f.y;
      });

      if (current.lb !== null) {
        stack.push(current.lb);
      }

      if (current.rb !== null) {
        stack.push(current.rb);
      }

      if (current.lt !== null) {
        stack.push(current.lt);
      }

      if (current.rt !== null) {
        stack.push(current.rt);
      }
    }

    return totalForce;
  }

  private calculateApproximateForce(
    root: QuadTreeNode,
    targetCoords: Point,
  ): Point {
    return this.calculateNodeRepulsiveForce({
      sourceCharge: this.nodeCharge,
      targetCharge: root.totalCharge,
      sourceCoords: root.massCenter,
      targetCoords,
    });
  }

  private calculateNodeRepulsiveForce(
    params: CalculateNodeRepulsiveForceParams,
  ): Point {
    const vector = this.distanceVectorGenerator.create(
      params.sourceCoords,
      params.targetCoords,
    );

    const f = calculateNodeRepulsiveForce({
      coefficient: this.nodeForceCoefficient,
      sourceCharge: params.sourceCharge,
      targetCharge: params.targetCharge,
      distance: vector.d,
      maxForce: this.maxForce,
    });

    return {
      x: f * vector.ex,
      y: f * vector.ey,
    };
  }

  private applyForce(totalForce: MutablePoint, force: Point): void {
    totalForce.x += force.x;
    totalForce.y += force.y;
  }

  private tryApplyFarForce(
    totalForce: MutablePoint,
    targetCoords: Point,
    target: QuadTreeNode | null,
    current: QuadTreeNode,
  ): void {
    if (target !== null && target !== current) {
      const force = this.calculateApproximateForce(target, targetCoords);

      this.applyForce(totalForce, force);
    }
  }

  private tryApplyNearForce(
    totalForce: MutablePoint,
    targetCoords: Point,
    target: QuadTreeNode | null,
    current: QuadTreeNode,
    nodesCoords: ReadonlyMap<Identifier, Point>,
  ): void {
    if (target !== null && target !== current) {
      const force = this.calculateExactForce(target, targetCoords, nodesCoords);

      this.applyForce(totalForce, force);
    }
  }
}
