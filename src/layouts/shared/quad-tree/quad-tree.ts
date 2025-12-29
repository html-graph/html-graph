import { Graph } from "@/graph";
import { QuadTreeNode } from "./quad-tree-node";
import { Point } from "@/point";

export class QuadTree {
  public readonly root: QuadTreeNode;

  public constructor(
    private readonly graph: Graph,
    private readonly center: Point,
    private readonly mass: number,
  ) {
    this.root = {
      nodeId: null,
      mass: 0,
      position: this.center,
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    this.graph.getAllNodeIds().forEach((nodeId) => {
      const node = this.graph.getNode(nodeId)!;

      const newTreeNode: QuadTreeNode = {
        nodeId,
        mass: this.mass,
        position: { x: 0, y: 0 },
        parent: null,
        lb: null,
        lt: null,
        rb: null,
        rt: null,
      };

      const { x, y } = this.root.position;

      if (node.x! < x) {
        if (node.y! < y) {
          this.root.lb = newTreeNode;
        } else {
          this.root.lt = newTreeNode;
        }
      } else {
        if (node.y! < y) {
          this.root.rb = newTreeNode;
        } else {
          this.root.rt = newTreeNode;
        }
      }
    });
  }
}
