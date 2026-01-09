import { Identifier } from "@/identifier";
import { QuadTreeNode } from "./quad-tree-node";
import { QuadTreeParams } from "./quad-tree-params";
import { Point } from "@/point";
import { MutablePoint } from "@/point";
import { MutableQuadTreeNode } from "./mutable-quad-tree-node";

export class QuadTree {
  private readonly root: MutableQuadTreeNode;

  private readonly leaves = new Map<Identifier, MutableQuadTreeNode>();

  private readonly coords: ReadonlyMap<Identifier, Point>;

  private readonly areaRadiusThreshold: number;

  private readonly nodeMass: number;

  private readonly nodeCharge: number;

  private readonly sortedParentNodes: MutableQuadTreeNode[] = [];

  public constructor(params: QuadTreeParams) {
    this.coords = params.coords;
    this.areaRadiusThreshold = params.areaRadiusThreshold;
    this.nodeMass = params.nodeMass;
    this.nodeCharge = params.nodeCharge;

    this.root = {
      nodeIds: new Set(params.coords.keys()),
      box: params.box,
      totalMass: 0,
      totalCharge: 0,
      chargeCenter: {
        x: 0,
        y: 0,
      },
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    let layer: MutableQuadTreeNode[] = [this.root];

    while (layer.length > 0) {
      const nextLayer: MutableQuadTreeNode[] = [];

      while (layer.length > 0) {
        const node = layer.pop()!;
        const chunk = this.processNode(node);

        chunk.forEach((node) => {
          nextLayer.push(node);
        });
      }

      layer = nextLayer;
    }

    this.sortedParentNodes.reverse().forEach((node) => {
      let totalChargeX = 0;
      let totalChargeY = 0;
      let totalMass = 0;
      let totalCharge = 0;

      if (node.lb !== null) {
        totalMass += node.lb.totalMass;
        totalCharge += node.lb.totalCharge;
        totalChargeX += node.lb.chargeCenter.x * node.lb.totalCharge;
        totalChargeY += node.lb.chargeCenter.y * node.lb.totalCharge;
      }

      if (node.lt !== null) {
        totalMass += node.lt.totalMass;
        totalCharge += node.lt.totalCharge;
        totalChargeX += node.lt.chargeCenter.x * node.lt.totalCharge;
        totalChargeY += node.lt.chargeCenter.y * node.lt.totalCharge;
      }

      if (node.rb !== null) {
        totalMass += node.rb.totalMass;
        totalCharge += node.rb.totalCharge;
        totalChargeX += node.rb.chargeCenter.x * node.rb.totalCharge;
        totalChargeY += node.rb.chargeCenter.y * node.rb.totalCharge;
      }

      if (node.rt !== null) {
        totalMass += node.rt.totalMass;
        totalCharge += node.rt.totalCharge;
        totalChargeX += node.rt.chargeCenter.x * node.rt.totalCharge;
        totalChargeY += node.rt.chargeCenter.y * node.rt.totalCharge;
      }

      node.totalMass = totalMass;
      node.totalCharge = totalCharge;
      node.chargeCenter.x = totalChargeX / totalCharge;
      node.chargeCenter.y = totalChargeY / totalCharge;
    });
  }

  public getRoot(): QuadTreeNode {
    return this.root;
  }

  public getLeaf(nodeId: Identifier): QuadTreeNode | undefined {
    return this.leaves.get(nodeId);
  }

  private processNode(
    current: MutableQuadTreeNode,
  ): readonly MutableQuadTreeNode[] {
    if (current.nodeIds.size < 2) {
      this.setLeaf(current);
      return [];
    }

    const { centerX, centerY, radius } = current.box;

    if (radius < this.areaRadiusThreshold) {
      this.setLeaf(current);
      return [];
    }

    this.sortedParentNodes.push(current);

    const rightTopNodes = new Set<Identifier>();
    const rightBottomNodes = new Set<Identifier>();
    const leftTopNodes = new Set<Identifier>();
    const leftBottomNodes = new Set<Identifier>();

    const halfRadius = radius / 2;

    current.nodeIds.forEach((nodeId) => {
      const { x, y } = this.coords.get(nodeId)!;

      if (x < centerX) {
        if (y < centerY) {
          leftBottomNodes.add(nodeId);
        } else {
          leftTopNodes.add(nodeId);
        }
      } else {
        if (y < centerY) {
          rightBottomNodes.add(nodeId);
        } else {
          rightTopNodes.add(nodeId);
        }
      }

      current.nodeIds.delete(nodeId);
    });

    const nodeLinks = {
      parent: current,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    const nextNodesToProcess: MutableQuadTreeNode[] = [];

    if (rightTopNodes.size > 0) {
      const node: MutableQuadTreeNode = {
        nodeIds: rightTopNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0,
        },
        box: {
          centerX: centerX + halfRadius,
          centerY: centerY + halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.rt = node;
      nextNodesToProcess.push(node);
    }

    if (rightBottomNodes.size > 0) {
      const node: MutableQuadTreeNode = {
        nodeIds: rightBottomNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0,
        },
        box: {
          centerX: centerX + halfRadius,
          centerY: centerY - halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.rb = node;
      nextNodesToProcess.push(node);
    }

    if (leftTopNodes.size > 0) {
      const node: MutableQuadTreeNode = {
        nodeIds: leftTopNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0,
        },
        box: {
          centerX: centerX - halfRadius,
          centerY: centerY + halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.lt = node;
      nextNodesToProcess.push(node);
    }

    if (leftBottomNodes.size > 0) {
      const node: MutableQuadTreeNode = {
        nodeIds: leftBottomNodes,
        totalMass: 0,
        totalCharge: 0,
        chargeCenter: {
          x: 0,
          y: 0,
        },
        box: {
          centerX: centerX - halfRadius,
          centerY: centerY - halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.lb = node;
      nextNodesToProcess.push(node);
    }

    return nextNodesToProcess;
  }

  private setLeaf(current: MutableQuadTreeNode): void {
    current.totalMass = this.nodeMass * current.nodeIds.size;
    current.totalCharge = this.nodeCharge * current.nodeIds.size;
    current.chargeCenter = this.calculateLeafChargeCenter(current.nodeIds);
    current.nodeIds.forEach((nodeId) => {
      this.leaves.set(nodeId, current);
    });
  }

  private calculateLeafChargeCenter(
    nodeIds: ReadonlySet<Identifier>,
  ): MutablePoint {
    if (nodeIds.size === 0) {
      return {
        x: 0,
        y: 0,
      };
    }

    let x = 0;
    let y = 0;

    nodeIds.forEach((nodeId) => {
      const node = this.coords.get(nodeId)!;

      x += node.x!;
      y += node.y!;
    });

    return { x: x / nodeIds.size, y: y / nodeIds.size };
  }
}
