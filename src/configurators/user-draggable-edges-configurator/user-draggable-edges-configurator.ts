import { AddEdgeRequest, Canvas, GraphEdge } from "@/canvas";
import { UserDraggableEdgesParams } from "./user-draggable-edges-params";
import { ViewportStore } from "@/viewport-store";
import { UserDraggableEdgesError } from "./user-draggable-edges-error";
import { Point } from "@/point";
import { transformPoint } from "@/transform-point";
import {
  createAddNodeOverlayRequest,
  createOverlayCanvas,
  findPortAtPoint,
  OverlayId,
  OverlayNodeParams,
} from "../shared";
import { DraggablePortsConfigurator } from "../draggable-ports-configurator";

export class UserDraggableEdgesConfigurator {
  private readonly overlayCanvas: Canvas;

  private staticPortId: unknown | null = null;

  private isTargetDragging: boolean = true;

  private draggingEdge: GraphEdge | null = null;

  private readonly onEdgeReattached = (edgeId: unknown): void => {
    this.params.onAfterEdgeReattached(edgeId);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly overlayLayer: HTMLElement,
    private readonly viewportStore: ViewportStore,
    private readonly window: Window,
    private readonly params: UserDraggableEdgesParams,
  ) {
    this.overlayCanvas = createOverlayCanvas(
      this.overlayLayer,
      this.viewportStore,
    );

    DraggablePortsConfigurator.configure(
      this.canvas,
      this.overlayLayer,
      this.window,
      {
        mouseDownEventVerifier: this.params.mouseDownEventVerifier,
        mouseUpEventVerifier: this.params.mouseUpEventVerifier,
        onStopDrag: () => {
          this.resetDragState();
        },
        onPortPointerDown: (portId, cursor) => {
          return this.tryStartEdgeDragging(portId, cursor);
        },
        onPointerMove: (cursor) => {
          this.moveDraggingPort(cursor);
        },
        onPointerUp: (cursor) => {
          this.tryCreateConnection(cursor);
        },
      },
    );
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

  private tryStartEdgeDragging(portId: unknown, cursor: Point): boolean {
    const edgeId = this.params.draggingEdgeResolver(portId);

    if (edgeId === null) {
      return false;
    }

    const edge = this.canvas.graph.getEdge(edgeId);

    if (edge === null) {
      return false;
    }

    const isSourceDragging = portId === edge.from;
    const isTargetDragging = portId === edge.to;

    if (!(isSourceDragging || isTargetDragging)) {
      throw new UserDraggableEdgesError(
        `failed to grab the edge with id of ${edgeId} because it is not adjacent to the port with id of ${portId}`,
      );
    }

    const staticPortId = isSourceDragging ? edge.to : edge.from;
    this.staticPortId = staticPortId;
    this.isTargetDragging = isTargetDragging;
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

    this.draggingEdge = edge;
    this.canvas.removeEdge(edgeId);

    const staticParams: OverlayNodeParams = {
      overlayId: OverlayId.Static,
      portCoords: staticPoint,
      portDirection: staticPort.direction,
    };

    const draggingParams: OverlayNodeParams = {
      overlayId: OverlayId.Dragging,
      portCoords: draggingPoint,
      portDirection: draggingPort.direction,
    };

    const [sourceParams, targetParams] = this.isTargetDragging
      ? [staticParams, draggingParams]
      : [draggingParams, staticParams];

    this.overlayCanvas.addNode(createAddNodeOverlayRequest(sourceParams));
    this.overlayCanvas.addNode(createAddNodeOverlayRequest(targetParams));

    const overlayEdgeShape =
      this.params.draggingEdgeShapeFactory !== null
        ? this.params.draggingEdgeShapeFactory(OverlayId.Edge)
        : edge.shape;

    this.overlayCanvas.addEdge({
      id: OverlayId.Edge,
      from: sourceParams.overlayId,
      to: targetParams.overlayId,
      shape: overlayEdgeShape,
    });

    return true;
  }

  private resetDragState(): void {
    this.draggingEdge = null;
    this.staticPortId = null;
    this.isTargetDragging = true;
    this.overlayCanvas.clear();
  }

  private moveDraggingPort(dragPoint: Point): void {
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const nodeViewCoords: Point = {
      x: dragPoint.x - canvasRect.x,
      y: dragPoint.y - canvasRect.y,
    };

    const matrix = this.canvas.viewport.getViewportMatrix();
    const nodeContentCoords = transformPoint(matrix, nodeViewCoords);

    this.overlayCanvas.updateNode(OverlayId.Dragging, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y,
    });
  }

  private tryCreateConnection(cursor: Point): void {
    const draggingPortId = findPortAtPoint(this.canvas.graph, cursor);
    this.overlayCanvas.removeEdge(OverlayId.Edge);

    if (draggingPortId === null) {
      this.params.onEdgeReattachInterrupted(this.draggingEdge!);
      return;
    }

    const [from, to] = this.isTargetDragging
      ? [this.staticPortId!, draggingPortId]
      : [draggingPortId, this.staticPortId!];

    const request: AddEdgeRequest = {
      from,
      to,
      shape: this.draggingEdge!.shape,
      priority: this.draggingEdge!.priority,
    };

    const processedRequest = this.params.connectionPreprocessor(request);

    if (processedRequest !== null) {
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeReattached);
      this.canvas.addEdge(processedRequest);
      this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeReattached);
    } else {
      this.params.onEdgeReattachPrevented(this.draggingEdge!);
    }
  }
}
