import { GraphStore } from "@/graph-store";
import { HtmlController } from "../html-controller";
import { ViewportBox } from "./viewport-box";
import { EventSubject } from "@/event-subject";

/**
 * This entity is responsible for HTML modifications regarding for viewport
 */
export class VirtualScrollHtmlController implements HtmlController {
  private readonly viewportNodes = new Set<unknown>();

  private readonly viewportEdges = new Set<unknown>();

  private xFrom = Infinity;

  private yFrom = Infinity;

  private xTo = Infinity;

  private yTo = Infinity;

  private readonly updateViewport = (viewBox: ViewportBox): void => {
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
      const [isInViewport, nodeFromId, nodeToId] =
        this.isEdgeInViewport(edgeId);
      const wasInViewport = this.viewportEdges.has(edgeId);

      if (isInViewport && !wasInViewport) {
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
      this.htmlController.detachEdge(edgeId);
    });

    nodesToDetach.forEach((nodeId) => {
      this.htmlController.detachNode(nodeId);
    });

    nodesToAttach.forEach((nodeId) => {
      this.htmlController.attachNode(nodeId);
    });

    edgesToAttach.forEach((edgeId) => {
      this.htmlController.attachEdge(edgeId);
    });

    nodesToAttach.clear();
    nodesToDetach.clear();
    edgesToAttach.clear();
    edgesToDetach.clear();
  };

  public constructor(
    private readonly htmlController: HtmlController,
    private readonly graphStore: GraphStore,
    private readonly trigger: EventSubject<ViewportBox>,
  ) {
    this.trigger.subscribe(this.updateViewport);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlController.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlController.detach();
  }

  public attachNode(nodeId: unknown): void {
    if (this.isNodeInViewport(nodeId)) {
      this.htmlController.attachNode(nodeId);
    }
  }

  public detachNode(nodeId: unknown): void {
    if (this.isNodeInViewport(nodeId)) {
      this.htmlController.detachNode(nodeId);
    }
  }

  public attachEdge(edgeId: unknown): void {
    if (this.isEdgeInViewport(edgeId)) {
      this.htmlController.attachEdge(edgeId);
    }
  }

  public detachEdge(edgeId: unknown): void {
    if (this.isEdgeInViewport(edgeId)) {
      this.htmlController.detachEdge(edgeId);
    }
  }

  public clear(): void {
    this.htmlController.clear();
  }

  public destroy(): void {
    this.trigger.unsubscribe(this.updateViewport);

    this.htmlController.destroy();
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    if (this.isNodeInViewport(nodeId)) {
      this.htmlController.updateNodeCoordinates(nodeId);
    }
  }

  public updateNodePriority(nodeId: unknown): void {
    if (this.isNodeInViewport(nodeId)) {
      this.htmlController.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(edgeId: unknown): void {
    if (this.isEdgeInViewport(edgeId)) {
      this.htmlController.updateEdgeShape(edgeId);
    }
  }

  public renderEdge(edgeId: unknown): void {
    if (this.isEdgeInViewport(edgeId)) {
      this.htmlController.renderEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: unknown): void {
    if (this.isEdgeInViewport(edgeId)) {
      this.htmlController.updateEdgePriority(edgeId);
    }
  }

  private isNodeInViewport(nodeId: unknown): boolean {
    const node = this.graphStore.getNode(nodeId)!;

    return (
      node.x > this.xFrom &&
      node.x < this.xTo &&
      node.y > this.yFrom &&
      node.y < this.yTo
    );
  }

  private isEdgeInViewport(edgeId: unknown): [boolean, unknown, unknown] {
    const edge = this.graphStore.getEdge(edgeId)!;

    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;
    const nodeFrom = this.graphStore.getNode(nodeFromId)!;
    const nodeTo = this.graphStore.getNode(nodeToId)!;

    const xFrom = Math.min(nodeFrom.x, nodeTo.x);
    const xTo = Math.max(nodeFrom.x, nodeTo.x);
    const yFrom = Math.min(nodeFrom.y, nodeTo.y);
    const yTo = Math.max(nodeFrom.y, nodeTo.y);

    const isInViewport =
      xFrom < this.xTo &&
      xTo > this.xFrom &&
      yFrom < this.yTo &&
      yTo > this.yFrom;

    return [isInViewport, nodeFromId, nodeToId];
  }
}
