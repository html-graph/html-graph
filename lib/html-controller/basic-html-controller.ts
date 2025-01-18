import { GraphStore } from "@/graph-store";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { BackgroundDrawingFn } from "@/background";
import { createCanvas, createContainer, createHost } from "./utils";
import { HtmlController } from "./html-controller";

export class BasicHtmlController implements HtmlController {
  private canvasWrapper: HTMLElement | null = null;

  private readonly host = createHost();

  private readonly canvas = createCanvas();

  private readonly container = createContainer();

  private readonly canvasCtx: CanvasRenderingContext2D;

  private readonly hostResizeObserver: ResizeObserver;

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly nodeElementToIdMap = new Map<HTMLElement, unknown>();

  private readonly nodeWrapperElementToIdMap = new Map<HTMLElement, unknown>();

  private readonly nodeIdToWrapperElementMap = new Map<unknown, HTMLElement>();

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly publicViewportTransformer: PublicViewportTransformer,
    private readonly backgroundDrawingFn: BackgroundDrawingFn,
  ) {
    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw new Error("unable to get canvas context");
    }

    this.canvasCtx = context;

    this.host.appendChild(this.canvas);
    this.host.appendChild(this.container);

    this.hostResizeObserver = this.createHostResizeObserver();
    this.hostResizeObserver.observe(this.host);

    this.nodesResizeObserver = this.createNodesResizeObserver();
  }

  public clear(): void {
    Array.from(this.nodeElementToIdMap.values()).forEach((nodeId) => {
      this.detachNode(nodeId);
    });
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

  public destroy(): void {
    this.hostResizeObserver.disconnect();
    this.nodesResizeObserver.disconnect();
    this.host.removeChild(this.canvas);
    this.host.removeChild(this.container);

    this.detach();
  }

  public applyTransform(): void {
    this.backgroundDrawingFn(this.canvasCtx, this.publicViewportTransformer);

    const m = this.viewportTransformer.getContentMatrix();

    this.container.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.dx}, ${m.dy})`;
  }

  public attachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId);

    const wrapper = document.createElement("div");
    wrapper.appendChild(node!.element);

    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.visibility = "hidden";

    this.container.appendChild(wrapper);

    this.nodeElementToIdMap.set(node!.element, nodeId);
    this.nodeWrapperElementToIdMap.set(wrapper, nodeId);
    this.nodeIdToWrapperElementMap.set(nodeId, wrapper);

    this.updateNodeCoords(nodeId);
    this.updateNodePriority(nodeId);
    this.nodesResizeObserver.observe(wrapper);

    wrapper.style.visibility = "visible";
  }

  public detachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId);

    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    this.nodesResizeObserver.unobserve(wrapper);
    wrapper.removeChild(node!.element);
    this.container.removeChild(wrapper);

    this.nodeElementToIdMap.delete(node!.element);
    this.nodeWrapperElementToIdMap.delete(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    edge.shape.attach(this.container);

    this.updateEdgeCoords(edgeId);
    this.updateEdgePriority(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.shape.detach(this.container);
  }

  public updateNodePriority(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId);
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;

    wrapper.style.zIndex = `${node!.priority}`;
  }

  public updateEdgePriority(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.shape.setPriority(edge.priority);
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const edges = this.graphStore.getNodeAdjacentEdges(nodeId);

    this.updateNodeCoords(nodeId);

    edges.forEach((edge) => {
      this.updateEdgeCoords(edge);
    });
  }

  public updatePortEdges(portId: unknown): void {
    const edges = this.graphStore.getPortAdjacentEdges(portId);

    edges.forEach((edge) => {
      this.updateEdgeCoords(edge);
    });
  }

  private createHostResizeObserver(): ResizeObserver {
    return new ResizeObserver(() => {
      this.updateCanvasDimensions();
      this.applyTransform();
    });
  }

  private createNodesResizeObserver(): ResizeObserver {
    return new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const wrapper = entry.target as HTMLElement;
        const nodeId = this.nodeWrapperElementToIdMap.get(wrapper)!;

        this.updateNodeCoords(nodeId);

        const edges = this.graphStore.getNodeAdjacentEdges(nodeId);

        edges.forEach((edge) => {
          this.updateEdgeCoords(edge);
        });
      });
    });
  }

  private updateCanvasDimensions(): void {
    const { width, height } = this.host.getBoundingClientRect();

    this.canvas.width = width;
    this.canvas.height = height;
  }

  private updateNodeCoords(nodeId: unknown): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    const { width, height } = wrapper.getBoundingClientRect();
    const scaleViewport = this.viewportTransformer.getViewportMatrix().scale;
    const node = this.graphStore.getNode(nodeId)!;
    const { x: centerX, y: centerY } = node.centerFn(width, height);

    const x = node.x - scaleViewport * centerX;
    const y = node.y - scaleViewport * centerY;
    wrapper.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y})`;
  }

  private updateEdgeCoords(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const portFrom = this.graphStore.getPort(edge.from)!;
    const portTo = this.graphStore.getPort(edge.to)!;

    const rectFrom = portFrom!.element.getBoundingClientRect();
    const rectTo = portTo!.element.getBoundingClientRect();
    const rect = this.host.getBoundingClientRect();
    const viewportMatrix = this.viewportTransformer.getViewportMatrix();

    const fromX =
      viewportMatrix.scale * (rectFrom.left - rect.left) + viewportMatrix.dx;
    const fromY =
      viewportMatrix.scale * (rectFrom.top - rect.top) + viewportMatrix.dy;
    const toX =
      viewportMatrix.scale * (rectTo.left - rect.left) + viewportMatrix.dx;
    const toY =
      viewportMatrix.scale * (rectTo.top - rect.top) + viewportMatrix.dy;

    const { x: deltaCenterFromX, y: deltaCenterFromY } = portFrom.centerFn(
      rectFrom.width * viewportMatrix.scale,
      rectFrom.height * viewportMatrix.scale,
    );

    const { x: deltaCenterToX, y: deltaCenterToY } = portTo.centerFn(
      rectTo.width * viewportMatrix.scale,
      rectTo.height * viewportMatrix.scale,
    );

    const centerFromX = deltaCenterFromX + fromX;
    const centerFromY = deltaCenterFromY + fromY;
    const centerToX = deltaCenterToX + toX;
    const centerToY = deltaCenterToY + toY;

    const x = Math.min(centerFromX, centerToX);
    const y = Math.min(centerFromY, centerToY);
    const width = Math.abs(centerToX - centerFromX);
    const height = Math.abs(centerToY - centerFromY);

    edge.shape.update(x, y, width, height, portFrom, portTo);
  }
}
