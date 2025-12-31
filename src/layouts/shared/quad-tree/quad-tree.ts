import { Graph } from "@/graph";
import { QuadTreeNode } from "./quad-tree-node";
import { Point } from "@/point";
import { QuadTreeParams } from "./quad-tree-params";
import { Identifier } from "@/identifier";

export class QuadTree {
  public readonly root: QuadTreeNode;

  private readonly graph: Graph;

  private readonly center: Point;

  private readonly mass: number;

  public constructor(params: QuadTreeParams) {
    this.mass = params.mass;
    this.center = params.center;
    this.graph = params.graph;

    this.root = {
      nodeId: null,
      mass: 0,
      position: this.center,
      areaContainingRadius: {
        horizontal: params.areaContainingRadius.horizontal,
        vertical: params.areaContainingRadius.vertical,
      },
      parent: null,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    this.graph.getAllNodeIds().forEach((nodeId) => {
      this.pushNode(nodeId);
    });
  }

  private pushNode(nodeId: Identifier): void {
    const node = this.graph.getNode(nodeId)!;
    const current = this.root;

    const newTreeNode: QuadTreeNode = {
      nodeId,
      mass: this.mass,
      position: { x: node.x!, y: node.y! },
      areaContainingRadius: null,
      parent: current,
      lb: null,
      lt: null,
      rb: null,
      rt: null,
    };

    const { x, y } = current.position;

    if (node.x! < x) {
      if (node.y! < y) {
        current.lb = newTreeNode;
      } else {
        current.lt = newTreeNode;
      }
    } else {
      if (node.y! < y) {
        current.rb = newTreeNode;
      } else {
        current.rt = newTreeNode;
      }
    }
  }
}
