import { createContainer, createHost, createNodeWrapper } from "./utils";
import { Point } from "@/point";
import { GraphStore } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { EdgeRenderPort } from "@/edges";
import { HtmlView } from "../html-view";

/**
 * This entity is responsible for HTML modifications
 */
export class CoreHtmlView implements HtmlView {
  private canvasWrapper: HTMLElement | null = null;

  private readonly host = createHost();

  private readonly container = createContainer();

  private readonly nodeIdToWrapperElementMap = new Map<unknown, HTMLElement>();

  private readonly edgeIdToElementMap = new Map<unknown, SVGSVGElement>();

  private readonly applyTransform = (): void => {
    const m = this.viewportStore.getContentMatrix();

    this.container.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.x}, ${m.y})`;
  };

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
  ) {
    this.host.appendChild(this.container);

    this.viewportStore.onAfterUpdate.subscribe(this.applyTransform);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.detach();

    this.canvasWrapper = canvasWrapper;
    this.canvasWrapper.appendChild(this.host);
  }

  public detach(): void {
    if (this.canvasWrapper !== null) {
      this.canvasWrapper.removeChild(this.host);
      this.canvasWrapper = null;
    }
  }

  public attachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;

    const wrapper = createNodeWrapper();

    wrapper.appendChild(node.element);

    this.container.appendChild(wrapper);
    this.nodeIdToWrapperElementMap.set(nodeId, wrapper);

    this.updateNodeCoordinates(nodeId);
    this.updateNodePriority(nodeId);

    wrapper.style.visibility = "visible";
  }

  public detachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;

    wrapper.removeChild(node.element);

    this.container.removeChild(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    this.edgeIdToElementMap.set(edgeId, edge.shape.svg);
    this.container.appendChild(edge.shape.svg);

    this.renderEdge(edgeId);
    this.updateEdgePriority(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    this.container.removeChild(edge.shape.svg);
    this.edgeIdToElementMap.delete(edgeId);
  }

  public clear(): void {
    this.edgeIdToElementMap.forEach((_element, edgeId) => {
      this.detachEdge(edgeId);
    });

    this.nodeIdToWrapperElementMap.forEach((_element, nodeId) => {
      this.detachNode(nodeId);
    });
  }

  public destroy(): void {
    this.viewportStore.onAfterUpdate.unsubscribe(this.applyTransform);

    this.clear();
    this.detach();

    this.host.removeChild(this.container);
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    const node = this.graphStore.getNode(nodeId)!;
    const { width, height } = node.element.getBoundingClientRect();
    const viewportScale = this.viewportStore.getViewportMatrix().scale;
    const center = node.centerFn(width, height);

    const x = node.x - viewportScale * center.x;
    const y = node.y - viewportScale * center.y;

    wrapper.style.transform = `translate(${x}px, ${y}px)`;
  }

  public updateNodePriority(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId);
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;

    wrapper.style.zIndex = `${node!.priority}`;
  }

  public updateEdgeShape(edgeId: unknown): void {
    const element = this.edgeIdToElementMap.get(edgeId)!;

    this.container.removeChild(element);

    const edge = this.graphStore.getEdge(edgeId)!;

    this.edgeIdToElementMap.set(edgeId, edge.shape.svg);
    this.container.appendChild(edge.shape.svg);
  }

  public renderEdge(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const portFrom = this.graphStore.getPort(edge.from)!;
    const portTo = this.graphStore.getPort(edge.to)!;

    const rectFrom = portFrom.element.getBoundingClientRect();
    const rectTo = portTo.element.getBoundingClientRect();
    const rect = this.host.getBoundingClientRect();
    const viewportMatrix = this.viewportStore.getViewportMatrix();

    const from: Point = {
      x: viewportMatrix.scale * (rectFrom.left - rect.left) + viewportMatrix.x,
      y: viewportMatrix.scale * (rectFrom.top - rect.top) + viewportMatrix.y,
    };

    const to: Point = {
      x: viewportMatrix.scale * (rectTo.left - rect.left) + viewportMatrix.x,
      y: viewportMatrix.scale * (rectTo.top - rect.top) + viewportMatrix.y,
    };

    const source: EdgeRenderPort = {
      x: from.x,
      y: from.y,
      width: rectFrom.width * viewportMatrix.scale,
      height: rectFrom.height * viewportMatrix.scale,
      direction: portFrom.direction,
      portId: edge.from,
      nodeId: this.graphStore.getPortNodeId(edge.from),
    };

    const target: EdgeRenderPort = {
      x: to.x,
      y: to.y,
      width: rectTo.width * viewportMatrix.scale,
      height: rectTo.height * viewportMatrix.scale,
      direction: portTo.direction,
      portId: edge.to,
      nodeId: this.graphStore.getPortNodeId(edge.to),
    };

    edge.shape.render({
      from: source,
      to: target,
    });
  }

  public updateEdgePriority(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.shape.svg.style.zIndex = `${edge.priority}`;
  }
}
