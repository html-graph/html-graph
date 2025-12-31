import { Identifier } from "@/identifier";
import { QuadTreeNode } from "./quad-tree-node";
import { QuadTreeParams } from "./quad-tree-params";
import { Point } from "@/point";
import { MutablePoint } from "../mutable-point";

export class QuadTree {
  public readonly root: QuadTreeNode;

  private readonly coords: ReadonlyMap<Identifier, Point>;

  private readonly minAreaSize: number;

  private readonly nodeMass: number;

  private readonly leaves = new Map<Identifier, QuadTreeNode>();

  private readonly sortedNodes: QuadTreeNode[] = [];

  public constructor(params: QuadTreeParams) {
    this.coords = params.coords;
    this.minAreaSize = params.minAreaSize;
    this.nodeMass = params.nodeMass;

    this.root = {
      nodeIds: new Set(params.coords.keys()),
      box: params.box,
      totalMass: 0,
      massCenter: null,
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    let nodesToProcess: QuadTreeNode[] = [this.root];

    while (nodesToProcess.length > 0) {
      let nextNodesToProcess: QuadTreeNode[] = [];

      while (nodesToProcess.length > 0) {
        const node = nodesToProcess.pop()!;

        nextNodesToProcess = [...nextNodesToProcess, ...this.processNode(node)];
      }

      nodesToProcess = nextNodesToProcess;
    }

    this.sortedNodes.reverse().forEach((node) => {
      if (node.parent !== null) {
        node.parent.totalMass += node.totalMass;
      }
    });
  }

  private processNode(current: QuadTreeNode): readonly QuadTreeNode[] {
    this.sortedNodes.push(current);

    if (current.nodeIds.size < 2) {
      this.setLeaf(current);
      return [];
    }

    const { centerX, centerY, radius } = current.box;

    if (radius < this.minAreaSize) {
      this.setLeaf(current);
      return [];
    }

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

    const nextNodesToProcess: QuadTreeNode[] = [];

    if (rightTopNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: rightTopNodes,
        totalMass: 0,
        massCenter: null,
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
      const node: QuadTreeNode = {
        nodeIds: rightBottomNodes,
        totalMass: 0,
        massCenter: null,
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
      const node: QuadTreeNode = {
        nodeIds: leftTopNodes,
        totalMass: 0,
        massCenter: null,
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
      const node: QuadTreeNode = {
        nodeIds: leftBottomNodes,
        totalMass: 0,
        massCenter: null,
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

  private setLeaf(current: QuadTreeNode): void {
    current.totalMass = this.nodeMass * current.nodeIds.size;
    current.nodeIds.forEach((nodeId) => {
      this.leaves.set(nodeId, current);
    });

    current.massCenter = this.calculateLeafMassCenter(current.nodeIds);
  }

  private calculateLeafMassCenter(
    nodeIds: ReadonlySet<Identifier>,
  ): MutablePoint | null {
    if (nodeIds.size === 0) {
      return null;
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
