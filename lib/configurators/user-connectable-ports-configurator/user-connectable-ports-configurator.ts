import { AddEdgeRequest, Canvas, CanvasDefaults } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView, HtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import { isPointInside } from "../utils";
import { Point } from "@/point";
import { ConnectablePortsOptions, createOptions, Options } from "./options";

/**
 * Responsibility: Configuring ports connectable via drag
 */
export class UserConnectablePortsConfigurator {
  private readonly options: Options;

  private readonly graphStore: GraphStore;

  private readonly htmlView: HtmlView;

  private readonly overlayCanvas: Canvas;

  private readonly ports = new Map<HTMLElement, unknown>();

  private readonly staticId = "static";

  private readonly draggingId = "dragging";

  private staticPortId: unknown | null = null;

  private overlaySourceId: unknown | null = null;

  private overlayTargetId: unknown | null = null;

  private readonly onAfterPortMarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;

    this.hookPortEvents(port.element);

    this.ports.set(port.element, portId);
  };

  private readonly onBeforePortUnmarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;

    this.unhookPortEvents(port.element);

    this.ports.delete(port.element);
  };

  private readonly onPortMouseDown = (event: MouseEvent): void => {
    if (!this.options.mouseDownEventVerifier(event)) {
      return;
    }

    event.stopPropagation();

    this.grabPort(event.currentTarget as HTMLElement);
    this.window.addEventListener("mousemove", this.onWindowMouseMove);
    this.window.addEventListener("mouseup", this.onWindowMouseUp);
  };

  private readonly onWindowMouseMove = (event: MouseEvent): void => {
    const isInside = isPointInside(
      this.window,
      this.overlayLayer,
      event.clientX,
      event.clientY,
    );

    if (!isInside) {
      this.stopMouseDrag();
      return;
    }

    this.moveDraggingNode({ x: event.clientX, y: event.clientY });
  };

  private readonly onWindowMouseUp = (event: MouseEvent): void => {
    this.tryCreateConnection({ x: event.clientX, y: event.clientY });
    this.stopMouseDrag();
  };

  private readonly onPortTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      this.stopTouchDrag();
      return;
    }

    event.stopPropagation();

    this.grabPort(event.currentTarget as HTMLElement);
    this.window.addEventListener("touchmove", this.onWindowTouchMove);
    this.window.addEventListener("touchend", this.onWindowTouchFinish);
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish);
  };

  private readonly onWindowTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];

    const isInside = isPointInside(
      this.window,
      this.overlayLayer,
      touch.clientX,
      touch.clientY,
    );

    if (!isInside) {
      this.stopMouseDrag();
      return;
    }

    this.moveDraggingNode({ x: touch.clientX, y: touch.clientY });
  };

  private readonly onWindowTouchFinish = (event: TouchEvent): void => {
    const touch = event.changedTouches[0];
    this.tryCreateConnection({ x: touch.clientX, y: touch.clientY });
    this.stopTouchDrag();
  };

  private readonly onBeforeClear = (): void => {
    this.ports.forEach((_portId, element) => {
      this.unhookPortEvents(element);
    });

    this.ports.clear();
  };

  private readonly onBeforeDestroy = (): void => {
    this.canvas.graph.onAfterPortMarked.unsubscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.unsubscribe(
      this.onBeforePortUnmarked,
    );
    this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
    this.stopMouseDrag();
    this.stopTouchDrag();
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly overlayLayer: HTMLElement,
    private readonly viewportStore: ViewportStore,
    private readonly window: Window,
    defaults: CanvasDefaults,
    options: ConnectablePortsOptions,
  ) {
    this.options = createOptions(options);
    this.graphStore = new GraphStore();

    this.htmlView = new CoreHtmlView(
      this.graphStore,
      this.viewportStore,
      this.overlayLayer,
    );

    this.overlayCanvas = new Canvas(
      this.overlayLayer,
      this.graphStore,
      this.viewportStore,
      this.htmlView,
      defaults,
    );

    this.canvas.graph.onAfterPortMarked.subscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.subscribe(this.onBeforePortUnmarked);
    this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.subscribe(this.onBeforeDestroy);
  }

  public static configure(
    canvas: Canvas,
    overlayLayer: HTMLElement,
    viewportStore: ViewportStore,
    win: Window,
    defaults: CanvasDefaults,
    options: ConnectablePortsOptions,
  ): void {
    new UserConnectablePortsConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      defaults,
      options,
    );
  }

  private grabPort(portElement: HTMLElement): void {
    const portId = this.ports.get(portElement)!;
    const port = this.canvas.graph.getPort(portId)!;

    this.staticPortId = portId;

    const portType = this.options.connectionTypeResolver(this.staticPortId);

    if (portType === null) {
      this.stopMouseDrag();
      this.stopTouchDrag();
      return;
    }

    const isDirect = portType === "direct";

    this.overlaySourceId = isDirect ? this.staticId : this.draggingId;
    this.overlayTargetId = isDirect ? this.draggingId : this.staticId;

    const rect = portElement.getBoundingClientRect();

    const portX = rect.x + rect.width / 2;
    const portY = rect.y + rect.height / 2;

    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const portViewCoords: Point = {
      x: portX - canvasRect.x,
      y: portY - canvasRect.y,
    };
    const m = this.canvas.viewport.getViewportMatrix();

    const portContentCoords: Point = {
      x: m.scale * portViewCoords.x + m.x,
      y: m.scale * portViewCoords.y + m.y,
    };

    const elementBegin = document.createElement("div");

    this.overlayCanvas.addNode({
      id: this.overlaySourceId,
      element: elementBegin,
      x: portContentCoords.x,
      y: portContentCoords.y,
      ports: [
        {
          id: this.overlaySourceId,
          element: elementBegin,
          direction: port.direction,
        },
      ],
    });

    const elementEnd = document.createElement("div");

    this.overlayCanvas.addNode({
      id: this.overlayTargetId,
      element: elementEnd,
      x: portContentCoords.x,
      y: portContentCoords.y,
      ports: [
        {
          id: this.overlayTargetId,
          element: elementEnd,
        },
      ],
    });

    this.overlayCanvas.addEdge({
      from: this.overlaySourceId,
      to: this.overlayTargetId,
    });
  }

  private hookPortEvents(element: HTMLElement): void {
    element.addEventListener("mousedown", this.onPortMouseDown);
    element.addEventListener("touchstart", this.onPortTouchStart);
  }

  private unhookPortEvents(element: HTMLElement): void {
    element.removeEventListener("mousedown", this.onPortMouseDown);
    element.removeEventListener("touchstart", this.onPortTouchStart);
  }

  private stopMouseDrag(): void {
    this.resetDragState();
    this.window.removeEventListener("mouseup", this.onWindowMouseUp);
    this.window.removeEventListener("mousemove", this.onWindowMouseMove);
  }

  private stopTouchDrag(): void {
    this.resetDragState();
    this.window.removeEventListener("touchmove", this.onWindowTouchMove);
    this.window.removeEventListener("touchend", this.onWindowTouchFinish);
    this.window.removeEventListener("touchcancel", this.onWindowTouchFinish);
  }

  private resetDragState(): void {
    this.staticPortId = null;
    this.overlaySourceId = null;
    this.overlayTargetId = null;
    this.overlayCanvas.clear();
  }

  private tryCreateConnection(cursor: Point): void {
    const draggingPortId = this.getPortAtPoint(cursor);

    if (draggingPortId === null) {
      return;
    }

    const isStaticSource = this.overlaySourceId === this.staticId;

    const sourceId = isStaticSource ? this.staticPortId : draggingPortId;
    const targetId = isStaticSource ? draggingPortId : this.staticPortId;

    const request: AddEdgeRequest = { from: sourceId, to: targetId };

    const processedRequest = this.options.connectionPreprocessor(request);

    if (processedRequest !== null) {
      this.canvas.addEdge(processedRequest);
    }
  }

  private moveDraggingNode(dragPoint: Point): void {
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const nodeViewCoords: Point = {
      x: dragPoint.x - canvasRect.x,
      y: dragPoint.y - canvasRect.y,
    };

    const m = this.canvas.viewport.getViewportMatrix();

    const nodeContentCoords: Point = {
      x: m.scale * nodeViewCoords.x + m.x,
      y: m.scale * nodeViewCoords.y + m.y,
    };

    this.overlayCanvas.updateNode(this.draggingId, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y,
    });
  }

  private getPortAtPoint(point: Point): unknown | null {
    let element = document.elementFromPoint(point.x, point.y);

    if (element === null || !(element instanceof HTMLElement)) {
      return null;
    }

    let draggingPortId: unknown | null = null;

    while (element !== null) {
      draggingPortId = this.ports.get(element as HTMLElement) ?? null;

      if (draggingPortId !== null) {
        break;
      }

      element = element.parentElement;
    }

    return draggingPortId;
  }
}
