import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { Identifier } from "@/identifier";

export class LayoutHtmlView implements HtmlView {
  private readonly deferredNodes = new Set<Identifier>();

  private readonly deferredEdges = new Set<Identifier>();

  public constructor(
    private readonly htmlView: HtmlView,
    private readonly graphStore: GraphStore,
  ) {}

  public attachNode(nodeId: Identifier): void {
    const node = this.graphStore.getNode(nodeId)!;

    if (node.payload.x !== null && node.payload.y !== null) {
      this.htmlView.attachNode(nodeId);
    } else {
      this.deferredNodes.add(nodeId);
    }
  }

  public detachNode(nodeId: Identifier): void {
    if (!this.deferredNodes.has(nodeId)) {
      this.htmlView.detachNode(nodeId);
    } else {
      this.deferredNodes.delete(nodeId);
    }
  }

  public attachEdge(edgeId: Identifier): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const sourceNode = this.graphStore.getPort(edge.from)!;
    const targetNode = this.graphStore.getPort(edge.to)!;

    const adjacentNodeDeferred =
      this.deferredNodes.has(sourceNode.nodeId) ||
      this.deferredNodes.has(targetNode.nodeId);

    if (adjacentNodeDeferred) {
      this.deferredEdges.add(edgeId);
    } else {
      this.htmlView.attachEdge(edgeId);
    }
  }

  public detachEdge(edgeId: Identifier): void {
    if (this.deferredEdges.has(edgeId)) {
      this.deferredEdges.delete(edgeId);
    } else {
      this.htmlView.detachEdge(edgeId);
    }
  }

  public updateNodePosition(nodeId: Identifier): void {
    if (!this.deferredNodes.has(nodeId)) {
      this.htmlView.updateNodePosition(nodeId);
    }
  }

  public updateNodePriority(nodeId: Identifier): void {
    if (!this.deferredNodes.has(nodeId)) {
      this.htmlView.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(edgeId: Identifier): void {
    if (!this.deferredEdges.has(edgeId)) {
      this.htmlView.updateEdgeShape(edgeId);
    }
  }

  public renderEdge(edgeId: Identifier): void {
    if (!this.deferredEdges.has(edgeId)) {
      this.htmlView.renderEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: Identifier): void {
    if (!this.deferredEdges.has(edgeId)) {
      this.htmlView.updateEdgePriority(edgeId);
    }
  }

  public clear(): void {
    this.deferredNodes.clear();
    this.deferredEdges.clear();
    this.htmlView.clear();
  }

  public destroy(): void {
    this.htmlView.destroy();
  }
}
