import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { Identifier } from "@/identifier";

export class LayoutHtmlView implements HtmlView {
  private readonly deferredNodes = new Set<Identifier>();

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
    this.htmlView.attachEdge(edgeId);
  }

  public detachEdge(edgeId: Identifier): void {
    this.htmlView.detachEdge(edgeId);
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
    this.htmlView.updateEdgeShape(edgeId);
  }

  public renderEdge(edgeId: Identifier): void {
    this.htmlView.renderEdge(edgeId);
  }

  public updateEdgePriority(edgeId: Identifier): void {
    this.htmlView.updateEdgePriority(edgeId);
  }

  public clear(): void {
    this.htmlView.clear();
  }

  public destroy(): void {
    this.htmlView.destroy();
  }
}
