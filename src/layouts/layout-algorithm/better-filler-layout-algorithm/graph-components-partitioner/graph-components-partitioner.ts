import { Graph } from "@/graph";
import { Identifier } from "@/identifier";

export class GraphComponentsPartitioner {
  private readonly result: Array<ReadonlySet<Identifier>> = [];

  private readonly remainingNodeIds: Set<Identifier>;

  public constructor(private readonly graph: Graph) {
    this.remainingNodeIds = new Set<Identifier>(this.graph.getAllNodeIds());

    while (this.remainingNodeIds.size > 0) {
      const [startNodeId] = this.remainingNodeIds;
      this.remainingNodeIds.delete(startNodeId);

      this.result.push(this.createComponent(startNodeId));
    }
  }

  public createComponents(): ReadonlyArray<ReadonlySet<Identifier>> {
    return this.result;
  }

  private createComponent(startNodeId: Identifier): ReadonlySet<Identifier> {
    const component = new Set<Identifier>([startNodeId]);

    const stack: Identifier[] = [startNodeId];

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!;

      const adjacentNodeIds = new Set<Identifier>();

      this.graph.getNodeOutgoingEdgeIds(currentNodeId)!.forEach((edgeId) => {
        const edge = this.graph.getEdge(edgeId)!;
        const port = this.graph.getPort(edge.to);

        adjacentNodeIds.add(port.nodeId);
      });

      this.graph.getNodeIncomingEdgeIds(currentNodeId)!.forEach((edgeId) => {
        const edge = this.graph.getEdge(edgeId)!;
        const port = this.graph.getPort(edge.from);

        adjacentNodeIds.add(port.nodeId);
      });

      adjacentNodeIds.forEach((nodeId) => {
        if (this.remainingNodeIds.has(nodeId)) {
          this.remainingNodeIds.delete(nodeId);
          component.add(nodeId);
          stack.push(nodeId);
        }
      });
    }

    return component;
  }
}
