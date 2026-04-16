import { Canvas } from "@/canvas";
import { ViewportStore } from "@/viewport-store";
import {
  createAddNodeOverlayRequest,
  createOverlayCanvas,
  DraggablePortsParams,
  EdgeCreationInProgressParams,
  findPortAtPoint,
  OverlayId,
  OverlayNodeParams,
  PointInsideVerifier,
} from "../shared";
import { Point } from "@/point";
import { UserConnectablePortsParams } from "./user-connectable-ports-params";
import { DraggablePortsConfigurator } from "../shared";
import { Identifier } from "@/identifier";
import { resolveCreateEdgeRequest } from "../shared/resolve-create-edge-request";

export class UserConnectablePortsConfigurator {
  private readonly overlayCanvas: Canvas;

  private edgeInProgress: EdgeCreationInProgressParams | null = null;

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
      onPointerDownVerifier: (portId, cursor) => {
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
        const params = this.edgeInProgress!;

        this.resetDragState();

        this.params.onEdgeCreationInterrupted(params);
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
      portDirection: this.params.dragPortDirection ?? port.direction,
    };

    const isDirect = connectionType === "direct";

    this.edgeInProgress = {
      staticPortId: portId,
      isDirect,
    };

    const [sourceParams, targetParams] = isDirect
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
    this.edgeInProgress = null;
    this.overlayCanvas.clear();
  }

  private tryCreateConnection(cursor: Point): void {
    const targetPortId = findPortAtPoint(this.canvas.graph, cursor);

    if (targetPortId === null) {
      this.params.onEdgeCreationInterrupted(this.edgeInProgress!);

      return;
    }

    const request = resolveCreateEdgeRequest(
      this.edgeInProgress!,
      targetPortId,
    );

    const connectionAllowed = this.params.connectionAllowedVerifier(request);
    const processedRequest = this.params.connectionPreprocessor({
      from: request.from,
      to: request.to,
    });

    if (connectionAllowed && processedRequest !== null) {
      this.canvas.graph.onAfterEdgeAdded.subscribe(this.onEdgeCreated);
      this.canvas.addEdge(processedRequest);
      this.canvas.graph.onAfterEdgeAdded.unsubscribe(this.onEdgeCreated);
    } else {
      this.params.onEdgeCreationPrevented(request);
    }
  }

  private moveDraggingPort(cursor: Point): void {
    const canvasRect = this.overlayLayer.getBoundingClientRect();

    const nodeContentCoords = this.canvas.viewport.createContentCoords({
      x: cursor.x - canvasRect.x,
      y: cursor.y - canvasRect.y,
    });

    this.overlayCanvas.updateNode(OverlayId.DraggingNodeId, {
      x: nodeContentCoords.x,
      y: nodeContentCoords.y,
    });
  }
}
