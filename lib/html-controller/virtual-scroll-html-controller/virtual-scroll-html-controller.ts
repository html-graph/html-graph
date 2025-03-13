import { GraphStore } from "@/graph-store";
import { HtmlController } from "../html-controller";
import { ViewportBox } from "./viewport-box";
import { VirtualScrollHtmlControllerConfig } from "./virtual-scroll-html-controller-config";
import { EventSubject } from "@/event-subject";

/**
 * This entity is responsible for HTML modifications regarding for viewport
 */
export class VirtualScrollHtmlController implements HtmlController {
  private readonly viewportNodes = new Set<unknown>();

  private readonly viewportEdges = new Set<unknown>();

  private readonly trigger: EventSubject<ViewportBox>;

  private readonly setViewport = (viewBox: ViewportBox): void => {
    const vxFrom = viewBox.x;
    const vxTo = viewBox.x + viewBox.width;
    const vyFrom = viewBox.y;
    const vyTo = viewBox.y + viewBox.height;

    const nodesToAttach = new Set<unknown>();
    const nodesToDetach = new Set<unknown>();
    const edgesToAttach = new Set<unknown>();
    const edgesToDetach = new Set<unknown>();

    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      const node = this.graphStore.getNode(nodeId)!;

      const isNodeInViewport =
        node.x > vxFrom && node.x < vxTo && node.y > vyFrom && node.y < vyTo;

      const wasInViewport = this.viewportNodes.has(nodeId);

      if (isNodeInViewport && !wasInViewport) {
        nodesToAttach.add(nodeId);
      } else if (!isNodeInViewport && wasInViewport) {
        nodesToDetach.add(nodeId);
      }
    });

    this.graphStore.getAllEdgeIds().forEach((edgeId) => {
      const edge = this.graphStore.getEdge(edgeId)!;

      const fromNodeId = this.graphStore.getPortNodeId(edge.from)!;
      const toNodeId = this.graphStore.getPortNodeId(edge.to)!;
      const from = this.graphStore.getNode(fromNodeId)!;
      const to = this.graphStore.getNode(toNodeId)!;

      const xFrom = Math.min(from.x, to.x);
      const xTo = Math.max(from.x, to.x);
      const yFrom = Math.min(from.y, to.y);
      const yTo = Math.max(from.y, to.y);
      const isInViewport =
        xFrom < vxTo && xTo > vxFrom && yFrom < vyTo && yTo > vyFrom;
      const wasInViewport = this.viewportEdges.has(edgeId);

      if (isInViewport && !wasInViewport) {
        edgesToAttach.add(edgeId);
        nodesToAttach.add(fromNodeId);
        nodesToAttach.add(toNodeId);
        nodesToDetach.delete(fromNodeId);
        nodesToDetach.delete(toNodeId);
      } else if (!isInViewport && wasInViewport) {
        edgesToDetach.add(edgeId);
      }
    });

    console.log(nodesToAttach, nodesToDetach, edgesToAttach, edgesToDetach);
  };

  public constructor(
    private readonly htmlController: HtmlController,
    private readonly graphStore: GraphStore,
    config: VirtualScrollHtmlControllerConfig,
  ) {
    this.trigger = config.trigger;
    this.trigger.subscribe(this.setViewport);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlController.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlController.detach();
  }

  public attachNode(nodeId: unknown): void {
    this.htmlController.attachNode(nodeId);
  }

  public detachNode(nodeId: unknown): void {
    this.htmlController.detachNode(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    this.htmlController.attachEdge(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    this.htmlController.detachEdge(edgeId);
  }

  public clear(): void {
    this.htmlController.clear();
  }

  public destroy(): void {
    this.trigger.unsubscribe(this.setViewport);

    this.htmlController.destroy();
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    this.htmlController.updateNodeCoordinates(nodeId);
  }

  public updateNodePriority(nodeId: unknown): void {
    this.htmlController.updateNodePriority(nodeId);
  }

  public updateEdgeShape(edgeId: unknown): void {
    this.htmlController.updateEdgeShape(edgeId);
  }

  public renderEdge(edgeId: unknown): void {
    this.htmlController.renderEdge(edgeId);
  }

  public updateEdgePriority(edgeId: unknown): void {
    this.htmlController.updateEdgePriority(edgeId);
  }
}
