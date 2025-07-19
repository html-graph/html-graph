import { AddEdgeRequest, Canvas, CanvasParams } from "@/canvas";
import { UserDraggableEdgesParams } from "./user-draggable-edges-params";
import { GraphStore } from "@/graph-store";
import { CoreHtmlView } from "@/html-view";
import { standardCenterFn } from "@/center-fn";
import { ViewportStore } from "@/viewport-store";
import { UserDraggableEdgesError } from "./user-draggable-edges-error";
import { Point } from "@/point";
import { transformPoint } from "@/transform-point";
import { createAddNodeOverlayRequest, isPointInside } from "../shared";

export class UserDraggableEdgesConfigurator {
  private readonly overlayCanvas: Canvas;

  private edgeDragStarted = false;

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
    if (!this.params.mouseDownEventVerifier(event)) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const portId = this.canvas.graph.getElementPortsIds(target)[0]!;

    this.tryStartEdgeDragging(portId, { x: event.x, y: event.y }, event);

    if (!this.edgeDragStarted) {
      return;
    }

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
    if (event.touches.length !== 1) {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const portId = this.canvas.graph.getElementPortsIds(target)[0]!;

    const touch = event.touches[0];

    this.tryStartEdgeDragging(
      portId,
      { x: touch.clientX, y: touch.clientY },
      event,
    );

    if (!this.edgeDragStarted) {
      return;
    }

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

  private readonly onEdgeCreated = (edgeId: unknown): void => {
    this.params.onAfterEdgeReattached(edgeId);
  };

  private readonly onBeforeDestroy = (): void => {
    this.canvas.graph.onAfterPortMarked.unsubscribe(this.onAfterPortMarked);
    this.canvas.graph.onBeforePortUnmarked.unsubscribe(
      this.onBeforePortUnmarked,
    );
    this.canvas.graph.onBeforeClear.unsubscribe(this.onBeforeClear);
    this.canvas.onBeforeDestroy.unsubscribe(this.onBeforeDestroy);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly overlayLayer: HTMLElement,
    private readonly viewportStore: ViewportStore,
    private readonly window: Window,
    private readonly params: UserDraggableEdgesParams,
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
    params: UserDraggableEdgesParams,
  ): void {
    new UserDraggableEdgesConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      params,
    );
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

  private tryStartEdgeDragging(
    portId: unknown,
    cursor: Point,
    event: Event,
  ): void {
    this.edgeDragStarted = false;
    const edgeId = this.params.draggingEdgeResolver(portId);

    if (edgeId === null) {
      return;
    }

    const edge = this.canvas.graph.getEdge(edgeId);

    if (edge === null) {
      return;
    }

    const isSourceDragging = portId === edge.from;
    const isTargetDragging = portId === edge.to;

    if (!(isSourceDragging || isTargetDragging)) {
      throw new UserDraggableEdgesError(
        `failed to grab the edge with id of ${edgeId} because it is not adjacent to the port with id of ${portId}`,
      );
    }

    event.stopPropagation();

    const staticPortId = isSourceDragging ? edge.to : edge.from;
    this.staticPortId = staticPortId;
    this.isDirect = isTargetDragging;
    const draggingPort = this.canvas.graph.getPort(portId)!;
    const staticPort = this.canvas.graph.getPort(staticPortId)!;

    const staticRect = staticPort.element.getBoundingClientRect();
    const staticCoords: Point = {
      x: staticRect.x + staticRect.width / 2,
      y: staticRect.y + staticRect.height / 2,
    };

    const matrix = this.canvas.viewport.getViewportMatrix();
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const staticPoint = transformPoint(matrix, {
      x: staticCoords.x - canvasRect.x,
      y: staticCoords.y - canvasRect.y,
    });

    const draggingPoint = transformPoint(matrix, {
      x: cursor.x - canvasRect.x,
      y: cursor.y - canvasRect.y,
    });

    this.canvas.removeEdge(edgeId);

    this.overlayCanvas.addNode(
      createAddNodeOverlayRequest({
        overlayId: this.draggingOverlayId,
        portCoords: draggingPoint,
        portDirection: draggingPort.direction,
      }),
    );

    this.overlayCanvas.addNode(
      createAddNodeOverlayRequest({
        overlayId: this.staticOverlayId,
        portCoords: staticPoint,
        portDirection: staticPort.direction,
      }),
    );

    // edge shape preprocessor
    this.overlayCanvas.addEdge({
      id: "edge",
      from: isSourceDragging ? this.draggingOverlayId : this.staticOverlayId,
      to: isSourceDragging ? this.staticOverlayId : this.draggingOverlayId,
      shape: edge.shape,
    });

    this.edgeDragStarted = true;
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
    this.edgeDragStarted = false;
    this.staticPortId = null;
    this.isDirect = true;
    this.overlayCanvas.clear();
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

  private tryCreateConnection(cursor: Point): void {
    const draggingPortId = this.findPortAtPoint(cursor);

    if (draggingPortId === null) {
      this.params.onEdgeReattachInterrupted(this.staticPortId, this.isDirect);
      return;
    }

    const sourceId = this.isDirect ? this.staticPortId : draggingPortId;
    const targetId = this.isDirect ? draggingPortId : this.staticPortId;
    const edge = this.overlayCanvas.graph.getEdge("edge")!;
    this.overlayCanvas.removeEdge("edge");

    const request: AddEdgeRequest = {
      from: sourceId,
      to: targetId,
      shape: edge.shape,
    };

    const processedRequest = this.params.connectionPreprocessor(request);

    if (processedRequest !== null) {
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated);
      this.canvas.addEdge(processedRequest);
      this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated);
    } else {
      this.params.onEdgeReattachPrevented(request);
    }
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
}
