import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { RenderingBox } from "./rendering-box";
import { EventSubject } from "@/event-subject";

/**
 * This entity is responsible for HTML modifications regarding for viewport
 */
export class BoxHtmlView implements HtmlView {
  private readonly viewportNodes = new Set<unknown>();

  private readonly viewportEdges = new Set<unknown>();

  private xFrom = Infinity;

  private yFrom = Infinity;

  private xTo = Infinity;

  private yTo = Infinity;

  private readonly nodesToAttach = new Set<unknown>();
  private readonly nodesToDetach = new Set<unknown>();
  private readonly edgesToAttach = new Set<unknown>();
  private readonly edgesToDetach = new Set<unknown>();

  private readonly setViewport = (viewBox: RenderingBox): void => {
    this.xFrom = viewBox.x;
    this.xTo = viewBox.x + viewBox.width;
    this.yFrom = viewBox.y;
    this.yTo = viewBox.y + viewBox.width;

    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      const isInViewport = this.isNodeInViewport(nodeId);
      const wasInViewport = this.viewportNodes.has(nodeId);

      if (isInViewport && !wasInViewport) {
        this.nodesToAttach.add(nodeId);
      } else if (!isInViewport && wasInViewport) {
        this.nodesToDetach.add(nodeId);
      }
    });

    this.graphStore.getAllEdgeIds().forEach((edgeId) => {
      const isInViewport = this.isEdgeInViewport(edgeId);
      const wasInViewport = this.viewportEdges.has(edgeId);

      if (isInViewport && !wasInViewport) {
        this.attachEdgeNodes(edgeId);

        this.edgesToAttach.add(edgeId);
      } else if (!isInViewport && wasInViewport) {
        this.edgesToDetach.add(edgeId);
      } else if (isInViewport && wasInViewport) {
        this.attachEdgeNodes(edgeId);
      }
    });

    this.apply();
  };

  public constructor(
    private readonly htmlView: HtmlView,
    private readonly graphStore: GraphStore,
    private readonly trigger: EventSubject<RenderingBox>,
  ) {
    this.trigger.subscribe(this.setViewport);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlView.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlView.detach();
  }

  public attachNode(nodeId: unknown): void {
    if (this.isNodeInViewport(nodeId)) {
      this.attachNodeInternal(nodeId);
    }
  }

  public detachNode(nodeId: unknown): void {
    if (this.viewportNodes.has(nodeId)) {
      this.detachNodeInternal(nodeId);
    }
  }

  public attachEdge(edgeId: unknown): void {
    if (this.isEdgeInViewport(edgeId)) {
      this.attachEdgeInternal(edgeId);
    }
  }

  public detachEdge(edgeId: unknown): void {
    if (this.viewportEdges.has(edgeId)) {
      this.detachEdgeInternal(edgeId);
    }
  }

  public clear(): void {
    this.htmlView.clear();
    this.viewportNodes.clear();
    this.viewportEdges.clear();
  }

  public destroy(): void {
    this.clear();
    this.trigger.unsubscribe(this.setViewport);

    this.htmlView.destroy();
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const wasInViewport = this.viewportNodes.has(nodeId);
    const isInViewport = this.isNodeInViewport(nodeId);

    if (isInViewport && !wasInViewport) {
      this.attachNodeInternal(nodeId);
    } else if (wasInViewport && !isInViewport) {
      this.detachNodeInternal(nodeId);
    } else if (wasInViewport && isInViewport) {
      this.htmlView.updateNodeCoordinates(nodeId);
    }
  }

  public updateNodePriority(nodeId: unknown): void {
    if (this.viewportNodes.has(nodeId)) {
      this.htmlView.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(edgeId: unknown): void {
    if (this.viewportEdges.has(edgeId)) {
      this.htmlView.updateEdgeShape(edgeId);
    }
  }

  public renderEdge(edgeId: unknown): void {
    const wasInViewport = this.viewportEdges.has(edgeId);
    const isInViewport = this.isEdgeInViewport(edgeId);

    if (isInViewport && !wasInViewport) {
      this.attachEdgeInternal(edgeId);
    } else if (wasInViewport && !isInViewport) {
      this.detachEdgeInternal(edgeId);
    } else if (wasInViewport && isInViewport) {
      this.htmlView.renderEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: unknown): void {
    if (this.viewportEdges.has(edgeId)) {
      this.htmlView.updateEdgePriority(edgeId);
    }
  }

  private isNodeInViewport(nodeId: unknown): boolean {
    const node = this.graphStore.getNode(nodeId)!;

    return (
      node.x >= this.xFrom &&
      node.x <= this.xTo &&
      node.y >= this.yFrom &&
      node.y <= this.yTo
    );
  }

  private isEdgeInViewport(edgeId: unknown): boolean {
    const edge = this.graphStore.getEdge(edgeId)!;

    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;
    const nodeFrom = this.graphStore.getNode(nodeFromId)!;
    const nodeTo = this.graphStore.getNode(nodeToId)!;

    const xFrom = Math.min(nodeFrom.x, nodeTo.x);
    const xTo = Math.max(nodeFrom.x, nodeTo.x);
    const yFrom = Math.min(nodeFrom.y, nodeTo.y);
    const yTo = Math.max(nodeFrom.y, nodeTo.y);

    return (
      xFrom <= this.xTo &&
      xTo >= this.xFrom &&
      yFrom <= this.yTo &&
      yTo >= this.yFrom
    );
  }

  private attachNodeInternal(nodeId: unknown): void {
    this.viewportNodes.add(nodeId);
    this.htmlView.attachNode(nodeId);
  }

  private detachNodeInternal(nodeId: unknown): void {
    this.htmlView.detachNode(nodeId);
    this.viewportNodes.delete(nodeId);
  }

  private attachEdgeInternal(edgeId: unknown): void {
    this.viewportEdges.add(edgeId);
    this.htmlView.attachEdge(edgeId);
  }

  private detachEdgeInternal(edgeId: unknown): void {
    this.htmlView.detachEdge(edgeId);
    this.viewportEdges.delete(edgeId);
  }

  private attachEdgeNodes(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;

    this.nodesToAttach.add(nodeFromId);
    this.nodesToAttach.add(nodeToId);
    this.nodesToDetach.delete(nodeFromId);
    this.nodesToDetach.delete(nodeToId);
  }

  private apply(): void {
    this.edgesToDetach.forEach((edgeId) => {
      this.detachEdgeInternal(edgeId);
    });

    this.nodesToDetach.forEach((nodeId) => {
      this.detachNodeInternal(nodeId);
    });

    this.nodesToAttach.forEach((nodeId) => {
      this.attachNodeInternal(nodeId);
    });

    this.edgesToAttach.forEach((edgeId) => {
      this.attachEdgeInternal(edgeId);
    });

    this.nodesToAttach.clear();
    this.edgesToAttach.clear();
    this.nodesToDetach.clear();
    this.edgesToDetach.clear();
  }
}
