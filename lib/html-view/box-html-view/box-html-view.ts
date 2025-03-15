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

  private readonly setViewport = (viewBox: RenderingBox): void => {
    this.renderingBoxState.setRenderingBox(viewBox);
  };

  public constructor(
    private readonly htmlView: HtmlView,
    private readonly graphStore: GraphStore,
    private readonly trigger: EventSubject<RenderingBox>,
  ) {
    this.renderingBoxState = new RenderingBoxState(this.graphStore);
    this.trigger.subscribe(this.setViewport);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlView.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlView.detach();
  }

  public attachNode(nodeId: unknown): void {
    if (this.renderingBoxState.hasNode(nodeId)) {
      this.attachedNodes.add(nodeId);
      this.htmlView.attachNode(nodeId);
    }
  }

  public detachNode(nodeId: unknown): void {
    if (this.attachedNodes.has(nodeId)) {
      this.htmlView.detachNode(nodeId);
      this.attachedNodes.delete(nodeId);
    }
  }

  public attachEdge(edgeId: unknown): void {
    if (!this.renderingBoxState.hasEdge(edgeId)) {
      return;
    }

    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;

    if (!this.attachedNodes.has(nodeFromId)) {
      this.htmlView.attachNode(nodeFromId);
      this.attachedNodes.add(nodeFromId);
    }

    if (!this.attachedNodes.has(nodeToId)) {
      this.htmlView.attachNode(nodeToId);
      this.attachedNodes.add(nodeToId);
    }

    if (!this.attachedEdges.has(edgeId)) {
      this.htmlView.attachEdge(edgeId);
      this.attachedEdges.add(edgeId);
    }
  }

  public detachEdge(): void {}

  public updateNodeCoordinates(): void {}

  public updateNodePriority(): void {}

  public updateEdgeShape(): void {}

  public renderEdge(): void {}

  public updateEdgePriority(): void {}

  public clear(): void {
    this.htmlView.clear();
  }

  public destroy(): void {
    this.clear();
    this.htmlView.destroy();
  }
}
