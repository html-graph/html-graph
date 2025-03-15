import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { RenderingBox } from "./rendering-box";
import { EventSubject } from "@/event-subject";
import { RenderingBoxState } from "./rendering-box-state";

/**
 * This entity is responsible for HTML modifications regarding for limited box
 */
export class BoxHtmlView implements HtmlView {
  private readonly attachedNodes = new Set<unknown>();

  private readonly attachedEdges = new Set<unknown>();

  private readonly renderingBoxState: RenderingBoxState;

  private readonly setRenderingBox = (viewBox: RenderingBox): void => {
    this.renderingBoxState.setRenderingBox(viewBox);
  };

  public constructor(
    private readonly htmlView: HtmlView,
    private readonly graphStore: GraphStore,
    private readonly trigger: EventSubject<RenderingBox>,
  ) {
    this.renderingBoxState = new RenderingBoxState(this.graphStore);
    this.trigger.subscribe(this.setRenderingBox);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlView.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlView.detach();
  }

  public attachNode(nodeId: unknown): void {
    if (!this.renderingBoxState.hasNode(nodeId)) {
      return;
    }

    if (!this.attachedNodes.has(nodeId)) {
      this.handleAttachNode(nodeId);
    }
  }

  public detachNode(nodeId: unknown): void {
    if (!this.attachedNodes.has(nodeId)) {
      return;
    }

    this.handleDetachNode(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    if (!this.renderingBoxState.hasEdge(edgeId)) {
      return;
    }

    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;

    if (!this.attachedNodes.has(nodeFromId)) {
      this.handleAttachNode(nodeFromId);
    }

    if (!this.attachedNodes.has(nodeToId)) {
      this.handleAttachNode(nodeToId);
    }

    if (!this.attachedEdges.has(edgeId)) {
      this.handleAttachEdge(edgeId);
    }
  }

  public detachEdge(edgeId: unknown): void {
    if (!this.attachedEdges.has(edgeId)) {
      return;
    }

    this.handleDetachEdge(edgeId);

    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;

    if (!this.renderingBoxState.hasNode(nodeFromId)) {
      this.handleDetachNode(nodeFromId);
    }

    if (!this.renderingBoxState.hasNode(nodeToId)) {
      this.handleDetachNode(nodeToId);
    }
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const isInViewport = this.renderingBoxState.hasNode(nodeId);

    if (!isInViewport) {
      this.handleDetachNode(nodeId);
    } else {
      const wasInViewport = this.attachedNodes.has(nodeId);

      if (wasInViewport) {
        this.htmlView.updateNodeCoordinates(nodeId);
      } else {
        this.handleAttachNode(nodeId);
      }
    }
  }

  public updateNodePriority(nodeId: unknown): void {
    if (this.renderingBoxState.hasNode(nodeId)) {
      this.htmlView.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(): void {}

  public renderEdge(): void {}

  public updateEdgePriority(): void {}

  public clear(): void {
    this.htmlView.clear();
    this.attachedNodes.clear();
    this.attachedEdges.clear();
  }

  public destroy(): void {
    this.clear();
    this.htmlView.destroy();
    this.trigger.unsubscribe(this.setRenderingBox);
  }

  private handleAttachNode(nodeId: unknown): void {
    this.attachedNodes.add(nodeId);
    this.htmlView.attachNode(nodeId);
  }

  private handleDetachNode(nodeId: unknown): void {
    this.htmlView.detachNode(nodeId);
    this.attachedNodes.delete(nodeId);
  }

  private handleAttachEdge(edgeId: unknown): void {
    this.attachedEdges.add(edgeId);
    this.htmlView.attachEdge(edgeId);
  }

  private handleDetachEdge(edgeId: unknown): void {
    this.htmlView.detachEdge(edgeId);
    this.attachedEdges.delete(edgeId);
  }
}
