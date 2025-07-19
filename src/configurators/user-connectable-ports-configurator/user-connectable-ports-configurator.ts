import { AddEdgeRequest, Canvas, CanvasParams } from "@/canvas";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { ViewportStore } from "@/viewport-store";
import {
  createAddNodeOverlayRequest,
  isPointInside,
  OverlayNodeParams,
} from "../shared";
import { Point } from "@/point";
import { transformPoint } from "@/transform-point";
import { standardCenterFn } from "@/center-fn";
import { UserConnectablePortsParams } from "./user-connectable-ports-params";

// Responsibility: Configuring ports connectable via drag
export class UserConnectablePortsConfigurator {
  private readonly overlayCanvas: Canvas;

  private readonly staticOverlayId = "static";

  private readonly draggingOverlayId = "dragging";

  private staticPortId: unknown | null = null;

  private isDirect: boolean = true;

  private readonly onAfterPortMarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;
    const elementPortIds = this.canvas.graph.getElementPortsIds(port.element);

    if (elementPortIds.length === 1) {
      this.hookPortEvents(port.element);
    }
  };

  private readonly onBeforePortUnmarked = (portId: unknown): void => {
    const port = this.canvas.graph.getPort(portId)!;
    const elementPortIds = this.canvas.graph.getElementPortsIds(port.element);

    if (elementPortIds.length === 1) {
      this.unhookPortEvents(port.element);
    }
  };

  private readonly onPortMouseDown = (event: MouseEvent): void => {
    const target = event.currentTarget as HTMLElement;

    const isValidEvent =
      this.params.mouseDownEventVerifier(event) &&
      this.isPortConnectionAllowed(target);

    if (!isValidEvent) {
      return;
    }

    event.stopPropagation();

    this.grabPort(target, { x: event.clientX, y: event.clientY });

    this.window.addEventListener("mousemove", this.onWindowMouseMove, {
      passive: true,
    });
    this.window.addEventListener("mouseup", this.onWindowMouseUp, {
      passive: true,
    });
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
    if (!this.params.mouseUpEventVerifier(event)) {
      return;
    }

    this.tryCreateConnection({ x: event.clientX, y: event.clientY });
    this.stopMouseDrag();
  };

  private readonly onPortTouchStart = (event: TouchEvent): void => {
    const target = event.currentTarget as HTMLElement;

    const isValidEvent =
      event.touches.length === 1 && this.isPortConnectionAllowed(target);

    if (!isValidEvent) {
      return;
    }

    event.stopPropagation();

    const touch = event.touches[0];

    this.grabPort(target, { x: touch.clientX, y: touch.clientY });

    this.window.addEventListener("touchmove", this.onWindowTouchMove, {
      passive: true,
    });
    this.window.addEventListener("touchend", this.onWindowTouchFinish, {
      passive: true,
    });
    this.window.addEventListener("touchcancel", this.onWindowTouchFinish, {
      passive: true,
    });
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
      this.stopTouchDrag();
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
    this.canvas.graph.getAllPortIds().forEach((portId) => {
      const port = this.canvas.graph.getPort(portId)!;
      this.unhookPortEvents(port.element);
    });
  };

  private readonly onBeforeDestroy = (): void => {
    this.stopMouseDrag();
    this.stopTouchDrag();

    this.canvas.graph.onAfterPortMarked.unsubscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.unsubscribe(
      this.onBeforePortUnmarked,
    );
    this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private readonly onEdgeCreated = (edgeId: unknown): void => {
    this.params.onAfterEdgeCreated(edgeId);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly overlayLayer: HTMLElement,
    private readonly viewportStore: ViewportStore,
    private readonly window: Window,
    private readonly params: UserConnectablePortsParams,
  ) {
    const graphStore = new GraphStore();

    const htmlView = new CoreHtmlView(
      graphStore,
      this.viewportStore,
      this.overlayLayer,
    );

    const defaults: CanvasParams = {
      nodes: {
        centerFn: standardCenterFn,
        priorityFn: (): number => 0,
      },
      edges: {
        shapeFactory: this.params.edgeShapeFactory,
        priorityFn: (): number => 0,
      },
      ports: {
        direction: 0,
      },
    };

    this.overlayCanvas = new Canvas(
      this.overlayLayer,
      graphStore,
      this.viewportStore,
      htmlView,
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
    params: UserConnectablePortsParams,
  ): void {
    new UserConnectablePortsConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      params,
    );
  }

  private grabPort(portElement: HTMLElement, cursor: Point): void {
    const portId = this.canvas.graph.getElementPortsIds(portElement)[0]!;
    const port = this.canvas.graph.getPort(portId)!;

    this.staticPortId = portId;

    const portType = this.params.connectionTypeResolver(this.staticPortId);

    const portRect = portElement.getBoundingClientRect();
    const portX = portRect.x + portRect.width / 2;
    const portY = portRect.y + portRect.height / 2;

    const canvasRect = this.overlayLayer.getBoundingClientRect();
    const matrix = this.canvas.viewport.getViewportMatrix();

    const portCoords = transformPoint(matrix, {
      x: portX - canvasRect.x,
      y: portY - canvasRect.y,
    });

    const cursorCoords = transformPoint(matrix, {
      x: cursor.x - canvasRect.x,
      y: cursor.y - canvasRect.y,
    });

    const staticPayload: OverlayNodeParams = {
      overlayId: this.staticOverlayId,
      portCoords: portCoords,
      portDirection: port.direction,
    };

    const draggingPayload: OverlayNodeParams = {
      overlayId: this.draggingOverlayId,
      portCoords: cursorCoords,
      portDirection: this.params.dragPortDirection,
    };

    this.isDirect = portType === "direct";

    const sourcePayload = this.isDirect ? staticPayload : draggingPayload;
    const targetPayload = this.isDirect ? draggingPayload : staticPayload;

    this.createOverlayGraph(sourcePayload, targetPayload);
  }

  private hookPortEvents(element: HTMLElement): void {
    element.addEventListener("mousedown", this.onPortMouseDown, {
      passive: true,
    });
    element.addEventListener("touchstart", this.onPortTouchStart, {
      passive: true,
    });
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
    this.isDirect = true;
    this.overlayCanvas.clear();
  }

  private createOverlayGraph(
    sourceParams: OverlayNodeParams,
    targetParams: OverlayNodeParams,
  ): void {
    const addSourceRequest = createAddNodeOverlayRequest(sourceParams);
    this.overlayCanvas.addNode(addSourceRequest);

    const addTargetRequest = createAddNodeOverlayRequest(targetParams);
    this.overlayCanvas.addNode(addTargetRequest);

    this.overlayCanvas.addEdge({
      from: sourceParams.overlayId,
      to: targetParams.overlayId,
    });
  }

  private tryCreateConnection(cursor: Point): void {
    const draggingPortId = this.findPortAtPoint(cursor);

    if (draggingPortId === null) {
      this.params.onEdgeCreationInterrupted(this.staticPortId, this.isDirect);
      return;
    }

    const sourceId = this.isDirect ? this.staticPortId : draggingPortId;
    const targetId = this.isDirect ? draggingPortId : this.staticPortId;

    const request: AddEdgeRequest = { from: sourceId, to: targetId };

    const processedRequest = this.params.connectionPreprocessor(request);

    if (processedRequest !== null) {
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated);
      this.canvas.addEdge(processedRequest);
      this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated);
    } else {
      this.params.onEdgeCreationPrevented(request);
    }
  }

  private moveDraggingNode(dragPoint: Point): void {
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const nodeViewCoords: Point = {
      x: dragPoint.x - canvasRect.x,
      y: dragPoint.y - canvasRect.y,
    };

    const matrix = this.canvas.viewport.getViewportMatrix();
    const nodeContentCoords = transformPoint(matrix, nodeViewCoords);

    this.overlayCanvas.updateNode(this.draggingOverlayId, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y,
    });
  }

  private findPortAtPoint(point: Point): unknown | null {
    const elements = document.elementsFromPoint(point.x, point.y);

    for (const element of elements) {
      const draggingPortId = this.findPortAtElement(element);

      if (draggingPortId !== null) {
        return draggingPortId;
      }
    }

    return null;
  }

  private findPortAtElement(element: Element): unknown | null {
    let elementBuf: Element | null = element;
    let draggingPortId: unknown | null = null;

    while (elementBuf !== null) {
      draggingPortId =
        this.canvas.graph.getElementPortsIds(elementBuf as HTMLElement)[0] ??
        null;

      if (draggingPortId !== null) {
        break;
      }

      elementBuf = elementBuf.parentElement;
    }

    return draggingPortId;
  }

  private isPortConnectionAllowed(portElement: HTMLElement): boolean {
    const portId = this.canvas.graph.getElementPortsIds(portElement)[0]!;

    return this.params.connectionTypeResolver(portId) !== null;
  }
}
