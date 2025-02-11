import { createContainer, createHost, createNodeWrapper } from "./utils";
import { Point } from "@/point";
import { GraphStore } from "@/graph-store";
import { ViewportTransformer } from "@/viewport-transformer";

export class HtmlController {
  private canvasWrapper: HTMLElement | null = null;

  private readonly host = createHost();

  private readonly container = createContainer();

  private readonly nodeIdToWrapperElementMap = new Map<unknown, HTMLElement>();

  private readonly edgeIdToElementMap = new Map<unknown, SVGSVGElement>();

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportTransformer: ViewportTransformer,
  ) {
    this.host.appendChild(this.container);
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

  public applyTransform(): void {
    const m = this.viewportTransformer.getContentMatrix();

    this.container.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.dx}, ${m.dy})`;
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
    this.clear();
    this.detach();

    this.host.removeChild(this.container);
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    const node = this.graphStore.getNode(nodeId)!;
    const { width, height } = node.element.getBoundingClientRect();
    const viewportScale = this.viewportTransformer.getViewportMatrix().scale;
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
    const viewportMatrix = this.viewportTransformer.getViewportMatrix();

    const from: Point = {
      x: viewportMatrix.scale * (rectFrom.left - rect.left) + viewportMatrix.dx,
      y: viewportMatrix.scale * (rectFrom.top - rect.top) + viewportMatrix.dy,
    };

    const to: Point = {
      x: viewportMatrix.scale * (rectTo.left - rect.left) + viewportMatrix.dx,
      y: viewportMatrix.scale * (rectTo.top - rect.top) + viewportMatrix.dy,
    };

    const deltaCenterFrom = portFrom.centerFn(
      rectFrom.width * viewportMatrix.scale,
      rectFrom.height * viewportMatrix.scale,
    );

    const deltaCenterTo = portTo.centerFn(
      rectTo.width * viewportMatrix.scale,
      rectTo.height * viewportMatrix.scale,
    );

    const centerFrom: Point = {
      x: from.x + deltaCenterFrom.x,
      y: from.y + deltaCenterFrom.y,
    };

    const centerTo: Point = {
      x: to.x + deltaCenterTo.x,
      y: to.y + deltaCenterTo.y,
    };

    const x = Math.min(centerFrom.x, centerTo.x);
    const y = Math.min(centerFrom.y, centerTo.y);
    const width = Math.abs(centerTo.x - centerFrom.x);
    const height = Math.abs(centerTo.y - centerFrom.y);

    edge.shape.svg.style.width = `${width}px`;
    edge.shape.svg.style.height = `${height}px`;
    edge.shape.svg.style.transform = `translate(${x}px, ${y}px)`;

    const flipX = centerFrom.x <= centerTo.x ? 1 : -1;
    const flipY = centerFrom.y <= centerTo.y ? 1 : -1;

    edge.shape.render({
      to: { x: width, y: height },
      flipX,
      flipY,
      fromDir: portFrom.direction,
      toDir: portTo.direction,
    });
  }

  public updateEdgePriority(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.shape.svg.style.zIndex = `${edge.priority}`;
  }
}
