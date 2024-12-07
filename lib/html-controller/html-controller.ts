import { DiContainer } from "@/di-container";
import { LayersMode } from "@/layers";
import { LayersController } from "./layers-controller";

export class HtmlController {
  private canvasWrapper: HTMLElement | null = null;

  private readonly host: HTMLElement;

  private readonly nodesContainer: HTMLElement;

  private connectionsContainer: HTMLElement;

  private readonly canvas: HTMLCanvasElement;

  private readonly canvasCtx: CanvasRenderingContext2D;

  private readonly hostResizeObserver: ResizeObserver;

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly nodeElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeWrapperElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeIdToWrapperElementMap = new Map<string, HTMLElement>();

  private readonly connectionIdToElementMap = new Map<string, SVGSVGElement>();

  private currentZIndex = 0;

  private readonly layers: { [key in LayersMode]: LayersController } = {
    "connections-on-top": {
      create: () => {
        this.host.appendChild(this.nodesContainer);
        this.host.appendChild(this.connectionsContainer);
      },
      update: (sv: number, xv: number, yv: number) => {
        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
        this.connectionsContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
      },
      moveOnTop: (nodeId: string) => {
        this.currentZIndex += 1;
        const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
        wrapper.style.zIndex = `${this.currentZIndex}`;
      },
    },
    "connections-follow-node": {
      create: () => {
        this.host.appendChild(this.nodesContainer);
        this.connectionsContainer = this.nodesContainer;
      },
      update: (sv: number, xv: number, yv: number) => {
        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
      },
      moveOnTop: (nodeId: string) => {
        const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
        this.currentZIndex += 2;
        wrapper.style.zIndex = `${this.currentZIndex}`;
        const connections =
          this.di.graphStore.getNodeAdjacentConnections(nodeId);
        connections.forEach((connection) => {
          this.connectionIdToElementMap.get(connection)!.style.zIndex =
            `${this.currentZIndex - 1}`;
        });
      },
    },
    "nodes-on-top": {
      create: () => {
        this.host.appendChild(this.connectionsContainer);
        this.host.appendChild(this.nodesContainer);
      },
      update: (sv: number, xv: number, yv: number) => {
        this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
        this.connectionsContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
      },
      moveOnTop: (nodeId: string) => {
        this.currentZIndex += 1;
        const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
        wrapper.style.zIndex = `${this.currentZIndex}`;
      },
    },
  };

  public constructor(private readonly di: DiContainer) {
    this.host = this.createHost();
    this.canvas = this.createCanvas();
    this.nodesContainer = this.createNodesContainer();
    this.connectionsContainer = this.createConnectionsContainer();

    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw new Error("unable to get canvas context");
    }

    this.canvasCtx = context;

    this.host.appendChild(this.canvas);

    const mode = this.di.options.layers.mode;

    this.layers[mode].create();

    this.hostResizeObserver = this.createHostResizeObserver();
    this.hostResizeObserver.observe(this.host);

