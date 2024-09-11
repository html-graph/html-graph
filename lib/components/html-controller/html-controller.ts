import { GraphEventType } from "../../models/events/graph-event-type";
import { DiContainer } from "../di-container/di-container";

export class HtmlController {
  private readonly host: HTMLElement;

  private readonly nodesContainer: HTMLElement;

  private readonly connectionsContainer: HTMLElement;

  private readonly canvas: HTMLCanvasElement;

  private readonly canvasCtx: CanvasRenderingContext2D;

  private readonly hostResizeObserver: ResizeObserver;

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly nodeElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeWrapperElementToIdMap = new Map<HTMLElement, string>();

  private readonly nodeIdToWrapperElementMap = new Map<string, HTMLElement>();

  private readonly connectionIdToElementMap = new Map<string, SVGSVGElement>();

  private grabbedNodeId: string | null = null;

  private readonly onPointerDown = (event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    this.di.eventSubject.dispatch(GraphEventType.GrabViewport);
  };

  private readonly onPointerMove = (event: MouseEvent) => {
    if (event.buttons !== 1) {
      return;
    }

    if (this.grabbedNodeId !== null) {
      this.di.eventSubject.dispatch(GraphEventType.DragNode, {
        nodeId: this.grabbedNodeId,
        dx: event.movementX,
        dy: event.movementY,
      });
    } else {
      this.di.eventSubject.dispatch(GraphEventType.DragViewport, {
        dx: event.movementX,
        dy: event.movementY,
      });
    }
  };

  private readonly onPointerUp = (event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    this.grabbedNodeId = null;
    this.di.eventSubject.dispatch(GraphEventType.Release);
  };

  private readonly onWheelScroll = (event: WheelEvent) => {
    const trigger = this.di.options.scale.trigger;

    if (
      (trigger === "ctrl+wheel" || trigger === "ctrl+shift+wheel") &&
      !event.ctrlKey
    ) {
      return;
    }

    if (
      (trigger === "shift+wheel" || trigger === "ctrl+shift+wheel") &&
      !event.shiftKey
    ) {
      return;
    }

    const { left, top } = this.host.getBoundingClientRect();
    const centerX = event.clientX - left;
    const centerY = event.clientY - top;

    this.di.eventSubject.dispatch(GraphEventType.ScaleViewport, {
      deltaY: event.deltaY,
      centerX,
      centerY,
    });

    if (this.di.options.scale.enabled) {
      event.preventDefault();
    }
  };

