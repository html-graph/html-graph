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
    private readonly element: HTMLElement,
  ) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.container);

    this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }

  public attachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;

    const wrapper = createNodeWrapper();

    wrapper.appendChild(node.element);

    this.container.appendChild(wrapper);
    this.nodeIdToWrapperElementMap.set(nodeId, wrapper);

    this.updateNodePosition(nodeId);
    this.updateNodePriority(nodeId);

    wrapper.style.visibility = "visible";
  }

  public detachNode(nodeId: unknown): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;

    wrapper.removeChild(wrapper.firstChild!);

    this.container.removeChild(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    const svg = this.graphStore.getEdge(edgeId)!.shape.svg;

    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);

    this.renderEdge(edgeId);
    this.updateEdgePriority(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    const svg = this.edgeIdToElementMap.get(edgeId)!;

    this.container.removeChild(svg);
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
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform);

    this.clear();

    this.element.removeChild(this.host);
    this.host.removeChild(this.container);
  }

  public updateNodePosition(nodeId: unknown): void {
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
    const viewportFromX = rectFrom.left - rect.left;
    const viewportFromY = rectFrom.top - rect.top;
    const viewportToX = rectTo.left - rect.left;
    const viewportToY = rectTo.top - rect.top;

    const contentFrom: Point = {
      x: viewportMatrix.scale * viewportFromX + viewportMatrix.x,
      y: viewportMatrix.scale * viewportFromY + viewportMatrix.y,
    };

    const contentTo: Point = {
      x: viewportMatrix.scale * viewportToX + viewportMatrix.x,
      y: viewportMatrix.scale * viewportToY + viewportMatrix.y,
    };

    const from: EdgeRenderPort = {
      x: contentFrom.x,
      y: contentFrom.y,
      width: rectFrom.width * viewportMatrix.scale,
      height: rectFrom.height * viewportMatrix.scale,
      direction: portFrom.direction,
      portId: edge.from,
      nodeId: portFrom.nodeId,
    };

    const to: EdgeRenderPort = {
      x: contentTo.x,
      y: contentTo.y,
      width: rectTo.width * viewportMatrix.scale,
      height: rectTo.height * viewportMatrix.scale,
      direction: portTo.direction,
      portId: edge.to,
      nodeId: portTo.nodeId,
    };

    edge.shape.render({ from, to });
  }

  public updateEdgePriority(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.shape.svg.style.zIndex = `${edge.priority}`;
  }
}
