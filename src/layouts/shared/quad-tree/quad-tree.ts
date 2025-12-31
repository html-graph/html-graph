import { Identifier } from "@/identifier";
import { QuadTreeNode } from "./quad-tree-node";
import { QuadTreeParams } from "./quad-tree-params";
import { Point } from "@/point";

export class QuadTree {
  public readonly root: QuadTreeNode;

  private readonly coords: ReadonlyMap<Identifier, Point>;

  private readonly nodesToProcess: QuadTreeNode[] = [];

  private readonly minAreaSize: number;

  public constructor(params: QuadTreeParams) {
    this.coords = params.coords;
    this.minAreaSize = params.minAreaSize;

    this.root = {
      nodeIds: new Set(params.coords.keys()),
      box: params.box,
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
  }

  private processNode(current: QuadTreeNode): void {
    if (current.nodeIds.size < 2) {
      return;
    }

    const { centerX, centerY, radiusHorizontal, radiusVertical } = current.box;

    if (
      radiusHorizontal < this.minAreaSize &&
      radiusVertical < this.minAreaSize
    ) {
      return;
    }

    const rightTopNodes = new Set<Identifier>();
    const rightBottomNodes = new Set<Identifier>();
    const leftTopNodes = new Set<Identifier>();
    const leftBottomNodes = new Set<Identifier>();

    const halfRadiusVertical = radiusVertical / 2;
    const halfRadiusHorizontal = radiusHorizontal / 2;

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

    const radius = {
      radiusVertical: halfRadiusHorizontal,
      radiusHorizontal: halfRadiusVertical,
    };

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
        box: {
          centerX: centerX + halfRadiusHorizontal,
          centerY: centerY + halfRadiusVertical,
          ...radius,
        },
        ...nodeLinks,
      };

      current.rt = node;
      this.nodesToProcess.push(node);
    }

    if (rightBottomNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: rightBottomNodes,
        box: {
          centerX: centerX + halfRadiusHorizontal,
          centerY: centerY - halfRadiusVertical,
          ...radius,
        },
        ...nodeLinks,
      };

      current.rb = node;
      this.nodesToProcess.push(node);
    }

    if (leftTopNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: leftTopNodes,
        box: {
          centerX: centerX - halfRadiusHorizontal,
          centerY: centerY + halfRadiusVertical,
          ...radius,
        },
        ...nodeLinks,
      };

      current.lt = node;
      this.nodesToProcess.push(node);
    }

    if (leftBottomNodes.size > 0) {
      const node: QuadTreeNode = {
        nodeIds: leftBottomNodes,
        box: {
          centerX: centerX - halfRadiusHorizontal,
          centerY: centerY - halfRadiusVertical,
          ...radius,
        },
        ...nodeLinks,
      };

      current.lb = node;
      this.nodesToProcess.push(node);
    }
  }
}
