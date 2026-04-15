import { Canvas } from "@/canvas";
import { ViewportStore } from "@/viewport-store";
import {
  createAddNodeOverlayRequest,
  createOverlayCanvas,
  DraggablePortsParams,
  findPortAtPoint,
  OverlayId,
  OverlayNodeParams,
  PointInsideVerifier,
} from "../shared";
import { Point } from "@/point";
import { UserConnectablePortsParams } from "./user-connectable-ports-params";
import { DraggablePortsConfigurator } from "../shared";
import { Identifier } from "@/identifier";
import { AddEdgeRequest } from "@/graph-controller";

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
    private readonly pointInsideVerifier: PointInsideVerifier,
    private readonly params: UserConnectablePortsParams,
  ) {
    this.overlayCanvas = createOverlayCanvas(
      this.overlayLayer,
      this.viewportStore,
      this.window,
    );

    const draggablePortsParams: DraggablePortsParams = {
      mouseDownEventVerifier: this.params.mouseDownEventVerifier,
      mouseUpEventVerifier: this.params.mouseUpEventVerifier,
      portDragAllowedVerifier: (portId, cursor) => {
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
        this.resetDragState();
      },
      onPointerOutside: () => {
        const staticPortId = this.staticPortId!;
        const isTargetDragging = this.isTargetDragging;

        this.resetDragState();

        this.params.onEdgeCreationInterrupted({
          staticPortId,
          isDirect: isTargetDragging,
        });
      },
    };

    DraggablePortsConfigurator.configure(
      this.canvas,
      this.window,
      this.pointInsideVerifier,
      draggablePortsParams,
    );
  }

  public static configure(
    canvas: Canvas,
    overlayLayer: HTMLElement,
    viewportStore: ViewportStore,
    win: Window,
    pointInsideVerifier: PointInsideVerifier,
    params: UserConnectablePortsParams,
  ): void {
    new UserConnectablePortsConfigurator(
      canvas,
      overlayLayer,
      viewportStore,
      win,
      pointInsideVerifier,
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

    if (draggingPortId === null) {
      this.params.onEdgeCreationInterrupted({
        staticPortId: this.staticPortId!,
        isDirect: this.isTargetDragging,
      });

      return;
    }

    const staticPortId = this.staticPortId!;
    const sourceId = this.isTargetDragging ? staticPortId : draggingPortId;
    const targetId = this.isTargetDragging ? draggingPortId : staticPortId;

    const request: AddEdgeRequest = { from: sourceId, to: targetId };

    const connectionAllowed = this.params.connectionAllowedVerifier(request);
    const processedRequest = this.params.connectionPreprocessor(request);

    if (connectionAllowed && processedRequest !== null) {
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
