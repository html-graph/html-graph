import { Graph } from "@/graph";
import { MutableTreeNode, TreeNode } from "./tree-node";

export class SpanningForestGenerator {
  private forest = new Set<TreeNode>();

  public constructor(private readonly graph: Graph) {
    this.graph.getAllNodeIds().forEach((nodeId) => {
      const current: MutableTreeNode = {
        parent: null,
        nodeId,
        children: new Set(),
      };

      this.forest.add(current);
    });
  }

  public generate(): ReadonlySet<TreeNode> {
    return this.forest;
  }
}
