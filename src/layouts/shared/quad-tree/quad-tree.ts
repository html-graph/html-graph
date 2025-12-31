import { Identifier } from "@/identifier";
import { QuadTreeNode } from "./quad-tree-node";
import { QuadTreeParams } from "./quad-tree-params";
import { Point } from "@/point";

export class QuadTree {
  public readonly root: QuadTreeNode;

  private readonly coords: ReadonlyMap<Identifier, Point>;

  public constructor(params: QuadTreeParams) {
    this.coords = params.coords;

    this.root = {
      nodeIds: new Set(params.coords.keys()),
      box: params.box,
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    if (this.root.nodeIds.size < 2) {
      return;
    }

    const current = this.root;

    const rightTopNodes = new Set<Identifier>();
    const { centerX, centerY, radiusHorizontal, radiusVertical } = current.box;
    const halfRadiusVertical = radiusVertical / 2;
    const halfRadiusHorizontal = radiusHorizontal / 2;

    current.nodeIds.forEach((nodeId) => {
      const nodeCoords = this.coords.get(nodeId)!;

      if (nodeCoords.x < centerX) {
        //
      } else {
        if (nodeCoords.y < centerY) {
          //
        } else {
          rightTopNodes.add(nodeId);
          current.nodeIds.delete(nodeId);
        }
      }
    });

    if (rightTopNodes.size > 0) {
      current.rt = {
        nodeIds: rightTopNodes,
        box: {
          centerX: centerX + halfRadiusHorizontal,
          centerY: centerY + halfRadiusVertical,
          radiusVertical: halfRadiusHorizontal,
          radiusHorizontal: halfRadiusVertical,
        },
        parent: current,
        lb: null,
        lt: null,
        rb: null,
        rt: null,
      };
    }
  }
}
