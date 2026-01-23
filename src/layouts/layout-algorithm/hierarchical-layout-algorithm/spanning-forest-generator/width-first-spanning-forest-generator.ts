import { Graph } from "@/graph";
import { MutableTreeNode, TreeNode } from "./tree-node";
import { Tree } from "./tree";
import { Identifier } from "@/identifier";

export class WidthFirstSpanningForestGenerator {
  private readonly forest = new Set<Tree>();

  private readonly remainingNodeIds: Set<Identifier>;

  public constructor(private readonly graph: Graph) {
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

    while (layer.length > 0) {
      const nextLayer: MutableTreeNode[] = [];

      layer.forEach((current) => {
        sequence.push(current);
        this.remainingNodeIds.delete(current.nodeId);

        const outgoingNodeIds = this.graph
          .getNodeOutgoingEdgeIds(current.nodeId)
          .map((edgeId) => {
            const edge = this.graph.getEdge(edgeId);
            const port = this.graph.getPort(edge.to);

            return port.nodeId;
          });

        const incomingNodeIds = this.graph
          .getNodeIncomingEdgeIds(current.nodeId)
          .map((edgeId) => {
            const edge = this.graph.getEdge(edgeId);
            const port = this.graph.getPort(edge.from);

            return port.nodeId;
          });

        [...outgoingNodeIds, ...incomingNodeIds].forEach((nodeId) => {
          if (!this.remainingNodeIds.has(nodeId)) {
            return;
          }

          const child: MutableTreeNode = {
            nodeId,
            children: new Set(),
          };

          current.children.add(child);
          nextLayer.push(child);
        });
      });

      layer = nextLayer;
    }
  }
}