    this.nodesResizeObserver = this.createNodesResizeObserver();
  }

  public clear(): void {
    Array.from(this.connectionIdToElementMap.keys()).forEach((connectionId) => {
      this.detachConnection(connectionId);
    });

    Array.from(this.nodeElementToIdMap.values()).forEach((nodeId) => {
      this.detachNode(nodeId);
    });
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.canvasWrapper = canvasWrapper;
    this.canvasWrapper.appendChild(this.host);
  }

  public detach(): void {
    if (this.canvasWrapper !== null) {
      this.canvasWrapper.removeChild(this.host);
    }
  }

  public destroy(): void {
    this.hostResizeObserver.disconnect();
    this.nodesResizeObserver.disconnect();
    this.host.removeChild(this.canvas);
    this.host.removeChild(this.connectionsContainer);
    this.host.removeChild(this.nodesContainer);

    if (this.canvasWrapper !== null) {
      this.canvasWrapper.removeChild(this.host);
    }
  }

  public applyTransform(): void {
    this.canvasCtx.clearRect(
      0,
      0,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
    );

    this.canvasCtx.save();

    this.di.options.background.drawingFn(
      this.canvasCtx,
      this.di.publicViewportTransformer,
    );

    this.canvasCtx.restore();

    const [xv, yv] = this.di.viewportTransformer.getViewCoords(0, 0);
    const sv = this.di.viewportTransformer.getViewScale();

    this.layers[this.di.options.layers.mode].update(sv, xv, yv);
  }

  public attachNode(nodeId: string): void {
    const node = this.di.graphStore.getNode(nodeId);

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
    const node = this.di.graphStore.getNode(nodeId);

    this.nodesResizeObserver.unobserve(node.element);
    this.nodesContainer.removeChild(node.element);

    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    wrapper.removeChild(node.element);

    this.nodeElementToIdMap.delete(node.element);
    this.nodeWrapperElementToIdMap.delete(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  public attachConnection(connectionId: string): void {
    const connection = this.di.graphStore.getConnection(connectionId);
    const element = connection.controller.svg;

    element.style.transformOrigin = "50% 50%";
    element.style.position = "absolute";
    element.style.top = "0";
    element.style.left = "0";
    element.style.zIndex = `${this.currentZIndex}`;
    this.currentZIndex += 1;

    this.connectionIdToElementMap.set(connectionId, element);

    this.updateConnectionCoords(connectionId);

    this.connectionsContainer.appendChild(element);
  }

  public detachConnection(connectionId: string): void {
    const element = this.connectionIdToElementMap.get(connectionId);
    this.connectionIdToElementMap.delete(connectionId);
    this.connectionsContainer.removeChild(element!);
  }

  public moveNodeOnTop(nodeId: string): void {
    this.layers[this.di.options.layers.mode].moveOnTop(nodeId);
  }

  public updateNodePosition(nodeId: string): void {
    const node = this.di.graphStore.getNode(nodeId);
    const connections = this.di.graphStore.getNodeAdjacentConnections(nodeId);

    this.updateNodeCoords(nodeId, node.x, node.y);

    connections.forEach((connection) => {
      this.updateConnectionCoords(connection);
    });
  }

  public updatePortConnections(portId: string): void {
    const connections = this.di.graphStore.getPortAdjacentConnections(portId);

    connections.forEach((connection) => {
      this.updateConnectionCoords(connection);
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

  private createConnectionsContainer(): HTMLDivElement {
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
        const node = this.di.graphStore.getNode(nodeId!);

        this.updateNodeCoords(nodeId, node.x, node.y);

        const connections =
          this.di.graphStore.getNodeAdjacentConnections(nodeId);

        connections.forEach((connection) => {
          this.updateConnectionCoords(connection);
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
    const sa = this.di.viewportTransformer.getAbsScale();
    const node = this.di.graphStore.getNode(nodeId)!;
    const [centerX, centerY] = node.centerFn(width, height);

    wrapper.style.transform = `matrix(1, 0, 0, 1, ${x - sa * centerX}, ${y - sa * centerY})`;
  }

  private updateConnectionCoords(connectionId: string): void {
    const connection = this.di.graphStore.getConnection(connectionId);
    const portFrom = this.di.graphStore.getPort(connection.from);
    const portTo = this.di.graphStore.getPort(connection.to);

    const rectFrom = portFrom.element.getBoundingClientRect();
    const rectTo = portTo.element.getBoundingClientRect();
    const rect = this.host.getBoundingClientRect();

    const [xAbsFrom, yAbsFrom] = this.di.viewportTransformer.getAbsCoords(
      rectFrom.left - rect.left,
      rectFrom.top - rect.top,
    );

    const [xAbsTo, yAbsTo] = this.di.viewportTransformer.getAbsCoords(
      rectTo.left - rect.left,
      rectTo.top - rect.top,
    );

    const sa = this.di.viewportTransformer.getAbsScale();

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

    const element = this.connectionIdToElementMap.get(connectionId)!;

    const flipHor = xAbsCenterFrom <= xAbsCenterTo;
    const flipVert = yAbsCenterFrom <= yAbsCenterTo;

    element.style.transform = `matrix(${flipHor ? 1 : -1}, 0, 0, ${flipVert ? 1 : -1}, ${x}, ${y})`;

    connection.controller.update(x, y, width, height, portFrom, portTo);
  }
}
