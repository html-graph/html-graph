import { Layer, LayersMode } from "@/layers";
import { GraphStore } from "@/graph-store";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { BackgroundDrawingFn } from "@/background";
import { createCanvas, createHost } from "./utils";
import { layers } from "./layers";

export class HtmlController {
  private canvasWrapper: HTMLElement | null = null;

  private readonly host = createHost();

  private readonly canvas = createCanvas();

  private readonly canvasCtx: CanvasRenderingContext2D;

  private readonly hostResizeObserver: ResizeObserver;

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly nodeElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeWrapperElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeIdToWrapperElementMap = new Map<string, HTMLElement>();

  private readonly edgeIdToElementMap = new Map<string, SVGSVGElement>();

  private readonly layer: Layer;

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly publicViewportTransformer: PublicViewportTransformer,
    private readonly layersMode: LayersMode,
    private readonly backgroundDrawingFn: BackgroundDrawingFn,
  ) {
    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw new Error("unable to get canvas context");
    }

    this.canvasCtx = context;

    this.host.appendChild(this.canvas);
    this.layer = layers[this.layersMode](this.host);

    this.hostResizeObserver = this.createHostResizeObserver();
    this.hostResizeObserver.observe(this.host);

    this.nodesResizeObserver = this.createNodesResizeObserver();
  }

  public clear(): void {
    Array.from(this.edgeIdToElementMap.keys()).forEach((edgeId) => {
      this.detachEdge(edgeId);
    });

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
    this.layer.destroy();

    this.detach();
  }

  public applyTransform(): void {
    this.backgroundDrawingFn(this.canvasCtx, this.publicViewportTransformer);

    const [xv, yv] = this.viewportTransformer.getViewCoords(0, 0);
    const sv = this.viewportTransformer.getViewScale();

    this.layer.update(sv, xv, yv);
  }

  public attachNode(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);

    const wrapper = document.createElement("div");
    wrapper.appendChild(node!.element);

    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.visibility = "hidden";

    this.layer.appendNodeElement(wrapper);

    this.nodeElementToIdMap.set(node!.element, nodeId);
    this.nodeWrapperElementToIdMap.set(wrapper, nodeId);
    this.nodeIdToWrapperElementMap.set(nodeId, wrapper);

    this.updateNodeCoords(nodeId);
    this.updateNodePriority(nodeId);
    this.nodesResizeObserver.observe(wrapper);

    wrapper.style.visibility = "visible";
  }

  public detachNode(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);

    this.nodesResizeObserver.unobserve(node!.element);

    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    wrapper.removeChild(node!.element);
    this.layer.removeNodeElement(wrapper);

    this.nodeElementToIdMap.delete(node!.element);
    this.nodeWrapperElementToIdMap.delete(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  public attachEdge(edgeId: string): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const element = edge.controller.svg;

    element.style.position = "absolute";
    element.style.top = "0";
    element.style.left = "0";

    this.edgeIdToElementMap.set(edgeId, element);

    this.updateEdgeCoords(edgeId);
    this.updateEdgePriority(edgeId);

    this.layer.appendEdgeElement(element);
  }

  public detachEdge(edgeId: string): void {
    const element = this.edgeIdToElementMap.get(edgeId)!;
    this.edgeIdToElementMap.delete(edgeId);
    this.layer.removeEdgeElement(element);
  }

  public updateNodePriority(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;

    wrapper.style.zIndex = `${node!.priority}`;
  }

  public updateEdgePriority(edgeId: string): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    this.edgeIdToElementMap.get(edgeId)!.style.zIndex = `${edge.priority}`;
  }

  public updateNodeCoordinates(nodeId: string): void {
    const edges = this.graphStore.getNodeAdjacentEdges(nodeId);

    this.updateNodeCoords(nodeId);

    edges.forEach((edge) => {
      this.updateEdgeCoords(edge);
    });
  }

  public updatePortEdges(portId: string): void {
    const edges = this.graphStore.getPortAdjacentEdges(portId);

    edges.forEach((edge) => {
      this.updateEdgeCoords(edge);
    });
  }

  public getViewportDimensions(): [number, number] {
    const rect = this.host.getBoundingClientRect();

    return [rect.width, rect.height];
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

  private updateNodeCoords(nodeId: string): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    const { width, height } = wrapper.getBoundingClientRect();
    const sa = this.viewportTransformer.getAbsScale();
    const node = this.graphStore.getNode(nodeId)!;
    const [centerX, centerY] = node.centerFn(width, height);

    wrapper.style.transform = `matrix(1, 0, 0, 1, ${node.x - sa * centerX}, ${node.y - sa * centerY})`;
  }

  private updateEdgeCoords(edgeId: string): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const portFrom = this.graphStore.getPort(edge.from)!;
    const portTo = this.graphStore.getPort(edge.to)!;

    const rectFrom = portFrom!.element.getBoundingClientRect();
    const rectTo = portTo!.element.getBoundingClientRect();
    const rect = this.host.getBoundingClientRect();

    const [xAbsFrom, yAbsFrom] = this.viewportTransformer.getAbsCoords(
      rectFrom.left - rect.left,
      rectFrom.top - rect.top,
    );

    const [xAbsTo, yAbsTo] = this.viewportTransformer.getAbsCoords(
      rectTo.left - rect.left,
      rectTo.top - rect.top,
    );

    const sa = this.viewportTransformer.getAbsScale();

    const [xCenterFrom, yCenterFrom] = portFrom.centerFn(
      rectFrom.width * sa,
      rectFrom.height * sa,
    );

    const [xCenterTo, yCenterTo] = portTo.centerFn(
      rectTo.width * sa,
      rectTo.height * sa,
    );

    const xAbsCenterFrom = xCenterFrom + xAbsFrom;
    const yAbsCenterFrom = yCenterFrom + yAbsFrom;
    const xAbsCenterTo = xCenterTo + xAbsTo;
    const yAbsCenterTo = yCenterTo + yAbsTo;

    const x = Math.min(xAbsCenterFrom, xAbsCenterTo);
    const y = Math.min(yAbsCenterFrom, yAbsCenterTo);
    const width = Math.abs(xAbsCenterTo - xAbsCenterFrom);
    const height = Math.abs(yAbsCenterTo - yAbsCenterFrom);

    edge.controller.update(x, y, width, height, portFrom, portTo);
  }
}
