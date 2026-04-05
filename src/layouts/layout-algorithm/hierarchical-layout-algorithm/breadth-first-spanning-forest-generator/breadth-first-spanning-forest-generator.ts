import { Graph } from "@/graph";
import { Tree, MutableTreeNode, TreeNode } from "../tree";
import { Identifier } from "@/identifier";
import { NextLayerNodesResolver } from "../next-layer-nodes-resolver";

export class BreadthFirstSpanningForestGenerator {
  private readonly forest = new Set<Tree>();

  private readonly remainingNodeIds: Set<Identifier>;

  public constructor(
    private readonly graph: Graph,
    private readonly nextLayerNodesResolver: NextLayerNodesResolver,
  ) {
    this.remainingNodeIds = new Set(this.graph.getAllNodeIds());

    while (this.remainingNodeIds.size > 0) {
      const [nodeId] = this.remainingNodeIds;
      this.traverse(nodeId);
    }
  }

  public generate(): ReadonlySet<Tree> {
    return this.forest;
  }

  private traverse(startNodeId: Identifier): void {
    const root: MutableTreeNode = {
      nodeId: startNodeId,
      children: new Set(),
    };

    const sequence: TreeNode[] = [];

    this.forest.add({ root, sequence });

    let layer: MutableTreeNode[] = [root];
    this.remainingNodeIds.delete(root.nodeId);

    while (layer.length > 0) {
      const nextLayer: MutableTreeNode[] = [];

      layer.forEach((current) => {
        sequence.push(current);

        const nextLayerNodes = this.nextLayerNodesResolver({
          graph: this.graph,
          currentNodeId: current.nodeId,
        });

        for (const nodeId of nextLayerNodes) {
          if (!this.remainingNodeIds.has(nodeId)) {
            continue;
          }

          this.remainingNodeIds.delete(nodeId);

          const child: MutableTreeNode = {
            nodeId,
            children: new Set(),
          };

          current.children.add(child);
          nextLayer.push(child);
        }
      });

      layer = nextLayer;
    }
  }
}
