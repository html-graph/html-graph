import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { ViewportBox } from "./viewport-box";
import { EventSubject } from "@/event-subject";

/**
 * This entity is responsible for HTML modifications regarding for viewport
 */
export class ViewportHtmlView implements HtmlView {
  private readonly viewportNodes = new Set<unknown>();

  private readonly viewportEdges = new Set<unknown>();

  private xFrom = Infinity;

  private yFrom = Infinity;

  private xTo = Infinity;

  private yTo = Infinity;

  private readonly setViewport = (viewBox: ViewportBox): void => {
    this.xFrom = viewBox.x;
    this.xTo = viewBox.x + viewBox.width;
    this.yFrom = viewBox.y;
    this.yTo = viewBox.y + viewBox.width;

    const nodesToAttach = new Set<unknown>();
    const nodesToDetach = new Set<unknown>();
    const edgesToAttach = new Set<unknown>();
    const edgesToDetach = new Set<unknown>();

    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      const isInViewport = this.isNodeInViewport(nodeId);
      const wasInViewport = this.viewportNodes.has(nodeId);

      if (isInViewport && !wasInViewport) {
        nodesToAttach.add(nodeId);
      } else if (!isInViewport && wasInViewport) {
        nodesToDetach.add(nodeId);
      }
    });

    this.graphStore.getAllEdgeIds().forEach((edgeId) => {
      const isInViewport = this.isEdgeInViewport(edgeId);

      const wasInViewport = this.viewportEdges.has(edgeId);

      if (isInViewport && !wasInViewport) {
        const edge = this.graphStore.getEdge(edgeId)!;
        const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
        const nodeToId = this.graphStore.getPortNodeId(edge.to)!;
        edgesToAttach.add(edgeId);
        nodesToAttach.add(nodeFromId);
        nodesToAttach.add(nodeToId);
        nodesToDetach.delete(nodeFromId);
        nodesToDetach.delete(nodeToId);
      } else if (!isInViewport && wasInViewport) {
        edgesToDetach.add(edgeId);
      }
    });

    edgesToDetach.forEach((edgeId) => {
      this.detachEdgeInternal(edgeId);
    });

    nodesToDetach.forEach((nodeId) => {
      this.detachNodeInternal(nodeId);
    });

    nodesToAttach.forEach((nodeId) => {
      this.attachNodeInternal(nodeId);
    });

    edgesToAttach.forEach((edgeId) => {
      this.attachEdgeInternal(edgeId);
    });
  };

  public constructor(
    private readonly htmlController: HtmlView,
    private readonly graphStore: GraphStore,
    private readonly trigger: EventSubject<ViewportBox>,
  ) {
    this.trigger.subscribe(this.setViewport);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlController.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlController.detach();
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
    this.htmlController.clear();
    this.viewportNodes.clear();
    this.viewportEdges.clear();
  }

  public destroy(): void {
    this.clear();
    this.trigger.unsubscribe(this.setViewport);

    this.htmlController.destroy();
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const wasInViewport = this.viewportNodes.has(nodeId);
    const isInViewport = this.isNodeInViewport(nodeId);

    if (isInViewport && !wasInViewport) {
      this.attachNodeInternal(nodeId);
    } else if (wasInViewport && !isInViewport) {
      this.detachNodeInternal(nodeId);
    } else if (wasInViewport && isInViewport) {
      this.updateNodeCoordinates(nodeId);
    }
  }

  public updateNodePriority(nodeId: unknown): void {
    if (this.viewportNodes.has(nodeId)) {
      this.htmlController.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(edgeId: unknown): void {
    if (this.viewportEdges.has(edgeId)) {
      this.htmlController.updateEdgeShape(edgeId);
    }
  }

  public renderEdge(edgeId: unknown): void {
    const wasInViewport = this.viewportNodes.has(edgeId);
    const isInViewport = this.isNodeInViewport(edgeId);

    if (isInViewport && !wasInViewport) {
      this.attachEdgeInternal(edgeId);
    } else if (wasInViewport && !isInViewport) {
      this.detachEdgeInternal(edgeId);
    } else if (wasInViewport && isInViewport) {
      this.htmlController.renderEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: unknown): void {
    if (this.viewportEdges.has(edgeId)) {
      this.htmlController.updateEdgePriority(edgeId);
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
    this.htmlController.attachNode(nodeId);
  }

  private detachNodeInternal(nodeId: unknown): void {
    this.htmlController.detachNode(nodeId);
    this.viewportNodes.delete(nodeId);
  }

  private attachEdgeInternal(edgeId: unknown): void {
    this.viewportEdges.add(edgeId);
    this.htmlController.attachEdge(edgeId);
  }

  private detachEdgeInternal(edgeId: unknown): void {
    this.htmlController.detachEdge(edgeId);
    this.viewportEdges.delete(edgeId);
  }
}