  private readonly onNodePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || this.di.options.nodes.draggable == false) {
      return;
    }

    const nodeId = this.nodeElementToIdMap.get(
      event.currentTarget as HTMLElement,
    )!;

    this.grabbedNodeId = nodeId;
    this.di.eventSubject.dispatch(GraphEventType.GrabNode, {
      nodeId,
    });
  };

  constructor(
    private readonly canvasWrapper: HTMLElement,
    private readonly di: DiContainer,
  ) {
    this.host = this.createHost();
    this.host.addEventListener("pointerdown", this.onPointerDown);
    this.host.addEventListener("pointerup", this.onPointerUp);
    this.host.addEventListener("pointermove", this.onPointerMove);
    this.host.addEventListener("wheel", this.onWheelScroll);

    this.canvas = this.createCanvas();
    this.nodesContainer = this.createNodesContainer();
    this.connectionsContainer = this.createConnectionsContainer();

    const context = this.canvas.getContext("2d");

    if (context === null) {
      throw new Error("unable to get canvas context");
    }

    this.canvasCtx = context;

    this.host.appendChild(this.canvas);
    this.host.appendChild(this.connectionsContainer);
    this.host.appendChild(this.nodesContainer);
    this.canvasWrapper.appendChild(this.host);

    this.hostResizeObserver = this.createHostResizeObserver();
    this.hostResizeObserver.observe(this.host);

    this.nodesResizeObserver = this.createNodesResizeObserver();
  }

  clear(): void {
    Array.from(this.connectionIdToElementMap.keys()).forEach((connectionId) => {
      this.detachConnection(connectionId);
    });

    Array.from(this.nodeElementToIdMap.values()).forEach((nodeId) => {
      this.detachNode(nodeId);
    });
  }

  destroy(): void {
    this.host.removeEventListener("pointerdown", this.onPointerDown);
    this.host.removeEventListener("pointerup", this.onPointerUp);
    this.host.removeEventListener("pointermove", this.onPointerMove);
    this.host.removeEventListener("wheel", this.onWheelScroll);
    this.hostResizeObserver.disconnect();
    this.nodesResizeObserver.disconnect();
    this.host.removeChild(this.canvas);
    this.host.removeChild(this.connectionsContainer);
    this.host.removeChild(this.nodesContainer);
    this.canvasWrapper.removeChild(this.host);
  }

  setCursor(type: "grab" | "default"): void {
    this.host.style.cursor = type;
  }

  applyTransform(): void {
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

    const [xv, yv] = this.di.viewportTransformer.getViewportCoords(0, 0);
    const sv = this.di.viewportTransformer.getViewportScale();

    this.nodesContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
    this.connectionsContainer.style.transform = `matrix(${sv}, 0, 0, ${sv}, ${xv}, ${yv})`;
  }

  attachNode(nodeId: string): void {
    const node = this.di.graphStore.getNode(nodeId);

    const wrapper = document.createElement("div");
    wrapper.appendChild(node.element);

    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.visibility = "hidden";

    this.nodesContainer.appendChild(wrapper);

    this.nodeElementToIdMap.set(node.element, nodeId);
    this.nodeWrapperElementToIdMap.set(wrapper, nodeId);
    this.nodeIdToWrapperElementMap.set(nodeId, wrapper);

    this.updateNodeCoords(nodeId, node.x, node.y);
    this.nodesResizeObserver.observe(wrapper);

    wrapper.style.visibility = "visible";
    node.element.addEventListener("pointerdown", this.onNodePointerDown);
  }

  detachNode(nodeId: string): void {
    const node = this.di.graphStore.getNode(nodeId);

    this.nodesResizeObserver.unobserve(node.element);
    this.nodesContainer.removeChild(node.element);

    node.element.removeEventListener("pointerdown", this.onNodePointerDown);

    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    wrapper.removeChild(node.element);

    this.nodeElementToIdMap.delete(node.element);
    this.nodeWrapperElementToIdMap.delete(wrapper);
    this.nodeIdToWrapperElementMap.delete(nodeId);
  }

  attachConnection(connectionId: string): void {
    const connection = this.di.graphStore.getConnection(connectionId);
    const element = connection.controller.createSvg();

    element.style.transformOrigin = "50% 50%";
    element.style.position = "absolute";

    this.connectionIdToElementMap.set(connectionId, element);

    this.updateConnectionCoords(connectionId);

    this.connectionsContainer.appendChild(element);
  }

  detachConnection(connectionId: string): void {
    const element = this.connectionIdToElementMap.get(connectionId);
    this.connectionIdToElementMap.delete(connectionId);
    this.connectionsContainer.removeChild(element!);
  }

  moveNodeOnTop(nodeId: string): void {
    const wrapper = this.nodeIdToWrapperElementMap.get(nodeId)!;
    this.nodesContainer.appendChild(wrapper);
  }

  updateNodePosition(nodeId: string): void {
    const node = this.di.graphStore.getNode(nodeId);
    const connections =
      this.di.graphStore.getAllAdjacentToNodeConnections(nodeId);

    this.updateNodeCoords(nodeId, node.x, node.y);

    connections.forEach((connection) => {
      this.updateConnectionCoords(connection);
    });
  }

  private createHost(): HTMLDivElement {
    const host = document.createElement("div");

    host.style.width = "100%";
    host.style.height = "100%";
    host.style.position = "relative";
    host.style.overflow = "hidden";
    host.style.cursor = "default";

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
          this.di.graphStore.getAllAdjacentToNodeConnections(nodeId);

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
    const sa = this.di.viewportTransformer.getAbsoluteScale();
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

    const [xAbsFrom, yAbsFrom] = this.di.viewportTransformer.getAbsoluteCoords(
      rectFrom.left - rect.left,
      rectFrom.top - rect.top,
    );

    const [xAbsTo, yAbsTo] = this.di.viewportTransformer.getAbsoluteCoords(
      rectTo.left - rect.left,
      rectTo.top - rect.top,
    );

    const [xCenterFrom, yCenterFrom] = portFrom.centerFn(
      rectFrom.width,
      rectFrom.height,
    );

    const [xCenterTo, yCenterTo] = portTo.centerFn(rectTo.width, rectTo.height);

    const sa = this.di.viewportTransformer.getAbsoluteScale();

    const xAbsCenterFrom = xCenterFrom * sa + xAbsFrom;
    const yAbsCenterFrom = yCenterFrom * sa + yAbsFrom;
    const xAbsCenterTo = xCenterTo * sa + xAbsTo;
    const yAbsCenterTo = yCenterTo * sa + yAbsTo;

    const top = Math.min(yAbsCenterFrom, yAbsCenterTo);
    const left = Math.min(xAbsCenterFrom, xAbsCenterTo);
    const width = Math.abs(xAbsCenterTo - xAbsCenterFrom);
    const height = Math.abs(yAbsCenterTo - yAbsCenterFrom);

    const element = this.connectionIdToElementMap.get(connectionId)!;

    const horDir = rectFrom.left <= rectTo.left;
    const vertDir = rectFrom.top <= rectTo.top;

    element.style.transform = `matrix(${horDir ? 1 : -1}, 0, 0, ${vertDir ? 1 : -1}, ${left}, ${top})`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    connection.controller.updateSvg(element, width, height);
  }
}
