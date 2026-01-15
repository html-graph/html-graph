import { AddEdgeRequest, Canvas } from "@/canvas";
import { ViewportStore } from "@/viewport-store";
import {
  createAddNodeOverlayRequest,
  createOverlayCanvas,
  findPortAtPoint,
  OverlayId,
  OverlayNodeParams,
} from "../shared";
import { Point } from "@/point";
import { UserConnectablePortsParams } from "./user-connectable-ports-params";
import { DraggablePortsConfigurator } from "../shared";
import { Identifier } from "@/identifier";

export class UserConnectablePortsConfigurator {
  private readonly overlayCanvas: Canvas;

  private staticPortId: Identifier | null = null;

  private isTargetDragging: boolean = true;

  private readonly onEdgeCreated = (edgeId: Identifier): void => {
    this.params.onAfterEdgeCreated(edgeId);
  };

  private constructor(
    private readonly canvas: Canvas,
    private readonly overlayLayer: HTMLElement,
    private readonly viewportStore: ViewportStore,
    private readonly window: Window,
    private readonly params: UserConnectablePortsParams,
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
          const connectionType = this.params.connectionTypeResolver(portId);

          if (connectionType === null) {
            return false;
          }

          this.grabPort(portId, cursor, connectionType);

          return true;
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

  private grabPort(
    portId: Identifier,
    cursor: Point,
    connectionType: "direct" | "reverse",
  ): void {
    const port = this.canvas.graph.getPort(portId);

    this.staticPortId = portId;

    const portRect = port.element.getBoundingClientRect();
    const portX = portRect.x + portRect.width / 2;
    const portY = portRect.y + portRect.height / 2;

    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const portPoint = this.canvas.viewport.createContentCoords({
      x: portX - canvasRect.x,
      y: portY - canvasRect.y,
    });

    const cursorPoint = this.canvas.viewport.createContentCoords({
      x: cursor.x - canvasRect.x,
      y: cursor.y - canvasRect.y,
    });

    const staticParams: OverlayNodeParams = {
      overlayNodeId: OverlayId.StaticNodeId,
      portCoords: portPoint,
      portDirection: port.direction,
    };

    const draggingParams: OverlayNodeParams = {
      overlayNodeId: OverlayId.DraggingNodeId,
      portCoords: cursorPoint,
      portDirection: this.params.dragPortDirection,
    };

    this.isTargetDragging = connectionType === "direct";

    const [sourceParams, targetParams] = this.isTargetDragging
      ? [staticParams, draggingParams]
      : [draggingParams, staticParams];

    this.overlayCanvas.addNode(createAddNodeOverlayRequest(sourceParams));
    this.overlayCanvas.addNode(createAddNodeOverlayRequest(targetParams));
    this.overlayCanvas.addEdge({
      from: sourceParams.overlayNodeId,
      to: targetParams.overlayNodeId,
      shape: this.params.edgeShapeFactory(OverlayId.EdgeId),
    });
  }

  private resetDragState(): void {
    this.staticPortId = null;
    this.isTargetDragging = true;
    this.overlayCanvas.clear();
  }

  private tryCreateConnection(cursor: Point): void {
    const draggingPortId = findPortAtPoint(this.canvas.graph, cursor);
    const staticPortId = this.staticPortId!;

    if (draggingPortId === null) {
      this.params.onEdgeCreationInterrupted({
        staticPortId,
        isDirect: this.isTargetDragging,
      });

      return;
    }

    const sourceId = this.isTargetDragging ? staticPortId : draggingPortId;
    const targetId = this.isTargetDragging ? draggingPortId : staticPortId;

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

  private moveDraggingPort(dragPoint: Point): void {
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const nodeContentCoords = this.canvas.viewport.createContentCoords({
      x: dragPoint.x - canvasRect.x,
      y: dragPoint.y - canvasRect.y,
    });

    this.overlayCanvas.updateNode(OverlayId.DraggingNodeId, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y,
    });
  }
}
