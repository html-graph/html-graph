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
    if (this.isNodeValid(nodeId)) {
      this.htmlView.attachNode(nodeId);
    } else {
      this.deferredNodes.add(nodeId);
    }
  }

  public detachNode(nodeId: Identifier): void {
    if (this.deferredNodes.has(nodeId)) {
      this.deferredNodes.delete(nodeId);
    } else {
      this.htmlView.detachNode(nodeId);
    }
  }

  public attachEdge(edgeId: Identifier): void {
    if (this.isEdgeValid(edgeId)) {
      this.htmlView.attachEdge(edgeId);
    } else {
      this.deferredEdges.add(edgeId);
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
    if (this.deferredNodes.has(nodeId)) {
      this.tryAttachNode(nodeId);
    } else {
      this.htmlView.updateNodePosition(nodeId);
    }
  }

  public updateNodePriority(nodeId: Identifier): void {
    if (this.deferredNodes.has(nodeId)) {
      this.tryAttachNode(nodeId);
    } else {
      this.htmlView.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(edgeId: Identifier): void {
    if (this.deferredEdges.has(edgeId)) {
      this.tryAttachEdge(edgeId);
    } else {
      this.htmlView.updateEdgeShape(edgeId);
    }
  }

  public renderEdge(edgeId: Identifier): void {
    if (this.deferredEdges.has(edgeId)) {
      this.tryAttachEdge(edgeId);
    } else {
      this.htmlView.renderEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: Identifier): void {
    if (this.deferredEdges.has(edgeId)) {
      this.tryAttachEdge(edgeId);
    } else {
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

  private isNodeValid(nodeId: Identifier): boolean {
    const node = this.graphStore.getNode(nodeId);

    return !(node.payload.x === null || node.payload.y === null);
  }

  private tryAttachNode(nodeId: Identifier): void {
    if (this.isNodeValid(nodeId)) {
      this.deferredNodes.delete(nodeId);
      this.htmlView.attachNode(nodeId);
    }
  }

  private isEdgeValid(edgeId: Identifier): boolean {
    const edge = this.graphStore.getEdge(edgeId)!;
    const sourcePort = this.graphStore.getPort(edge.from)!;
    const targetPort = this.graphStore.getPort(edge.to)!;

    return !(
      this.deferredNodes.has(sourcePort.nodeId) ||
      this.deferredNodes.has(targetPort.nodeId)
    );
  }

  private tryAttachEdge(edgeId: Identifier): void {
    if (this.isEdgeValid(edgeId)) {
      this.deferredEdges.delete(edgeId);
      this.htmlView.attachEdge(edgeId);
    }
  }
}
