import { LayersMode } from "@/layers";
import { LayersController } from "./layers-controller";
import { GraphStore } from "@/graph-store";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { BackgroundDrawingFn } from "@/background";

export class HtmlController {
  private canvasWrapper: HTMLElement | null = null;

  private readonly host: HTMLElement;

  private readonly nodesContainer: HTMLElement;

  private edgesContainer: HTMLElement;

  private readonly canvas: HTMLCanvasElement;

  private readonly canvasCtx: CanvasRenderingContext2D;

  private readonly hostResizeObserver: ResizeObserver;

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly nodeElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeWrapperElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeIdToWrapperElementMap = new Map<string, HTMLElement>();

  private readonly edgeIdToElementMap = new Map<string, SVGSVGElement>();

  private currentZIndex = 0;

  private readonly layers: { [key in LayersMode]: LayersController } = {
    "edges-on-top": {
      create: () => {
        this.host.appendChild(this.nodesContainer);
        this.host.appendChild(this.edgesContainer);
      },
      update: (sv: number, xv: number, yv: number) => {
        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
        this.edgesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
      },
      moveOnTop: (nodeId: string) => {
        this.currentZIndex += 1;
        const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
        wrapper.style.zIndex = `${this.currentZIndex}`;
      },
    },
    "edges-follow-node": {
      create: () => {
        this.host.appendChild(this.nodesContainer);
        this.edgesContainer = this.nodesContainer;
      },
      update: (sv: number, xv: number, yv: number) => {
        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
      },
      moveOnTop: (nodeId: string) => {
        const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
        this.currentZIndex += 2;
        wrapper.style.zIndex = `${this.currentZIndex}`;
        const edges = this.graphStore.getNodeAdjacentEdges(nodeId);
        edges.forEach((edge) => {
          this.edgeIdToElementMap.get(edge)!.style.zIndex =
            `${this.currentZIndex - 1}`;
        });
      },
    },
    "nodes-on-top": {
      create: () => {
        this.host.appendChild(this.edgesContainer);
        this.host.appendChild(this.nodesContainer);
      },
      update: (sv: number, xv: number, yv: number) => {
        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
        this.edgesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
      },
      moveOnTop: (nodeId: string) => {
        this.currentZIndex += 1;
        const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
        wrapper.style.zIndex = `${this.currentZIndex}`;
      },
    },
  };

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly publicViewportTransformer: PublicViewportTransformer,
    private readonly layersMode: LayersMode,
    private readonly backgroundDrawingFn: BackgroundDrawingFn,
  ) {
    this.host = this.createHost();
    this.canvas = this.createCanvas();
    this.nodesContainer = this.createNodesContainer();
    this.edgesContainer = this.createEdgesContainer();

    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw new Error("unable to get canvas context");
    }

    this.canvasCtx = context;

    this.host.appendChild(this.canvas);

    this.layers[this.layersMode].create();

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
    this.host.removeChild(this.edgesContainer);
    this.host.removeChild(this.nodesContainer);

    if (this.canvasWrapper !== null) {
      this.canvasWrapper.removeChild(this.host);
      this.canvasWrapper = null;
    }
  }

  public applyTransform(): void {
    this.backgroundDrawingFn(this.canvasCtx, this.publicViewportTransformer);

    const [xv, yv] = this.viewportTransformer.getViewCoords(0, 0);
    const sv = this.viewportTransformer.getViewScale();

    this.layers[this.layersMode].update(sv, xv, yv);
  }

  public attachNode(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);

    const wrapper = document.createElement("div");
    wrapper.appendChild(node.element);

    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.zIndex = `${this.currentZIndex}`;
    this.currentZIndex += 1;
    wrapper.style.visibility = "hidden";

    this.nodesContainer.appendChild(wrapper);

    this.nodeElementToIdMap.set(node.element, nodeId);
    this.nodeWrapperElementToIdMap.set(wrapper, nodeId);
    this.nodeIdToWrapperElementMap.set(nodeId, wrapper);

    this.updateNodeCoords(nodeId, node.x, node.y);
    this.nodesResizeObserver.observe(wrapper);

    wrapper.style.visibility = "visible";
  }

  public detachNode(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);

    this.nodesResizeObserver.unobserve(node.element);
    this.nodesContainer.removeChild(node.element);

    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    wrapper.removeChild(node.element);

    this.nodeElementToIdMap.delete(node.element);
    this.nodeWrapperElementToIdMap.delete(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  public attachEdge(edgeId: string): void {
    const edge = this.graphStore.getEdge(edgeId);
    const element = edge.controller.svg;

    element.style.transformOrigin = "50% 50%";
    element.style.position = "absolute";
    element.style.top = "0";
    element.style.left = "0";
    element.style.zIndex = `${this.currentZIndex}`;
    this.currentZIndex += 1;

    this.edgeIdToElementMap.set(edgeId, element);

    this.updateEdgeCoords(edgeId);

    this.edgesContainer.appendChild(element);
  }

  public detachEdge(edgeId: string): void {
    const element = this.edgeIdToElementMap.get(edgeId);
    this.edgeIdToElementMap.delete(edgeId);
    this.edgesContainer.removeChild(element!);
  }

  public moveNodeOnTop(nodeId: string): void {
    this.layers[this.layersMode].moveOnTop(nodeId);
  }

  public updateNodeCoordinates(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);
    const edges = this.graphStore.getNodeAdjacentEdges(nodeId);

    this.updateNodeCoords(nodeId, node.x, node.y);

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

  private createHost(): HTMLDivElement {
    const host = document.createElement("div");

    host.style.width = "100%";
    host.style.height = "100%";
    host.style.position = "relative";
    host.style.overflow = "hidden";

    return host;
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";

    return canvas;
  }

  private createNodesContainer(): HTMLDivElement {
    const nodesContainer = document.createElement("div");

    nodesContainer.style.position = "absolute";
    nodesContainer.style.top = "0";
    nodesContainer.style.left = "0";
    nodesContainer.style.width = "0";
    nodesContainer.style.height = "0";

    return nodesContainer;
  }

  private createEdgesContainer(): HTMLDivElement {
    const edgesContainer = document.createElement("div");

    edgesContainer.style.position = "absolute";
    edgesContainer.style.pointerEvents = "none";
    edgesContainer.style.top = "0";
    edgesContainer.style.left = "0";
    edgesContainer.style.width = "0";
    edgesContainer.style.height = "0";

    return edgesContainer;
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
        const node = this.graphStore.getNode(nodeId!);

        this.updateNodeCoords(nodeId, node.x, node.y);

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

  private updateNodeCoords(nodeId: string, x: number, y: number): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    const { width, height } = wrapper.getBoundingClientRect();
    const sa = this.viewportTransformer.getAbsScale();
    const node = this.graphStore.getNode(nodeId)!;
    const [centerX, centerY] = node.centerFn(width, height);

    wrapper.style.transform = `matrix(1, 0, 0, 1, ${x - sa * centerX}, ${y - sa * centerY})`;
  }

  private updateEdgeCoords(edgeId: string): void {
    const edge = this.graphStore.getEdge(edgeId);
    const portFrom = this.graphStore.getPort(edge.from);
    const portTo = this.graphStore.getPort(edge.to);

    const rectFrom = portFrom.element.getBoundingClientRect();
    const rectTo = portTo.element.getBoundingClientRect();
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
