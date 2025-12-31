import { Identifier } from "@/identifier";
import { QuadTreeNode } from "./quad-tree-node";
import { QuadTreeParams } from "./quad-tree-params";
import { Point } from "@/point";

export class QuadTree {
  public readonly root: QuadTreeNode;

  private readonly coords: ReadonlyMap<Identifier, Point>;

  private readonly nodesToProcess: QuadTreeNode[] = [];

  private readonly minAreaSize: number;

  private readonly nodeMass: number;

  private readonly leaves = new Map<Identifier, QuadTreeNode>();

  public constructor(params: QuadTreeParams) {
    this.coords = params.coords;
    this.minAreaSize = params.minAreaSize;
    this.nodeMass = params.nodeMass;

    this.root = {
      nodeIds: new Set(params.coords.keys()),
      box: params.box,
      totalMass: 0,
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    this.nodesToProcess.push(this.root);

    while (this.nodesToProcess.length > 0) {
      const node = this.nodesToProcess.pop()!;

      this.processNode(node);
    }

    this.leaves.forEach((node) => {
      this.nodesToProcess.push(node);
    });

    const nextNodesToProcess = new Set<QuadTreeNode>();

    do {
      while (this.nodesToProcess.length > 0) {
        const current = this.nodesToProcess.pop()!;

        const parent = current.parent;

        if (parent !== null) {
          parent.totalMass += current.totalMass;
          nextNodesToProcess.add(parent);
        }
      }

      nextNodesToProcess.forEach((node) => {
        this.nodesToProcess.push(node);
      });

      nextNodesToProcess.clear();
    } while (this.nodesToProcess.length > 0);
  }

  private processNode(current: QuadTreeNode): void {
    if (current.nodeIds.size < 2) {
      this.markLeave(current);
      return;
    }

    const { centerX, centerY, radius } = current.box;

    if (radius < this.minAreaSize) {
      this.markLeave(current);
      return;
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

    if (rightTopNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: rightTopNodes,
        totalMass: 0,
        box: {
          centerX: centerX + halfRadius,
          centerY: centerY + halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.rt = node;
      this.nodesToProcess.push(node);
    }

    if (rightBottomNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: rightBottomNodes,
        totalMass: 0,
        box: {
          centerX: centerX + halfRadius,
          centerY: centerY - halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.rb = node;
      this.nodesToProcess.push(node);
    }

    if (leftTopNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: leftTopNodes,
        totalMass: 0,
        box: {
          centerX: centerX - halfRadius,
          centerY: centerY + halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.lt = node;
      this.nodesToProcess.push(node);
    }

    if (leftBottomNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: leftBottomNodes,
        totalMass: 0,
        box: {
          centerX: centerX - halfRadius,
          centerY: centerY - halfRadius,
          radius: halfRadius,
        },
        ...nodeLinks,
      };

      current.lb = node;
      this.nodesToProcess.push(node);
    }
  }

  private markLeave(current: QuadTreeNode): void {
    current.totalMass = this.nodeMass * current.nodeIds.size;
    current.nodeIds.forEach((nodeId) => {
      this.leaves.set(nodeId, current);
    });
  }
}
