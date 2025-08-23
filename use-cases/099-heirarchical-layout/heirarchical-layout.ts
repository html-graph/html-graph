import { Canvas, Identifier } from "@html-graph/html-graph";
import { HeirarchicalLayoutParams } from "./heirarchical-layout-params";

export class HeirarchicalLayout {
  public constructor(
    private readonly canvas: Canvas,
    private readonly params: HeirarchicalLayoutParams,
  ) {}

  public organize(): void {
    const stack: Identifier[] = [this.params.startNodeId];

    while (stack.length > 0) {
      const nodeId = stack.pop()!;

      const outgoingEdges = this.canvas.graph.getNodeOutgoingEdgeIds(nodeId);

      if (outgoingEdges !== null) {
        outgoingEdges.forEach((edgeId) => {
          const edge = this.canvas.graph.getEdge(edgeId)!;
          const port = this.canvas.graph.getPort(edge.to)!;

          stack.push(port.nodeId);
        });
      }
    }

    this.canvas.graph.getAllNodeIds().forEach((nodeId) => {
      this.canvas.updateNode(nodeId, { x: 0, y: 0 });
    });
  }
}
